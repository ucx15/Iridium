// Controllers/user.controller.ts


import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import  { randomUUID as uuid } from 'node:crypto';

// Controllers and Models
import  User from '../Models/user.model.js';
import Post from '../Models/post.model.js';

import { genToken } from './auth.controller.js';


// utils
import validateRequestBody from '../utils.js';

// Types
import { Request, Response, RequestHandler } from 'express';


dotenv.config();
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;


// Request Handlers
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

	res.json({
		message: 'Signup successful',
		status: 'success',
		accessToken,
		refreshToken
	});
	console.log(`\t'${body.username}' signed up`);
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


// const myPosts : RequestHandler = async (req: Request, res: Response) => {
// 	res.json({'My Posts' : 'My Posts'});
// }

const myFeed : RequestHandler = async (req: Request, res: Response) => {
	const {body} = validateRequestBody(req.body, ['username']);
	if (!body) {
		console.log(`ERROR: Missing required fields`);
		res.status(400).json({
			message: `Missing required fields`,
			status: 'error'
		});
		return;
	}

	const {username} = body;
	const user = await User.get(username);

	if ( username !== req.username ) {
		console.log(`ERROR: Unauthorized access to feed of '${username}'`);
		res.status(400).json({
			message: `Unauthorized access to feed of '${username}'`,
			status: 'error'
		});
		return;
	}

	if ( !user ) {
		console.log(`ERROR: User '${username}' does not exist`);
		res.status(400).json({
			message: `User '${username}' does not exist`,
			status: 'error'
		});
		return;
	}

	const posts : string[] = [];

	for ( const following of user.following ) {
		const postList = await User.getAllPosts(following);
		for (const postID of postList) {
			posts.push(postID);
		}
	}


	res.status(200).json({
		message: 'Feed fetched successfully',
		status: 'success',
		feed: posts
	});
	// console.log(`INFO: Fetched feed for '${username}'`);
}

const getUser: RequestHandler = async (req: Request, res: Response) => {
	console.log(req.originalUrl);
	const { id } = req.params;
	const userID = id as string;

	if (!userID) {
		console.log(`ERROR: Missing required fields`);
		res.status(400).json({
			message: `Missing required fields`,
			status: 'error'
		});
		return;
	}

	const user = await User.get(userID);

	if ( !user ) {
		console.log(`WARN: User '${userID}' does not exist`);
		res.status(400).json({
			message: `User '${userID}' does not exist`,
			status: 'error'
		});
		return;
	}

	const userData = {
		name: user.name,
		username: user.username,

		createdAt: user.createdAt,
		bio: user.bio,
		profilePicture: user.profilePicture,

		followers: user.followers,
		following: user.following,
		posts : user.posts
	}

	res.json({
		message: 'User fetched successfully',
		status: 'success',
		userData
	});

	console.log(`INFO: Fetched user '${userID}'`);
}

const followUser : RequestHandler = async (req: Request, res: Response) => {
	const {body} = validateRequestBody(req.body, ['follower', 'followee']);

	if ( !body ) {
		console.log(`ERROR: Missing required fields`);
		res.status(400).json({
			message: `Missing required fields`,
			status: 'error'
		});
		return;
	}

	if ( body.follower !== req.username ) {
		console.log(`ERROR: Unauthorized access to follow user '${body.followee}'`);
		res.status(401).json({
			message: `Unauthorized access to follow user '${body.followee}'`,
			status: 'error'
		});
		return;
	}

	const { follower, followee } = body;
	console.log(`POST: Follow User '${follower}' -> '${followee}'`);

	const followerUser = await User.get(follower);
	const followeeUser = await User.get(followee);

	if ( !followerUser || !followeeUser ) {
		console.log(`ERROR: User '${follower}' or '${followee}' does not exist`);
		res.status(400).json({
			message: `User '${follower}' or '${followee}' does not exist`,
			status: 'error'
		});
		return;
	}

	if (follower === followee) {
		console.log(`ERROR: User '${follower}' cannot follow themselves`);
		res.status(400).json({
			message: `User '${follower}' cannot follow themselves`,
			status: 'error'
		});
		return;
	}

	// follower already follows followee
	// or followee already has the follower
	if (
		followerUser.following.includes(followee) ||
		followeeUser.followers.includes(follower)) {
		console.log(`WARN: User '${follower}' already follows '${followee}'`);

		res.status(400).json({
			message: `User '${follower}' already follows '${followee}'`,
			status: 'error'
		});

		return;
	}

	if (! await User.followUser(follower, followee) )  {
		console.log(`ERROR: Unable to follow user '${followee}'`);
		res.status(500).json({
			message: `Unable to follow user '${followee}'`,
			status: 'error'
		});
		return;
	}

	res.status(200).json({
		message: `User '${follower}' followed '${followee}' successfully`,
		status: 'success'
	});

	console.log(`INFO: User '${follower}' followed '${followee}'`);
}

