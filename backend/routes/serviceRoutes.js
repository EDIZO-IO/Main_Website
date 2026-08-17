const express = require('express');
const pool = require('../db');
const router = express.Router();

const parseService = (row) => {
  const parseJsonField = (field) => {
    if (!field) return [];
    if (typeof field === 'object') return field;
    try {
      return JSON.parse(field);
    } catch (e) {
      return typeof field === 'string' ? field.split('\n').map(s => s.trim()).filter(Boolean) : [];
    }
  };

  return {
    ...row,
    category: row.category_name || row.category || 'General',
    features: parseJsonField(row.features),
    pricing_tiers: parseJsonField(row.pricing_tiers),
    faqs: parseJsonField(row.faqs)
  };
};

router.get('/', async (req, res) => {
  try {
    let rows = [];
    try {
      [rows] = await pool.query(`
        SELECT s.*, c.name as category_name 
        FROM services s 
        LEFT JOIN service_categories c ON s.category_id = c.id
        ORDER BY s.created_at DESC
      `);
    } catch (e) {
      [rows] = await pool.query('SELECT * FROM services ORDER BY created_at DESC');
    }
    res.json(rows.map(parseService));
  } catch (error) {
    console.error("Fetch services error:", error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    let rows = [];
    try {
      [rows] = await pool.query(`
        SELECT s.*, c.name as category_name 
        FROM services s 
        LEFT JOIN service_categories c ON s.category_id = c.id
        WHERE s.id = ? OR s.uuid = ?
      `, [req.params.id, req.params.id]);
    } catch (e) {
      [rows] = await pool.query('SELECT * FROM services WHERE id = ?', [req.params.id]);
    }

    if (rows.length === 0) return res.status(404).json({ error: 'Service not found' });
    res.json(parseService(rows[0]));
  } catch (error) {
    console.error("Fetch service details error:", error);
    res.status(500).json({ error: 'Failed to fetch service details' });
  }
});

module.exports = router;
