const express = require('express');
const pool = require('../db');
const router = express.Router();

const parseInternship = (row) => {
  let syllabus = [];
  let benefits = [];
  
  if (row.syllabus) {
    try {
      syllabus = typeof row.syllabus === 'string' ? JSON.parse(row.syllabus) : row.syllabus;
    } catch (e) {
      syllabus = row.syllabus.split('\n').map(s => ({ title: s.trim() })).filter(s => s.title);
    }
  }

  if (row.benefits) {
    try {
      benefits = typeof row.benefits === 'string' ? JSON.parse(row.benefits) : row.benefits;
    } catch (e) {
      benefits = row.benefits.split('\n').map(s => s.trim()).filter(Boolean);
    }
  }

  return {
    ...row,
    category: row.category_name || row.category || 'General',
    syllabus,
    benefits
  };
};

router.get('/', async (req, res) => {
  try {
    let rows = [];
    try {
      [rows] = await pool.query(`
        SELECT i.*, c.name as category_name 
        FROM internships i 
        LEFT JOIN internship_categories c ON i.category_id = c.id
        ORDER BY i.id DESC
      `);
    } catch (e) {
      [rows] = await pool.query('SELECT * FROM internships ORDER BY id DESC');
    }
    res.json(rows.map(parseInternship));
  } catch (error) {
    console.error("Fetch internships error:", error);
    res.status(500).json({ error: 'Failed to fetch internships' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    let rows = [];
    try {
      [rows] = await pool.query(`
        SELECT i.*, c.name as category_name 
        FROM internships i 
        LEFT JOIN internship_categories c ON i.category_id = c.id
        WHERE i.id = ? OR i.uuid = ?
      `, [req.params.id, req.params.id]);
    } catch (e) {
      [rows] = await pool.query('SELECT * FROM internships WHERE id = ?', [req.params.id]);
    }

    if (rows.length === 0) return res.status(404).json({ error: 'Internship not found' });
    res.json(parseInternship(rows[0]));
  } catch (error) {
    console.error("Fetch internship details error:", error);
    res.status(500).json({ error: 'Failed to fetch internship details' });
  }
});

module.exports = router;