const unfollowUser : RequestHandler = async (req: Request, res: Response) => {
	const {body} = validateRequestBody(req.body, ['unfollower', 'unfollowee']);

	if ( !body ) {
		console.log(`ERROR: Missing required fields`);
		res.status(400).json({
			message: `Missing required fields`,
			status: 'error'
		});
		return;
	}

	if ( body.unfollower !== req.username ) {
		console.log(`ERROR: Unauthorized access to unfollow user '${body.unfollowee}'`);
		res.status(401).json({
			message: `Unauthorized access to unfollow user '${body.unfollowee}'`,
			status: 'error'
		});
		return;
	}

	const { unfollower, unfollowee } = body;
	console.log(`POST: Unfollow User '${unfollower}' -> '${unfollowee}'`);

	if (unfollower === unfollowee) {
		console.log(`ERROR: User '${unfollower}' cannot unfollow themselves`);
		res.status(400).json({
			message: `User '${unfollower}' cannot unfollow themselves`,
			status: 'error'
		});
		return;
	}

	const unfollowerUser = await User.get(unfollower);
	const unfolloweeUser = await User.get(unfollowee);

	if ( !unfollowerUser || !unfolloweeUser ) {
		console.log(`ERROR: User '${unfollower}' or '${unfollowee}' does not exist`);
		res.status(400).json({
			message: `User '${unfollower}' or '${unfollowee}' does not exist`,
			status: 'error'
		});
		return;
	}

	// unfollower already follows unfollowee
	// or unfollowee already has the unfollower
	if (
		!unfollowerUser.following.includes(unfollowee) ||
		!unfolloweeUser.followers.includes(unfollower)) {
		console.log(`WARN: User '${unfollower}' is not following '${unfollowee}'`);

		res.status(400).json({
			message: `User '${unfollower}' is not following '${unfollowee}'`,
			status: 'error'
		});

		return;
	}

	if (! await User.unfollowUser(unfollower, unfollowee) )  {
		console.log(`ERROR: Unable to unfollow user '${unfollowee}'`);
		res.status(500).json({
			message: `Unable to unfollow user '${unfollowee}'`,
			status: 'error'
		});
		return;
	}

	res.status(200).json({
		message: `User '${unfollower}' unfollowed '${unfollowee}' successfully`,
		status: 'success'
	});

	console.log(`INFO: !User '${unfollower}' unfollowed '${unfollowee}'`);
}

// Functions
const addPost = async (username : string, postID : string) : Promise<boolean> => {
	const user = await User.get(username);

	if ( !user ) {
		console.log(`ERROR: User '${username}' does not exist`);
		return false;
	}

	if ( await User.findPost(username, postID) ) {
		console.log(`WARN: user.controller.addPost() -> Post '${postID}' already exists for '${username}'`);
		return false;
	}

	User.addPost(username, postID);
	console.log(`INFO: Added post '${postID}' to '${username}'`);

	return true;
}

export { signup, login , myFeed, addPost, getUser, followUser, unfollowUser};


// TODO: ⚠️IMPORTANT - match body usernames with req.username for authorization in each request⚠️
