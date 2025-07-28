// Database connection (sqlite3)
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Database connection error: ' + err.message);
    // Log the error using the logging utility
    Log('backend', 'error', 'db', `Database connection failed: ${err.message}`);
  } else {
    // Log successful connection
    Log('backend', 'info', 'db', 'Database connection established successfully.');
  }
});

module.exports = db;