/*
  API Routes
  This file contains the routes for the api/
*/

import { Router } from 'express';

import { RequestHandler } from 'express';

import * as authController from '../Controllers/auth.js';
import * as userController from '../Controllers/user.js';


const router = Router();

// user routes
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/refresh-token', authController.refreshAccessToken);

// wildcard route
router.get('/', (req, res) => {
	res.json({
		message: 'Hie from API',
		status: 'success'
	});
});


export default router;
