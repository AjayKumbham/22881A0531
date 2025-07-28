const Log = require('../../logging-middleware/logger');

function errorLogger(err, req, res, next) {
  Log('backend', 'error', 'handler', err.message);
  next(err); // pass to global error handler
}

module.exports = errorLogger;
