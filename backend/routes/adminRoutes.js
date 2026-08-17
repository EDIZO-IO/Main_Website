const express = require('express');
const pool = require('../db');
const { authenticateAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authenticateAdmin);

router.get('/stats', async (req, res) => {
  try {
    const [users] = await pool.query('SELECT COUNT(*) as count FROM users');
    const [applications] = await pool.query('SELECT COUNT(*) as count FROM applications');
    const [requests] = await pool.query('SELECT COUNT(*) as count FROM service_requests');
    res.json({
      users: users[0].count,
      applications: applications[0].count,
      requests: requests[0].count
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

router.get('/recent-activity', async (req, res) => {
  try {
    const [recentUsers] = await pool.query('SELECT id, name, email, role, created_at, "user" as type FROM users ORDER BY created_at DESC LIMIT 5');
    const [recentApps] = await pool.query('SELECT a.id, u.name, a.internship_id as target, a.status, a.created_at, "application" as type FROM applications a JOIN users u ON a.user_id = u.id ORDER BY a.created_at DESC LIMIT 5');
    const [recentReqs] = await pool.query('SELECT r.id, u.name, r.service_id as target, r.status, r.created_at, "request" as type FROM service_requests r JOIN users u ON r.user_id = u.id ORDER BY r.created_at DESC LIMIT 5');
    
    // Merge and sort
    const allActivity = [...recentUsers, ...recentApps, ...recentReqs]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 8);
      
    res.json(allActivity);
  } catch (error) {
    console.error("fetch recent activity error:", error);
    res.status(500).json({ error: 'Failed to fetch recent activity' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
    res.json(users);
  } catch (error) {
    console.error("fetch users error:", error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/applications', async (req, res) => {
  try {
    const [apps] = await pool.query(`
      SELECT a.*, u.name as user_name, u.email as user_email
      FROM applications a
      JOIN users u ON a.user_id = u.id
      ORDER BY a.created_at DESC
    `);
    res.json(apps);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

router.get('/requests', async (req, res) => {
  try {
    const [reqs] = await pool.query(`
      SELECT r.*, u.name as user_name, u.email as user_email
      FROM service_requests r
      JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
    `);
    res.json(reqs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// Helper functions for parsing text to arrays
const parseTextToObjects = (text) => {
  if (!text) return JSON.stringify([]);
  if (Array.isArray(text)) return JSON.stringify(text);
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return JSON.stringify(parsed);
  } catch(e) {}
  return JSON.stringify(text.split('\n').map(line => ({ title: line.trim() })).filter(item => item.title.length > 0));
};

const parseTextToStrings = (text) => {
  if (!text) return JSON.stringify([]);
  if (Array.isArray(text)) return JSON.stringify(text);
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return JSON.stringify(parsed);
  } catch(e) {}
  return JSON.stringify(text.split('\n').map(line => line.trim()).filter(line => line.length > 0));
};

// Admin Internships CRUD
router.post('/internships', async (req, res) => {
  const { title, category, company, duration, mode, description, syllabus, benefits, eligibility, status, stipend, price, skill_level, image } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO internships (title, category, company, duration, mode, description, syllabus, benefits, eligibility, status, stipend, price, skill_level, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        title || null, category || null, company || null, duration || null, mode || null, description || null, 
        parseTextToObjects(syllabus), parseTextToObjects(benefits), eligibility || null, status || 'active', 
        stipend || null, price || '0', skill_level || 'beginner', image || '/images/internship.png'
      ]
    );
    res.json({ id: result.insertId, title, category, company, duration, mode, description, status });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create internship' });
  }
});

router.put('/internships/:id', async (req, res) => {
  const { id } = req.params;
  const { title, category, company, duration, mode, description, syllabus, benefits, eligibility, status, stipend, price, skill_level, image } = req.body;
  try {
    await pool.query(
      'UPDATE internships SET title=?, category=?, company=?, duration=?, mode=?, description=?, syllabus=?, benefits=?, eligibility=?, status=?, stipend=?, price=?, skill_level=?, image=? WHERE id=?',
      [
        title || null, category || null, company || null, duration || null, mode || null, description || null, 
        parseTextToObjects(syllabus), parseTextToObjects(benefits), eligibility || null, status || 'active', 
        stipend || null, price || '0', skill_level || 'beginner', image || '/images/internship.png', id
      ]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update internship' });
  }
});

router.delete('/internships/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM internships WHERE id=?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete internship' });
  }
});

// Admin Services CRUD
router.post('/services', async (req, res) => {
  const { title, category, description, features, price, status, icon, image_url, pricing_tiers } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO services (title, category, description, features, price, status, icon, image_url, pricing_tiers) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, category, description, parseTextToStrings(features), price, status || 'active', icon, image_url, parseTextToObjects(pricing_tiers)]
    );
    res.json({ id: result.insertId, title, category, description, price, status, image_url });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create service' });
  }
});

router.put('/services/:id', async (req, res) => {
  const { id } = req.params;
  const { title, category, description, features, price, status, icon, image_url, pricing_tiers } = req.body;
  try {
    await pool.query(
      'UPDATE services SET title=?, category=?, description=?, features=?, price=?, status=?, icon=?, image_url=?, pricing_tiers=? WHERE id=?', 
      [title, category, description, parseTextToStrings(features), price, status || 'active', icon, image_url, parseTextToObjects(pricing_tiers), id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update service' });
  }
});

router.delete('/services/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM services WHERE id=?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

// Admin Contact Config
router.get('/contact-config', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM contact_config LIMIT 1');
    res.json(rows[0] || {});
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contact config' });
  }
});

router.put('/contact-config', async (req, res) => {
  const { email_1, email_2, phone, office_hours, address_title, address_line1, address_line2 } = req.body;
  try {
    await pool.query(
      `UPDATE contact_config SET email_1=?, email_2=?, phone=?, office_hours=?, address_title=?, address_line1=?, address_line2=?`,
      [email_1, email_2, phone, office_hours, address_title, address_line1, address_line2]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update contact config' });
  }
});

// Admin Contact Messages
router.get('/contact-messages', async (req, res) => {
  try {
    const [messages] = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contact messages' });
  }
});

module.exports = router;
