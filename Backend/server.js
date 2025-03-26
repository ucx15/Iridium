const utils   = require("node:util");
const express = require('express');
// const cors    = require('cors');
// const uuid    = require('uuid');


// Constants
const PORT = 5000;
const HOST = "localhost"

const app = express();
// app.use(cors({origin: '*', credentials: true}));
app.use(express.json());


app.post('/*', (req, res) => {
	console.log(req.url);
	res.status(200).json({message: 'Hola', status:'success'});
})

app.get('/*', (req, res) => {
	console.log(req.url);
	res.status(200).json({message: 'Hola', status:'success'});
})


// Server
app.listen(PORT, () => {
	console.log(`Backend Running @ http://${HOST}:${PORT}`);
});
