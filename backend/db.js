// Database connection (sqlite3)
const sqlite3 = require('sqlite3').verbose();
const Log = require('../logging-middleware/logger');

const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    Log('backend', 'error', 'db', `Database connection failed: ${err.message}`);
  } else {
    Log('backend', 'info', 'db', 'Database connection established successfully.');
    // Ensure urls table has creationDate and expiresAt
    db.run(`CREATE TABLE IF NOT EXISTS urls (
      shortId TEXT PRIMARY KEY,
      originalUrl TEXT NOT NULL,
      creationDate TEXT DEFAULT CURRENT_TIMESTAMP,
      expiresAt TEXT
    )`);
    // Create clicks table for statistics
    db.run(`CREATE TABLE IF NOT EXISTS clicks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shortId TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      referrer TEXT,
      location TEXT,
      FOREIGN KEY(shortId) REFERENCES urls(shortId)
    )`);
  }
});

module.exports = db;