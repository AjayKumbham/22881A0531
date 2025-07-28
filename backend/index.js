//entry point for the backend server
const express = require('express');
const app = express();
const cors = require('cors');
const Log = require('../logging-middleware/logger'); // import the reusable logging utility

//middlewares
app.use(cors()); // enable CORS for all routes
app.use(express.json()); // middleware to parse json bodies
app.use(Log); // use the logging middleware

const PORT = process.env.PORT || 3000;  // if PORT is not set in .env, default to 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});