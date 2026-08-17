const whatsappService = require('../services/whatsappService');

exports.getStatus = (req, res) => {
  try {
    const status = whatsappService.getStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get WhatsApp status' });
  }
};

exports.logout = async (req, res) => {
  try {
    const success = await whatsappService.logout();
    if (success) {
      res.json({ message: 'Logged out successfully' });
    } else {
      res.status(500).json({ error: 'Failed to log out' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to log out' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const stats = await whatsappService.getQueueStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get WhatsApp stats' });
  }
};
