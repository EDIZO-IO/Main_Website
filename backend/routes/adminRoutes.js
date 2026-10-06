const express = require('express');
const pool = require('../db');
const { authenticateAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authenticateAdmin);

// Helper to resolve or auto-create category_id
const resolveCategoryId = async (categoryName, categoryTable) => {
  if (!categoryName) return 1;
  if (!isNaN(categoryName)) return parseInt(categoryName, 10);
  
  try {
    const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const [rows] = await pool.query(`SELECT id FROM ${categoryTable} WHERE name = ? OR slug = ?`, [categoryName, slug]);
    if (rows.length > 0) return rows[0].id;

    // Create if missing
    const [insertResult] = await pool.query(`INSERT INTO ${categoryTable} (name, slug) VALUES (?, ?)`, [categoryName, slug]);
    return insertResult.insertId;
  } catch (e) {
    return 1;
  }
};

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

router.get('/dashboard-analytics', async (req, res) => {
  try {
    // 1. KPI Counts & Monthly Deltas
    const [totalUsers] = await pool.query('SELECT COUNT(*) as count FROM users');
    const [usersThisMonth] = await pool.query('SELECT COUNT(*) as count FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)');

    const [totalApps] = await pool.query('SELECT COUNT(*) as count FROM applications');
    const [appsThisMonth] = await pool.query('SELECT COUNT(*) as count FROM applications WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)');

    const [totalReqs] = await pool.query('SELECT COUNT(*) as count FROM service_requests');
    const [reqsThisMonth] = await pool.query('SELECT COUNT(*) as count FROM service_requests WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)');

    let activeProjectsCount = 0, projectsThisMonth = 0;
    try {
      const [projRows] = await pool.query('SELECT COUNT(*) as count FROM projects WHERE status IN ("active", "in_progress", "planning")');
      activeProjectsCount = projRows[0]?.count || 0;
      const [projMonthRows] = await pool.query('SELECT COUNT(*) as count FROM projects WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)');
      projectsThisMonth = projMonthRows[0]?.count || 0;
    } catch (e) {
      activeProjectsCount = 0;
    }

    let revenueThisMonth = 0, invoiceCount = 0;
    try {
      const [invRows] = await pool.query('SELECT COALESCE(SUM(amount_paid), 0) as total, COUNT(*) as count FROM invoices WHERE status = "paid"');
      revenueThisMonth = Number(invRows[0]?.total || 0);
      invoiceCount = invRows[0]?.count || 0;
    } catch (e) {
      revenueThisMonth = 0;
    }

    // 2. User Distribution Breakdown by Role
    let userDistribution = [];
    try {
      const [roleRows] = await pool.query(`
        SELECT COALESCE(r.name, 'Student / Intern') as role_name, COUNT(u.id) as count
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        GROUP BY role_name
      `);
      userDistribution = roleRows;
    } catch (e) {
      const [roleRowsFallback] = await pool.query(`
        SELECT COALESCE(role, 'student') as role_name, COUNT(id) as count
        FROM users
        GROUP BY role_name
      `);
      userDistribution = roleRowsFallback;
    }

    // 3. Time Series Data (Daily buckets for last 30 days)
    const [reqsByDay] = await pool.query(`
      SELECT DATE_FORMAT(created_at, '%Y-%m-%d') as day_key, COUNT(*) as count
      FROM service_requests
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY day_key
    `);
    const [appsByDay] = await pool.query(`
      SELECT DATE_FORMAT(created_at, '%Y-%m-%d') as day_key, COUNT(*) as count
      FROM applications
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY day_key
    `);
    const [usersByDay] = await pool.query(`
      SELECT DATE_FORMAT(created_at, '%Y-%m-%d') as day_key, COUNT(*) as count
      FROM users
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY day_key
    `);

    let projectsByDay = [];
    try {
      const [pDay] = await pool.query(`
        SELECT DATE_FORMAT(created_at, '%Y-%m-%d') as day_key, COUNT(*) as count
        FROM projects
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY day_key
      `);
      projectsByDay = pDay;
    } catch (e) {
      projectsByDay = [];
    }

    // 4. Pending / Action Item Counts
    let pendingFollowUps = 0;
    try {
      const [leadRows] = await pool.query('SELECT COUNT(*) as count FROM leads WHERE status IN ("new", "contacted", "qualified")');
      pendingFollowUps = leadRows[0]?.count || 0;
    } catch (e) {
      pendingFollowUps = 0;
    }

    let pendingApprovals = 0;
    try {
      const [appRows] = await pool.query('SELECT COUNT(*) as count FROM applications WHERE status = "pending"');
      pendingApprovals = appRows[0]?.count || 0;
    } catch (e) {
      pendingApprovals = 0;
    }

    let openTickets = 0;
    try {
      const [ticketRows] = await pool.query('SELECT COUNT(*) as count FROM tickets WHERE status IN ("open", "in_progress")');
      openTickets = ticketRows[0]?.count || 0;
    } catch (e) {
      openTickets = 0;
    }

    // 5. Today's Tasks
    let tasksList = [];
    try {
      const [taskRows] = await pool.query(`
        SELECT id, title, status, due_date, priority 
        FROM project_tasks 
        ORDER BY status = 'completed' ASC, created_at DESC 
        LIMIT 6
      `);
      tasksList = taskRows;
    } catch (e) {
      tasksList = [];
    }

    res.json({
      kpi: {
        total_users: totalUsers[0]?.count || 0,
        users_this_month: usersThisMonth[0]?.count || 0,
        total_applications: totalApps[0]?.count || 0,
        apps_this_month: appsThisMonth[0]?.count || 0,
        total_requests: totalReqs[0]?.count || 0,
        requests_this_month: reqsThisMonth[0]?.count || 0,
        active_projects: activeProjectsCount,
        projects_this_month: projectsThisMonth,
        revenue_this_month: revenueThisMonth,
        invoices_count: invoiceCount
      },
      distribution: userDistribution,
      timeSeries: {
        requests: reqsByDay,
        applications: appsByDay,
        users: usersByDay,
        projects: projectsByDay
      },
      statusCounters: {
        pending_followups: pendingFollowUps,
        pending_approvals: pendingApprovals,
        open_tickets: openTickets
      },
      todayTasks: tasksList
    });
  } catch (error) {
    console.error("fetch dashboard analytics error:", error);
    res.status(500).json({ error: 'Failed to fetch dashboard analytics' });
  }
});

