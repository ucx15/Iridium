const jwt = require('jsonwebtoken');

require('dotenv').config();

const {validateRequestBody} = require('../utils.js');


const ACCESS_TOKEN_SECRET  = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY  = process.env.ACCESS_TOKEN_EXPIRY;

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;


const genToken = (username, type='access') => {
	if ( !(username && username.trim()) ) {
		console.error("ERROR:\t'authController.genToken()' -> Missing required parameters");
		return;
	}

	let tokenSecret;
	let tokenExpiry;

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

	return jwt.sign(
		{ username },
		tokenSecret,
		{ expiresIn: tokenExpiry }
	);
}

const refreshAccessToken = (req, res) => {
	console.log("\nAUTH:\tRefreshing Access Token");

	const body = validateRequestBody(req.body, ['refreshToken', 'username']);
	if ( !body ) {
		console.error("ERROR: 'authController.refreshAccessToken()' -> Missing Refresh Token or Username");
		return res.status(401).json({ message: "Refresh Token not provided", status: "error" });
	}

	const refreshToken = body.refreshToken;
	const username     = body.username;

	jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, data) => {
		if (err) {
			if (err.name === "TokenExpiredError") {
				console.error("WARN:\tRefresh Token expired");
				return res.status(401).json({ message: "Refresh Token expired, Login again", status: "error" });
			}

			console.error("WARN:\tInvalid Refresh Token");
			return res.status(401).json({ message: "Invalid Refresh Token, Login again!", status: "error" });
		}
		if ( data.username !== username ) {
			console.error(`WARN:\tUsername mismatch\tExpected:'${username}'  Provided:'${data.username}'`);
			return res.status(401).json({ message: "Username mismatch. Login again!", status: "error" });
		}

		const newAccessToken = genToken(data.username);
		console.log(`\tNew Access Token: generated for '${data.username}'`);
		res.json({ message: "Access Token refreshed!", status: "success", accessToken: newAccessToken })
	})
}

const authorize = (req, res, next) => {
	console.log(`\nAUTH: Authorizing ${req.method} request to ${req.originalUrl}`);

	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) {
		console.error("ERROR:\t'authController.authorize()' -> Missing Access Token");
		return res.status(401).json({ message: "Missing Access Token!", status: "error" });
	}

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) {
			if (err.name === "TokenExpiredError") {
				console.error("WARN:\t'authController.authorize()' -> Access Token expired");
				return res.status(403).json({ message: "Access Token expired", status: "error" });
			}
			console.error("WARN:\t'authController.authorize()' -> Invalid Access Token");
			return res.status(403).json({ message: "Invalid Access Token", status: "error" });
		}

		req.username = user.username;
		next();
	});
};

module.exports = { authorize, genToken, refreshAccessToken };
