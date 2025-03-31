const express = require('express');
const mongoose = require('mongoose');
const cors    = require('cors');
const dotenv = require('dotenv');


// Routes
const apiRoutes = require('./Routes/apiRoutes');
const defaultRoutes = require('./Routes/defaultRoutes');


// Constants
dotenv.config();
const PORT      = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;


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


// Server
app.listen(PORT, () => {
	console.log(`Iridium Backend @ http://localhost:${PORT}`);
});
