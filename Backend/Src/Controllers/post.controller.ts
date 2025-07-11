// Controllers/post.controller.ts


import dotenv from 'dotenv';
import { randomUUID as uuid } from 'node:crypto';

// Controllers and Models
import Post from '../Models/post.model.js';
import User from '../Models/user.model.js';

import { addPost as userAddPost } from '../Controllers/user.controller.js';


// utils
import validateRequestBody from '../utils.js';


// Types
import { Request, Response, RequestHandler } from 'express';


dotenv.config();


// Request Handlers
const create: RequestHandler = async (req: Request, res: Response) => {
	const { body, optional } = validateRequestBody(req.body, ['username', 'description'], ['media'])

	if (!body) {
		console.log(`ERROR: Missing required fields`);
		res.status(400).json({
			message: `Missing required fields`,
			status: 'error'
		});
		return;
	}

	if ( body.username !== req.username ) {
		console.log(`ERROR: Unauthorized access to feed of '${body.username}'`);
		res.status(401).json({
			message: `Unauthorized access to feed of '${body.username}'`,
			status: 'error'
		});
		return;
	}

	let media: string[] | undefined;

	if (optional) {
		media = optional?.media;
	}

	const postID = uuid();

	// Check if post already exists
	if (await Post.find(postID)) {
		const errMsg = `Post : '${postID}' already exists`;
		console.log(`ERROR: ${errMsg}`);

		res.status(400).json({
			message: errMsg,
			status: 'error'
		});

		return;
	};

	// Sanity Check if 'POST' already in user's posts
	// NOTE: Not required
	if (!await userAddPost(body.username, postID)) {
		const errMsg = `Failed to add post for user '${body.username}'`;
		console.log(`ERROR: ${errMsg}`);
		res.status(500).json({
			message: errMsg,
			status: 'error'
		});
		return;
	}

	Post.create(
		postID,
		body.username,
		body.description,
		media
	);

	res.status(200).json({
		message: 'Post created successfully',
		status: 'success'
	});

	console.log(`INFO: Post by '${body.username}' created successfully\n`);
}

const get: RequestHandler = async (req: Request, res: Response) => {
	const { id } = req.params;

	const post = await Post.get(id);

	if (!post) {
		console.log(`ERROR: Post '${id}' does not exist`);
		res.status(400).json({
			message: `Post '${id}' does not exist`,
			status: 'error'
		});
		return;
	}

	const user = await User.details(post.by);

	if (!user) {
		console.log(`ERROR: User '${post.by}' does not exist. Changing post by to 'deleted'`);
		post.by = 'deleted';

		res.status(400).json({
			message: `Post '${id}' is orphaned and has been deleted`,
			status: 'error'
		});
		return;
	}

	let userProj = { username: user.username, name: user.name };

	res.status(200).json({
		message: 'Post fetched successfully',
		status: 'success',
		post,
		user: userProj
	});
}


const getBatch: RequestHandler = async (req: Request, res: Response) => {
	// const {body} = validateRequestBody(req.body, ['postIDs', 'username']);
	const { postIDs, username } = req.body;

	if (!req.body || req.body.postIDs === undefined || req.body.username === undefined) {
		console.log(`ERROR: Missing required fields`);
		res.status(400).json({
			message: `Missing required fields`,
			status: 'error'
		});
		return;
	}

	if (username !== req.username) {
		console.log(`ERROR: Unauthorized access to feed of '${username}'`);
		res.status(400).json({
			message: `Unauthorized access to feed of '${username}'`,
			status: 'error'
		});
		return;
	}

	const posts = await Post.getBatch(postIDs);

	res.status(200).json({
		posts,
		message: 'Batch fetch successful',
		status: 'success',
	});
}

