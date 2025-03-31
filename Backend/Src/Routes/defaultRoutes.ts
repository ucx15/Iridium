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

router.get('*', (req, res) => {
	console.log(`ERROR:\t'defaultRoutes.*' -> Cannot resolve ${req.method} @ '${req.originalUrl}'`);
	res.status(404).json({
		message: '404 Not Found',
		status: 'error'
	});
});


export default router;
