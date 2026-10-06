const db = require('../db');
const whatsappService = require('../services/whatsappService');

exports.getStatus = (req, res) => {
  try {
    const status = whatsappService.getStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get WhatsApp status' });
  }
};

exports.logout = async (req, res) => {
  try {
    const success = await whatsappService.logout();
    if (success) {
      res.json({ success: true, message: 'Logged out successfully' });
    } else {
      res.status(500).json({ success: false, error: 'Failed to log out' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to log out' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const stats = await whatsappService.getQueueStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get WhatsApp stats' });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, phone, message, status, created_at 
       FROM whatsapp_queue 
       ORDER BY created_at DESC LIMIT 50`
    );
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    console.error('Failed to get WhatsApp logs:', error.message);
    res.status(500).json({ success: false, error: 'Failed to get WhatsApp logs' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { phone, message } = req.body;
    if (!phone || !message) {
      return res.status(400).json({ success: false, message: 'Phone number and message are required' });
    }
    const success = await whatsappService.enqueueMessage(phone, message);
    if (success) {
      res.json({ success: true, message: 'Message queued for dispatch' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to queue message' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error queueing message' });
  }
};
