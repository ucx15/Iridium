/*
  API Routes
  This file contains the routes for the api/
*/

import { Router } from 'express';

import { RequestHandler } from 'express';

import * as authController from '../Controllers/auth.controller.js';
import * as userController from '../Controllers/user.controller.js';
import * as postController from '../Controllers/post.controller.js';


const router = Router();

// user routes
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/refresh-token', authController.refreshAccessToken);
// router.post('/my-posts', authController.authorize, userController.myPosts);
router.post('/my-feed', authController.authorize, userController.myFeed);

// post routes
router.post('/post/create', authController.authorize, postController.create);
router.get('/post/:id', authController.authorize, postController.get);

// wildcard route
router.get('/', (req, res) => {
	res.json({
		message: 'Hie from API',
		status: 'success'
	});
});


export default router;
