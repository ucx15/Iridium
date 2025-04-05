// Controllers/post.controller.ts


import dotenv from 'dotenv';
import { randomUUID as uuid } from 'node:crypto';

// Controllers and Models
import Post from '../Models/post.model.js';
import { addPost as userAddPost } from '../Controllers/user.controller.js';


// utils
import validateRequestBody from '../utils.js';


// Types
import { Request, Response, RequestHandler } from 'express';


dotenv.config();


// Request Handlers
const create : RequestHandler = async (req: Request, res: Response) => {
	const { body, optional } = validateRequestBody(req.body, ['username', 'description'], ['media'])

	if (!body) {
		console.log(`ERROR: Missing required fields`);
		res.status(400).json({
			message: `Missing required fields`,
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
	if ( !await userAddPost(body.username, postID) ) {
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

const get : RequestHandler = async (req: Request, res: Response) => {
	const { id } = req.params;

	// const { body } = validateRequestBody(req.body, ['postID']);

	// if (!body) {
	// 	console.log(`ERROR: Missing required fields`);
	// 	res.status(400).json({
	// 		message: `Missing required fields`,
	// 		status: 'error'
	// 	});
	// 	return;
	// }

	const post = await Post.get(id);

	if (!post) {
		console.log(`ERROR: Post '${id}' does not exist`);
		res.status(400).json({
			message: `Post '${id}' does not exist`,
			status: 'error'
		});
		return;
	}

	res.status(200).json({
		message: 'Post fetched successfully',
		status: 'success',
		post
	});
}

export { create, get};
