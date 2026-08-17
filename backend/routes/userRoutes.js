const express = require('express');
const pool = require('../db');
const { authenticateToken } = require('../middleware/authMiddleware');
const whatsappService = require('../services/whatsappService');
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

    // Fetch user details to send WhatsApp notification
    const [userRows] = await pool.query('SELECT name, phone FROM users WHERE id = ?', [user_id]);
    if (userRows.length > 0 && userRows[0].phone) {
      const waMessage = `Hi ${userRows[0].name},\n\nThank you for applying for an internship at EDIZO!\n\nYour application has been received successfully. Our team will review your profile and get back to you with the next steps shortly.\n\nBest regards,\nEDIZO Team`;
      whatsappService.enqueueMessage(userRows[0].phone, waMessage);
    }

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

    // Fetch user details to send WhatsApp notification
    const [userRows] = await pool.query('SELECT name, phone FROM users WHERE id = ?', [user_id]);
    if (userRows.length > 0 && userRows[0].phone) {
      const waMessage = `Hi ${userRows[0].name},\n\nThank you for choosing EDIZO!\n\nWe have received your service request. Our team will review your requirements and reach out to you to discuss the project in detail.\n\nBest regards,\nEDIZO Team`;
      whatsappService.enqueueMessage(userRows[0].phone, waMessage);
    }

    res.json({ success: true, id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit service request' });
  }
});

module.exports = router;
