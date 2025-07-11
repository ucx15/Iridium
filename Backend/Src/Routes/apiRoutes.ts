/*
  API Routes
  This file contains the routes for the api/
*/

import { Router } from 'express';

import { RequestHandler } from 'express';

import * as authController from '../Controllers/auth.controller.js';
import * as userController from '../Controllers/user.controller.js';
import * as postController from '../Controllers/post.controller.js';
import * as searchController from '../Controllers/search.controller.js';


const router = Router();


// TODO: Change token related HTTP codes to 401 Unauthorized in frontend and backend


// auth routes
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/refresh-token', authController.refreshAccessToken);

// TODO: rename '/my-feed' to '/user/feed'
// user routes
router.get('/user/:id', userController.getUser);
router.post('/my-feed', authController.authorize, userController.myFeed);
router.post('/follow', authController.authorize, userController.followUser);
router.post('/unfollow', authController.authorize, userController.unfollowUser);


// post routes
router.post('/post/create', authController.authorize, postController.create);
router.post('/posts/batch-fetch', authController.authorize, postController.getBatch);

router.put('/post/like', authController.authorize, postController.like);
router.put('/post/unlike', authController.authorize, postController.unlike);

router.delete('/post/:id', authController.authorize, postController.deletePost);
router.get('/post/:id', authController.authorize, postController.get);


// search routes
router.post('/search', authController.authorize, searchController.search);


// wildcard route
router.get('/', (req, res) => {
	res.json({
		message: 'Hie from API',
		status: 'success'
	});
});


export default router;
