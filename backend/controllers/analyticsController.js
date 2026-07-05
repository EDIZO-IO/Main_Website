const db = require('../db');

exports.getDashboardStats = async (req, res) => {
  try {
    const [[users]] = await db.query('SELECT COUNT(*) as count FROM users');
    const [[applications]] = await db.query('SELECT COUNT(*) as count FROM applications');
    const [[messages]] = await db.query('SELECT COUNT(*) as count FROM contact_messages');
    
    // Additional queries can be added here (e.g. traffic, popular services)
    
    res.json({
      users: users.count,
      applications: applications.count,
      messages: messages.count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};
