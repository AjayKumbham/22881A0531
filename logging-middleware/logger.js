const LOGGING_API_URL = process.env.LOGGING_API_URL ; //  remote logging server url

/**
 * Sends a structured log to a remote logging server.
 * @param {string} stack - 'backend' | 'frontend'
 * @param {string} level - 'debug' | 'info' | 'warn' | 'error' | 'fatal'
 * @param {string} package - 'cache' | 'controller' | 'config' | 'db' | 'domain' | 'handler' | 'route' | 'service' | 'utils' |'middleware' | 'auth'
 * @param {string} message - detailed log message
 */

function Log(stack, level, package, message) {
  const logData = {
    stack,
    level,
    package,
    message
  };

  fetch(LOGGING_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(logData)
  })
  .then(response => {
    if (!response.ok) {
      console.error('Failed to send log:', response.statusText);
    }
  })
  .catch(error => {
    console.error('Error sending log:', error);
  });
}

module.exports = Log;

// Usage example:       
// Log('backend', 'info', 'db', 'Database connection established successfully.');