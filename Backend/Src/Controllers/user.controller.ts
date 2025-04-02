// Controllers/user.controller.ts


import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import  { randomUUID as uuid } from 'node:crypto';

// Controllers and Models
import  User from '../Models/user.model.js';
import { genToken } from './auth.controller.js';

import validateRequestBody from '../utils.js';

// Types
import { Request, Response, RequestHandler } from 'express';


dotenv.config();

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;


// Functions
const signup : RequestHandler = async (req: Request, res: Response) => {
	console.log("\nPOST: User Signup");
	const {body} = validateRequestBody(req.body, ['email', 'username', 'name', 'password']);

	if (!body) {
		console.log(`ERROR:\t'userController.signup()' -> Missing required fields`);
		res.status(400).json({
			message: `Missing required fields`,
			status: 'error'
		});
		return;
	}

	if (await User.find(body.username)) {
		console.log(`WARN: '${body.username}' already exists`);
		res.status(400).json({
			message: `User '${body.username}' already exists`,
			status: 'error'
		});
		return;
	}

	User.create(
		uuid(),
		body.email,
		body.username,
		await bcrypt.hash(body.password, SALT_ROUNDS),
		body.name,
	);

	const accessToken = genToken(body.username, 'access');
	const refreshToken = genToken(body.username, 'refresh');

	console.log(`\t'${body.username}' signed up`);
	res.json({
		message: 'Signup successful',
		status: 'success',
		accessToken,
		refreshToken
	});
};


const login : RequestHandler = async (req: Request, res: Response) => {
	console.log("\nPOST: User Login");
	const {body} = validateRequestBody(req.body, ['username', 'password']);

	if ( !body ) {
		console.log(`ERROR: Missing required fields`);
		res.status(400).json({
			message: `Missing required fields`,
			status: 'error'
		});
		return;
	}

	const user = await User.get(body.username);

	if (!user) {
		console.log(`ERROR: User '${body.username}' does not exist`);
		res.status(400).json({
			message: `User '${body.username}' does not exist`,
			status: 'error'
		});
		return;
	}

	if (! await bcrypt.compare(body.password, user.password)) {
		console.log(`ERROR: Incorrect password for '${body.username}'`);
		res.status(400).json({
			message: `Incorrect password for ${body.username}`,
			status: 'error'
		});
		return;
	}

	const accessToken = genToken(body.username, 'access');
	const refreshToken = genToken(body.username, 'refresh');

	console.log(`\t'${body.username}' logged in`);
	res.json({
		message: 'Login successful',
		accessToken,
		refreshToken,
		status: 'success'
	});
};

export { signup, login };
