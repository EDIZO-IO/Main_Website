const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM testimonials WHERE status = 'active' ORDER BY created_at DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

module.exports = router;
