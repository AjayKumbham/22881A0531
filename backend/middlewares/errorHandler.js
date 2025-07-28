const Log = require('../../logging-middleware/logger');

function errorHandler(err, req, res, next) {
  Log('backend', 'error', 'handler', err.message || 'Internal Server Error');
  res.status(500).json({ error: err.message || 'Internal Server Error' });
}

module.exports = errorHandler;
