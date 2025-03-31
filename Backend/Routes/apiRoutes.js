/*
  API Routes
  This file contains the routes for the api/
*/

const router = require('express').Router();

const authController = require('../Controllers/auth');
const userController = require('../Controllers/user');


// wildcard route
router.get('/', (req, res) => {
	res.json({
		message: 'Hie from API',
		status: 'success'
	});
});


// user routes
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/refresh-token', authController.refreshAccessToken);


module.exports = router;
