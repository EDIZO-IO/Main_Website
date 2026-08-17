const express = require('express');
const router = express.Router();
const db = require('../db');
const whatsappService = require('../services/whatsappService');

// Helper to get client IP
const getClientIp = (req) => {
  return (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || req.ip || null;
};

// @route   POST /api/contact
// @desc    Submit a contact message
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    const ipAddress = getClientIp(req);
    const userAgent = req.headers['user-agent'] || null;

    let result;
    try {
      [result] = await db.query(
        'INSERT INTO contact_messages (name, email, subject, message, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?)',
        [name, email, subject || 'General Inquiry', message, ipAddress, userAgent]
      );
    } catch (e) {
      [result] = await db.query(
        'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
        [name, email, subject || 'General Inquiry', message]
      );
    }

    if (phone) {
      const waMessage = `Hi ${name},\n\nThank you for reaching out to EDIZO!\n\nWe have received your message regarding "${subject || 'General Inquiry'}". Our team will review your inquiry and get back to you shortly.\n\nBest regards,\nEDIZO Team`;
      whatsappService.enqueueMessage(phone, waMessage);
    }

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
