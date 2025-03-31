// User Controller

const bcrypt = require('bcrypt');
const { v4: uuid } = require('uuid');


const User = require('../Models/user');
const authController = require('./auth.js');


const {validateRequestBody} = require('../utils.js');


require('dotenv').config();

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;


// Functions
const signup = async (req, res) => {
	console.log("\nPOST: User Signup");
	const body = validateRequestBody(req.body, ['email', 'username', 'name', 'password']);

	if ( !body ) {
		console.log(`ERROR:\t'userController.signup()' -> Missing required fields`);
		return res.status(400).json({
			message: `Missing required fields`,
			status: 'error'
		});
	}

	if ( await User.find(body.username) ) {
		console.log(`WARN: '${body.username}' already exists`);
		return res.status(400).json({
			message: `User '${body.username}' already exists`,
			status: 'error'
		});
	}

	User.create(
		uuid(),
		body.email,
		body.username,
		await bcrypt.hash(body.password, SALT_ROUNDS),
		body.name,
	);

	const accessToken  = authController.genToken(body.username, 'access');
	const refreshToken = authController.genToken(body.username, 'refresh');

	console.log(`\t'${body.username}' signed up`);
	res.json({
		message: 'Signup successful',
		status: 'success',
		accessToken,
		refreshToken
	});

};

const login = async (req, res) => {
	console.log("\nPOST: User Login");
	const body = validateRequestBody(req.body, ['username', 'password']);

	if (!body) {
		console.log(`ERROR: Missing required fields`);
		return res.status(400).json({
			message: `Missing required fields`,
			status: 'error'
		});
	}

	const user = await User.get(body.username);

	if (!user) {
		console.log(`ERROR: User '${body.username}' does not exist`);
		return res.status(400).json({
			message: `User '${body.username}' does not exist`,
			status: 'error'
		});
	}

	if (! await bcrypt.compare(body.password, user.password)) {
		console.log(`ERROR: Incorrect password for '${body.username}'`);
		return res.status(400).json({
			message: `Incorrect password for ${body.username}`,
			status: 'error'
		});
	}

	const accessToken  = authController.genToken(body.username, 'access');
	const refreshToken = authController.genToken(body.username, 'refresh');

	console.log(`\t'${body.username}' logged in`);
	res.json({
		message: 'Login successful',
		accessToken,
		refreshToken,
		status: 'success'
	});
};

module.exports = { signup, login };
