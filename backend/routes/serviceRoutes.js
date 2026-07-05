const express = require('express');
const pool = require('../db');
const router = express.Router();

const parseService = (row) => ({
  ...row,
  features: row.features ? JSON.parse(row.features) : []
});

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM services ORDER BY created_at DESC');
    res.json(rows.map(parseService));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM services WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Service not found' });
    res.json(parseService(rows[0]));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch service details' });
  }
});

module.exports = router;

