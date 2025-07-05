import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


import validateRequestBody from '../utils.js';

// types
import { Request, Response, NextFunction, RequestHandler } from 'express';


dotenv.config();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;


if (!ACCESS_TOKEN_SECRET || !ACCESS_TOKEN_EXPIRY || !REFRESH_TOKEN_SECRET || !REFRESH_TOKEN_EXPIRY) {
	console.error("ERROR:\t'authController.js' -> Missing environment variables for JWT tokens. Check your .env file.");
	process.exit(1);
}


interface JwtPayload {
	username: string;
	iat?: number;
	exp?: number;
}


const genToken = (username: string, type: 'access' | 'refresh' = 'access'): string | undefined => {
	if (!(username && username.trim())) {
		console.error("ERROR:\t'authController.genToken()' -> Missing required parameters");
		return;
	}

	let tokenSecret: jwt.Secret;
	let tokenExpiry: string | number;

	switch (type) {
		case 'access':
			tokenSecret = ACCESS_TOKEN_SECRET;
			tokenExpiry = ACCESS_TOKEN_EXPIRY;
			break;

		case 'refresh':
			tokenSecret = REFRESH_TOKEN_SECRET;
			tokenExpiry = REFRESH_TOKEN_EXPIRY;
			break;

		default:
			console.error(`ERROR:\t'authController.genToken()' -> Invalid token type. Expected 'access' or 'refresh' but got '${type}'`);
			return;
	}

	if (!isNaN(Number(tokenExpiry))) {
		tokenExpiry = Number(tokenExpiry);
	}

	return jwt.sign(
		{ username },
		tokenSecret,
		{ expiresIn: tokenExpiry as jwt.SignOptions['expiresIn'] }
	);
}


const refreshAccessToken : RequestHandler = (req: Request, res: Response) => {
	console.log("\nAUTH:\tRefreshing Access Token");

	const {body} = validateRequestBody(req.body, ['refreshToken', 'username']);
	if (!body) {
		console.error("ERROR: 'authController.refreshAccessToken()' -> Missing Refresh Token or Username");
		res.status(401).json({ message: "'Refresh Token' or 'username' not provided in body", status: "error" });
		return;
	}

	const refreshToken = body.refreshToken;
	const username = body.username;

	jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, data) => {
		if (err) {
			if (err.name === "TokenExpiredError") {
				console.error("WARN:\tRefresh Token expired");
				res.status(401).json({ message: "Refresh Token expired, Login again", status: "error" });
			}
			else {
				console.error("WARN:\tInvalid Refresh Token");
				res.status(401).json({ message: "Invalid Refresh Token, Login again!", status: "error" });
			}
			return;
		}

		data = data as JwtPayload;
		if (data.username !== username) {
			console.error(`WARN:\tUsername mismatch\tExpected:'${username}'  Provided:'${data.username}'`);
			res.status(401).json({ message: "Username mismatch. Login again!", status: "error" });
			return;
		}

		const newAccessToken = genToken(data.username);
		console.log(`\tNew Access Token: generated for '${data.username}'`);
		res.json({ message: "Access Token refreshed!", status: "success", accessToken: newAccessToken });
	})
}


const authorize = (req: Request, res: Response, next: NextFunction) => {
	console.log(`AUTH [${Date.now()}]: ${req.method} -> ${req.originalUrl}`);

	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) {
		console.error("ERROR:\t'authController.authorize()' -> Missing Access Token");
		res.status(401).json({ message: "Access Token Missing! 🔴", status: "error" });
		return;
	}

	jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) {
			if (err.name === "TokenExpiredError") {
				console.error("WARN:\t'authController.authorize()' -> Access Token expired");
				res.status(403).json({ message: "Access Token Expired", status: "error" });
			}
			else {
				console.error("WARN:\t'authController.authorize()' -> Invalid Access Token");
				res.status(403).json({ message: "Invalid Access Token 🔴", status: "error" });
			}
			return;
		}

		const payload = user as JwtPayload;
		if (!payload.username) {
			console.error("ERROR:\t'authController.authorize()' -> Invalid Access Token payload");
			res.status(403).json({ message: "Invalid Access Token payload", status: "error" });
			return;
		}

		req.username = payload.username;
		next();
	});
};

export { authorize, genToken, refreshAccessToken };
