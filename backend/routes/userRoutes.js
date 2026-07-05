const express = require('express');
const pool = require('../db');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/dashboard', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;
  try {
    if (role === 'client') {
      const [requests] = await pool.query('SELECT * FROM service_requests WHERE user_id = ? ORDER BY created_at DESC', [userId]);
      return res.json({ role, requests });
    } else {
      const [applications] = await pool.query('SELECT * FROM applications WHERE user_id = ? ORDER BY created_at DESC', [userId]);
      return res.json({ role, applications });
    }
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

router.post('/applications', authenticateToken, async (req, res) => {
  try {
    const { internship_id, status } = req.body;
    const user_id = req.user.id;
    const [result] = await pool.query(
      'INSERT INTO applications (user_id, internship_id, status) VALUES (?, ?, ?)',
      [user_id, internship_id, status || 'pending']
    );
    res.json({ success: true, id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

router.post('/requests', authenticateToken, async (req, res) => {
  try {
    const { service_id, requirements, status } = req.body;
    const user_id = req.user.id;
    const [result] = await pool.query(
      'INSERT INTO service_requests (user_id, service_id, requirements, status) VALUES (?, ?, ?, ?)',
      [user_id, service_id, requirements, status || 'pending']
    );
    res.json({ success: true, id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit service request' });
  }
});

module.exports = router;
