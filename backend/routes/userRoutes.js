const express = require('express');
const pool = require('../db');
const { authenticateToken } = require('../middleware/authMiddleware');
const whatsappService = require('../services/whatsappService');
const router = express.Router();

const getClientIp = (req) => {
  return (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || req.ip || null;
};

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
    const { internship_id, first_name, last_name, email, linkedin, why_select, resume, resume_url, status } = req.body;
    const user_id = req.user.id;
    const ipAddress = getClientIp(req);
    const userAgent = req.headers['user-agent'] || null;

    // Fetch user details for defaults
    const [userRows] = await pool.query('SELECT name, email, phone FROM users WHERE id = ?', [user_id]);
    const userObj = userRows[0] || {};
    
    const nameParts = (userObj.name || '').split(' ');
    const fName = first_name || nameParts[0] || 'Applicant';
    const lName = last_name || nameParts.slice(1).join(' ') || 'User';
    const userEmail = email || userObj.email || req.user.email;
    const resumeFile = resume_url || resume || null;

    let result;
    try {
      [result] = await pool.query(
        'INSERT INTO applications (user_id, internship_id, first_name, last_name, email, linkedin, why_select, resume_url, status, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [user_id, internship_id, fName, lName, userEmail, linkedin || null, why_select || null, resumeFile, status || 'pending', ipAddress, userAgent]
      );
    } catch (e) {
      [result] = await pool.query(
        'INSERT INTO applications (user_id, internship_id, first_name, last_name, email, linkedin, why_select, resume_url, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [user_id, internship_id, fName, lName, userEmail, linkedin || null, why_select || null, resumeFile, status || 'pending']
      );
    }

    // Send WhatsApp notification if user phone exists
    if (userObj.phone) {
      const waMessage = `Hi ${fName},\n\nThank you for applying for an internship at EDIZO!\n\nYour application has been received successfully. Our team will review your profile and get back to you with the next steps shortly.\n\nBest regards,\nEDIZO Team`;
      whatsappService.enqueueMessage(userObj.phone, waMessage);
    }

    res.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

router.post('/requests', authenticateToken, async (req, res) => {
  try {
    const { service_id, requirements, project_details, budget, status } = req.body;
    const user_id = req.user.id;
    const ipAddress = getClientIp(req);
    const userAgent = req.headers['user-agent'] || null;

    let result;
    try {
      [result] = await pool.query(
        'INSERT INTO service_requests (user_id, service_id, requirements, project_details, budget, status, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [user_id, service_id, requirements || null, project_details || null, budget || null, status || 'pending', ipAddress, userAgent]
      );
    } catch (e) {
      [result] = await pool.query(
        'INSERT INTO service_requests (user_id, service_id, requirements, status) VALUES (?, ?, ?, ?)',
        [user_id, service_id, requirements || null, status || 'pending']
      );
    }

    // Fetch user details to send WhatsApp notification
    const [userRows] = await pool.query('SELECT name, phone FROM users WHERE id = ?', [user_id]);
    if (userRows.length > 0 && userRows[0].phone) {
      const waMessage = `Hi ${userRows[0].name},\n\nThank you for choosing EDIZO!\n\nWe have received your service request. Our team will review your requirements and reach out to you to discuss the project in detail.\n\nBest regards,\nEDIZO Team`;
      whatsappService.enqueueMessage(userRows[0].phone, waMessage);
    }

    res.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Submit service request error:', error);
    res.status(500).json({ error: 'Failed to submit service request' });
  }
});

// DPDP Consent Logging Endpoint
router.post('/consent', async (req, res) => {
  try {
    const { email, consent_type, granted } = req.body;
    const userId = req.user ? req.user.id : null;
    const ipAddress = getClientIp(req);
    const userAgent = req.headers['user-agent'] || null;

    await pool.query(
      'INSERT INTO consent_logs (user_id, email, consent_type, granted, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, email || null, consent_type || 'privacy_policy', granted !== false, ipAddress, userAgent]
    );

    res.json({ success: true, message: 'Consent logged successfully' });
  } catch (error) {
    console.error('Consent logging error:', error);
    res.status(500).json({ error: 'Failed to log consent' });
  }
});

module.exports = router;