// TODO: Make it hard delete
const deletePost: RequestHandler = async (req: Request, res: Response) => {
	const { body } = validateRequestBody(req.body, ['uuid', 'username']);

	if (!body) {
		console.log(`ERROR: Missing required fields`);
		res.status(400).json({
			message: `Missing required fields`,
			status: 'error'
		});
		return;
	}

	// Check if body user matches token user
	if ( body.username !== req.username ) {
		console.log(`ERROR: Unauthorized access to delete post'`);
		res.status(401).json({
			message: `Unauthorized access to delete post'`,
			status: 'error'
		});
		return;
	}

	// Check if post exists
	if (!await Post.find(body.uuid)) {
		console.log(`ERROR: Post '${body.uuid}' does not exist`);
		res.status(400).json({
			message: `Post '${body.uuid}' does not exist`,
			status: 'error'
		});
		return;
	}

	// TODO: remove from user array of posts

	// Delete post

	if (!await Post.deletePost(body.uuid)) {
		console.log(`ERROR: Failed to delete post '${body.uuid}'`);
		res.status(500).json({
			message: `Failed to delete post '${body.uuid}'`,
			status: 'error'
		});
		return;
	};

	console.log(`INFO: Post '${body.uuid}' deleted successfully`);

	res.status(200).json({
		message: 'Post deleted successfully',
		status: 'success'
	});
}

const like: RequestHandler = async (req: Request, res: Response) => {
	const {body} = validateRequestBody(req.body, ['postID', 'username']);

	if (!body) {
		console.log(`ERROR: Missing required fields`);
		res.status(400).json({
			message: `Missing required fields`,
			status: 'error'
		});
		return;
	}

	// provided username doesn't match the token username
	if ( body.username !== req.username ) {
		console.log(`ERROR: Unauthorized access to like a post`);
		res.status(400).json({
			message: `Unauthorized access to like a post`,
			status: 'error'
		});
		return;
	}

	// Check if post exists
	if (!await Post.find(body.postID)) {
		console.log(`ERROR: Post '${body.postID}' does not exist`);
		res.status(400).json({
			message: `Post '${body.postID}' does not exist`,
			status: 'error'
		});
		return;
	}

	else if (!await User.find(body.username)) {
		console.log(`ERROR: User '${body.username}' does not exist`);
		res.status(400).json({
			message: `User '${body.username}' does not exist`,
			status: 'error'
		});
		return;
	}

	if ( !await Post.like(body.postID, body.username) ) {
		console.log(`ERROR: Failed to like post '${body.postID}' by user '${body.username}'`);
		res.status(500).json({
			message: `Failed to like post '${body.postID}'`,
			status: 'error'
		});
		return;
	}

	if ( !await User.likePost(body.username, body.postID) ) {
		console.log(`ERROR: Failed to like post '${body.postID}' by user '${body.username}'`);
		res.status(500).json({
			message: `Failed to like post '${body.postID}'`,
			status: 'error'
		});
		return;
	}

	res.status(200).json({
		message: 'Post liked successfully',
		status: 'success'
	});
}

const unlike: RequestHandler = async (req: Request, res: Response) => {
	const {body} = validateRequestBody(req.body, ['postID', 'username']);

	if (!body) {
		console.log(`ERROR: Missing required fields`);
		res.status(400).json({
			message: `Missing required fields`,
			status: 'error'
		});
		return;
	}

	// provided username doesn't match the token username
	if ( body.username !== req.username ) {
		console.log(`ERROR: Unauthorized access to unlike a post`);
		res.status(400).json({
			message: `Unauthorized access to unlike a post`,
			status: 'error'
		});
		return;
	}

	// Check if post exists
	if (!await Post.find(body.postID)) {
		console.log(`ERROR: Post '${body.postID}' does not exist`);
		res.status(400).json({
			message: `Post '${body.postID}' does not exist`,
			status: 'error'
		});
		return;
	}

	else if (!await User.find(body.username)) {
		console.log(`ERROR: User '${body.username}' does not exist`);
		res.status(400).json({
			message: `User '${body.username}' does not exist`,
			status: 'error'
		});
		return;
	}

	if ( !await Post.unlike(body.postID, body.username) ) {
		console.log(`ERROR: Failed to unlike post '${body.postID}' by user '${body.username}'`);
		res.status(500).json({
			message: `Failed to unlike post '${body.postID}'`,
			status: 'error'
		});
		return;
	}
	if ( !await User.unlikePost(body.username, body.postID) ) {
		console.log(`ERROR: Failed to unlike post '${body.postID}' by user '${body.username}'`);
		res.status(500).json({
			message: `Failed to unlike post '${body.postID}'`,
			status: 'error'
		});
		return;
	}

	res.status(200).json({
		message: 'Post unliked successfully',
		status: 'success'
	});
}

export { create, get, getBatch, deletePost , like, unlike };
