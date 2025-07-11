import { Router } from 'express';
const router = Router();


router.get('/favicon.ico' , (req, res) => {
	// Ignore favicon.ico requests
	res.status(200).json({});
});

router.get('/', (req, res) => {
	res.json({
		message: 'Hie from Iridium Backend',
		status: 'success'
	});
});


// Wildcard route for handling unmatched routes

router.get('*', (req, res) => {
	console.log(`ERROR: GET \t'defaultRoutes.Wildcard() -> ' -> Cannot resolve ${req.method} @ '${req.originalUrl}'`);
	res.status(404).json({
		message: `Cannot resolve GET request to ${req.originalUrl}`,
		status: 'error'
	});
});

router.post('*', (req, res) => {
	console.log(`ERROR: POST \t'defaultRoutes.Wildcard() -> ' -> Cannot resolve ${req.method} @ '${req.originalUrl}'`);
	res.status(404).json({
		message: `Cannot resolve POST request to ${req.originalUrl}`,
		status: 'error'
	});
});

router.put('*', (req, res) => {
	console.log(`ERROR: PUT \t'defaultRoutes.Wildcard() -> ' -> Cannot resolve ${req.method} @ '${req.originalUrl}'`);
	res.status(404).json({
		message: `Cannot resolve PUT request to ${req.originalUrl}`,
		status: 'error'
	});
});

router.delete('*', (req, res) => {
	console.log(`ERROR: DELETE \t'defaultRoutes.Wildcard() -> ' -> Cannot resolve ${req.method} @ '${req.originalUrl}'`);
	res.status(404).json({
		message: `Cannot resolve DELETE request to ${req.originalUrl}`,
		status: 'error'
	});
});


export default router;
