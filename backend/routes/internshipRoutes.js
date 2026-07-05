const express = require('express');
const pool = require('../db');
const router = express.Router();

const parseInternship = (row) => ({
  ...row,
  syllabus: row.syllabus ? JSON.parse(row.syllabus) : [],
  benefits: row.benefits ? JSON.parse(row.benefits) : []
});

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM internships');
    res.json(rows.map(parseInternship));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch internships' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM internships WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Internship not found' });
    res.json(parseInternship(rows[0]));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch internship details' });
  }
});

module.exports = router;

