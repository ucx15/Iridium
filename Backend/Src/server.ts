// Server.ts

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';


// Routes
import apiRoutes from './Routes/apiRoutes.js';
import defaultRoutes from './Routes/defaultRoutes.js';


// Constants
dotenv.config();
const PORT      = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI as string;


// Database Connection
mongoose.connect(MONGO_URI)
	.then(() => console.log('DB: Connected to MongoDB'))
	.catch(err => console.error('DB Connection Error:', err));


// Express Setup
const app = express();


// Middlewares
app.use(express.json());
app.use(cors({origin: '*', credentials: true}));


// Routing
app.use('/api', apiRoutes);
app.use('/', defaultRoutes);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});


// Server
app.listen(PORT, () => {
	console.log(`Iridium Backend @ http://localhost:${PORT}`);
});
