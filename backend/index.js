//entry point for the backend server
const express = require('express');
const app = express();
const cors = require('cors');
const Log = require('../logging-middleware/logger'); // import the reusable logging utility
const errorLogger = require('./middlewares/logMiddleware');
const errorHandler = require('./middlewares/errorHandler');
const urlRoutes = require('./routes/urls');

//middlewares
app.use(cors()); // enable CORS for all routes
app.use(express.json()); // middleware to parse json bodies
app.use('/', urlRoutes);
app.use(errorLogger);   // logs to remote
app.use(errorHandler);  // sends HTTP response

const PORT = process.env.PORT || 3000;  // if PORT is not set in .env, default to 3000
app.listen(PORT, () => {
  Log('backend', 'info', 'server', `Server is running on http://localhost:${PORT}`);
});