const express = require('express');
const router = express.Router();
const db = require('../db');
const { nanoid } = require('nanoid');

// POST /shorturls
router.post('/shorturls', (req, res) => {
  const { url, shortcode } = req.body;

  // Validate url
  try {
    new URL(url);
  } catch {
    return res.status(400).json({ error: 'url is required and must be a valid URL' });
  }

  // Helper to insert URL
  const insertUrl = (shortId) => {
    db.run(
      'INSERT INTO urls (shortId, originalUrl) VALUES (?, ?)',
      [shortId, url],
      function (err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to insert' });
        }
        res.status(201).json({ shortLink: `http://localhost:3000/${shortId}` });
      }
    );
  };

  // If shortcode provided, check uniqueness
  if (shortcode) {
    db.get('SELECT * FROM urls WHERE shortId = ?', [shortcode], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (row) {
        return res.status(409).json({ error: 'Shortcode unavailable' });
      }
      insertUrl(shortcode);
    });
  } else {
    // Generate unique shortcode
    const generateUniqueShortId = (callback) => {
      const shortId = nanoid(6);
      db.get('SELECT * FROM urls WHERE shortId = ?', [shortId], (err, row) => {
        if (err) return callback(err);
        if (row) return generateUniqueShortId(callback);
        callback(null, shortId);
      });
    };
    generateUniqueShortId((err, shortId) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      insertUrl(shortId);
    });
  }
});

// GET /:shortId
router.get('/:shortId', (req, res) => {
  const { shortId } = req.params;

  db.get('SELECT * FROM urls WHERE shortId = ?', [shortId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!row) {
      return res.status(404).json({ error: 'URL not found' });
    }

    // Log the click (timestamp only)
    const timestamp = new Date().toISOString();
    db.run(
      'INSERT INTO clicks (shortId, timestamp) VALUES (?, ?)',
      [shortId, timestamp],
      (err) => {}
    );

    res.redirect(row.originalUrl);
  });
});

// GET /shorturls/:shortcode - statistics endpoint (simple)
router.get('/shorturls/:shortcode', (req, res) => {
  const { shortcode } = req.params;
  db.get('SELECT * FROM urls WHERE shortId = ?', [shortcode], (err, urlRow) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!urlRow) {
      return res.status(404).json({ error: 'Shortcode not found' });
    }
    db.all('SELECT timestamp FROM clicks WHERE shortId = ?', [shortcode], (err, clicks) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({
        shortcode,
        originalUrl: urlRow.originalUrl,
        totalClicks: clicks.length,
        clicks: clicks.map(c => ({ timestamp: c.timestamp }))
      });
    });
  });
});

module.exports = router;