router.get('/recent-activity', async (req, res) => {
  try {
    let recentUsers = [], recentApps = [], recentReqs = [], recentTickets = [];
    try {
      [recentUsers] = await pool.query('SELECT u.id, u.name, u.email, COALESCE(r.name, "user") as role, u.created_at, "user" as type FROM users u LEFT JOIN roles r ON u.role_id = r.id ORDER BY u.created_at DESC LIMIT 6');
    } catch (e) {
      [recentUsers] = await pool.query('SELECT id, name, email, role, created_at, "user" as type FROM users ORDER BY created_at DESC LIMIT 6');
    }
    
    try {
      [recentApps] = await pool.query('SELECT a.id, COALESCE(u.name, CONCAT(COALESCE(a.first_name,""), " ", COALESCE(a.last_name,""))) as name, a.internship_id as target, a.status, a.created_at, "application" as type FROM applications a LEFT JOIN users u ON a.user_id = u.id ORDER BY a.created_at DESC LIMIT 6');
    } catch (e) {
      recentApps = [];
    }

    try {
      [recentReqs] = await pool.query('SELECT r.id, COALESCE(u.name, "Client") as name, r.service_id as target, r.status, r.created_at, "request" as type FROM service_requests r LEFT JOIN users u ON r.user_id = u.id ORDER BY r.created_at DESC LIMIT 6');
    } catch (e) {
      recentReqs = [];
    }

    try {
      [recentTickets] = await pool.query('SELECT t.id, COALESCE(u.name, "Client") as name, t.subject as target, t.status, t.created_at, "ticket" as type FROM tickets t LEFT JOIN users u ON t.user_id = u.id ORDER BY t.created_at DESC LIMIT 4');
    } catch (e) {
      recentTickets = [];
    }
    
    const allActivity = [...recentUsers, ...recentApps, ...recentReqs, ...recentTickets]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 10);
      
    res.json(allActivity);
  } catch (error) {
    console.error("fetch recent activity error:", error);
    res.status(500).json({ error: 'Failed to fetch recent activity' });
  }
});

