// Controllers/post.controller.ts


import dotenv from 'dotenv';
import { randomUUID as uuid } from 'node:crypto';

// Controllers and Models
import Post from '../Models/post.model.js';

import validateRequestBody from '../utils.js';

// Types
import { Request, Response, RequestHandler } from 'express';


dotenv.config();


// Request Handlers
const create = async (req: Request, res: Response) => {

	const { body, optional} = validateRequestBody(req.body, ['username', 'description'], ['media'])

	if ( !body ) {
		console.log(`ERROR: Missing required fields`);
		res.status(400).json({
			message: `Missing required fields`,
			status: 'error'
		});
		return;
	}

	let media : string[] | undefined;

	if (optional) {
		media = optional?.media;
	}

	Post.create(
		uuid(),
		body.username,
		body.description,
		media
	);

	console.log(`Post by '${body.username}' created successfully`);

	res.status(200).json({
		message: 'Post created successfully',
		status: 'success'
	});
}


export { create };
