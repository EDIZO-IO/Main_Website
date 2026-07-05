const express = require('express');
const router = express.Router();
const db = require('../db');

// @route   POST /api/contact
// @desc    Submit a contact message
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    const [result] = await db.query(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name, email, subject || 'General Inquiry', message]
    );

    res.status(201).json({ message: 'Message sent successfully', id: result.insertId });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ message: 'Server error while saving message' });
  }
});

// @route   GET /api/contact/config
// @desc    Get contact configuration for public display
// @access  Public
router.get('/config', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM contact_config LIMIT 1');
    res.json(rows[0] || {});
  } catch (error) {
    console.error('Error fetching contact config:', error);
    res.status(500).json({ message: 'Server error fetching config' });
  }
});

module.exports = router;