router.get('/users', async (req, res) => {
  try {
    let users = [];
    try {
      [users] = await pool.query('SELECT u.id, u.name, u.email, COALESCE(r.name, "student") as role, u.created_at FROM users u LEFT JOIN roles r ON u.role_id = r.id ORDER BY u.created_at DESC');
    } catch (e) {
      [users] = await pool.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
    }
    res.json(users);
  } catch (error) {
    console.error("fetch users error:", error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/applications', async (req, res) => {
  try {
    const [apps] = await pool.query(`
      SELECT a.*, COALESCE(u.name, CONCAT(a.first_name, ' ', a.last_name)) as user_name, COALESCE(u.email, a.email) as user_email
      FROM applications a
      LEFT JOIN users u ON a.user_id = u.id
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
      LEFT JOIN users u ON r.user_id = u.id
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
    const categoryId = await resolveCategoryId(category, 'internship_categories');
    let result;
    try {
      [result] = await pool.query(
        'INSERT INTO internships (title, category_id, company, duration, mode, description, syllabus, benefits, eligibility, status, stipend, price, skill_level, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          title || null, categoryId, company || null, duration || null, mode || 'online', description || null, 
          parseTextToObjects(syllabus), parseTextToObjects(benefits), eligibility || null, status || 'active', 
          stipend || null, price || '0', skill_level || 'beginner', image || '/images/internship.png'
        ]
      );
    } catch (e) {
      [result] = await pool.query(
        'INSERT INTO internships (title, category, company, duration, mode, description, syllabus, benefits, eligibility, status, stipend, price, skill_level, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          title || null, category || null, company || null, duration || null, mode || 'online', description || null, 
          parseTextToObjects(syllabus), parseTextToObjects(benefits), eligibility || null, status || 'active', 
          stipend || null, price || '0', skill_level || 'beginner', image || '/images/internship.png'
        ]
      );
    }
    res.json({ id: result.insertId, title, category, company, duration, mode, description, status });
  } catch (error) {
    console.error("Create internship error:", error);
    res.status(500).json({ error: error.message || 'Failed to create internship' });
  }
});

router.put('/internships/:id', async (req, res) => {
  const { id } = req.params;
  const { title, category, company, duration, mode, description, syllabus, benefits, eligibility, status, stipend, price, skill_level, image } = req.body;
  try {
    const categoryId = await resolveCategoryId(category, 'internship_categories');
    try {
      await pool.query(
        'UPDATE internships SET title=?, category_id=?, company=?, duration=?, mode=?, description=?, syllabus=?, benefits=?, eligibility=?, status=?, stipend=?, price=?, skill_level=?, image=? WHERE id=?',
        [
          title || null, categoryId, company || null, duration || null, mode || 'online', description || null, 
          parseTextToObjects(syllabus), parseTextToObjects(benefits), eligibility || null, status || 'active', 
          stipend || null, price || '0', skill_level || 'beginner', image || '/images/internship.png', id
        ]
      );
    } catch (e) {
      await pool.query(
        'UPDATE internships SET title=?, category=?, company=?, duration=?, mode=?, description=?, syllabus=?, benefits=?, eligibility=?, status=?, stipend=?, price=?, skill_level=?, image=? WHERE id=?',
        [
          title || null, category || null, company || null, duration || null, mode || 'online', description || null, 
          parseTextToObjects(syllabus), parseTextToObjects(benefits), eligibility || null, status || 'active', 
          stipend || null, price || '0', skill_level || 'beginner', image || '/images/internship.png', id
        ]
      );
    }
    res.json({ success: true });
  } catch (error) {
    console.error("Update internship error:", error);
    res.status(500).json({ error: error.message || 'Failed to update internship' });
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
    const categoryId = await resolveCategoryId(category, 'service_categories');
    let result;
    try {
      [result] = await pool.query(
        'INSERT INTO services (title, category_id, description, features, price, status, icon, image_url, pricing_tiers) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [title, categoryId, description, parseTextToStrings(features), price, status || 'active', icon, image_url, parseTextToObjects(pricing_tiers)]
      );
    } catch (e) {
      [result] = await pool.query(
        'INSERT INTO services (title, category, description, features, price, status, icon, image_url, pricing_tiers) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [title, category, description, parseTextToStrings(features), price, status || 'active', icon, image_url, parseTextToObjects(pricing_tiers)]
      );
    }
    res.json({ id: result.insertId, title, category, description, price, status, image_url });
  } catch (error) {
    console.error("Create service error:", error);
    res.status(500).json({ error: error.message || 'Failed to create service' });
  }
});

router.put('/services/:id', async (req, res) => {
  const { id } = req.params;
  const { title, category, description, features, price, status, icon, image_url, pricing_tiers } = req.body;
  try {
    const categoryId = await resolveCategoryId(category, 'service_categories');
    try {
      await pool.query(
        'UPDATE services SET title=?, category_id=?, description=?, features=?, price=?, status=?, icon=?, image_url=?, pricing_tiers=? WHERE id=?', 
        [title, categoryId, description, parseTextToStrings(features), price, status || 'active', icon, image_url, parseTextToObjects(pricing_tiers), id]
      );
    } catch (e) {
      await pool.query(
        'UPDATE services SET title=?, category=?, description=?, features=?, price=?, status=?, icon=?, image_url=?, pricing_tiers=? WHERE id=?', 
        [title, category, description, parseTextToStrings(features), price, status || 'active', icon, image_url, parseTextToObjects(pricing_tiers), id]
      );
    }
    res.json({ success: true });
  } catch (error) {
    console.error("Update service error:", error);
    res.status(500).json({ error: error.message || 'Failed to update service' });
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

router.put('/contact-messages/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await pool.query('UPDATE contact_messages SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update message status' });
  }
});

// Update Application Status
router.put('/applications/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await pool.query('UPDATE applications SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

// Delete Application
router.delete('/applications/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM applications WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete application' });
  }
});

// Update Service Request Status
router.put('/requests/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await pool.query('UPDATE service_requests SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update request status' });
  }
});

// Delete Service Request
router.delete('/requests/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM service_requests WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete request' });
  }
});

// Update User Role
router.put('/users/:id/role', async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  try {
    const roleIdMap = { 'super_admin': 1, 'admin': 2, 'mentor': 3, 'student': 4, 'client': 5, 'staff': 6 };
    const roleId = roleIdMap[role] || 4;
    try {
      await pool.query('UPDATE users SET role_id = ?, role = ? WHERE id = ?', [roleId, role, id]);
    } catch (e) {
      await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// Delete User
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// DPDP Consent Audit Logs
router.get('/consent-logs', async (req, res) => {
  try {
    const [logs] = await pool.query('SELECT * FROM consent_logs ORDER BY created_at DESC LIMIT 100');
    res.json(logs);
  } catch (error) {
    res.json([]);
  }
});

module.exports = router;
