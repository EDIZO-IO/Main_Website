const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_edizo';

// Helper to get role ID or fallback
const getRoleId = async (roleName) => {
  try {
    const [roles] = await pool.query('SELECT id FROM roles WHERE name = ?', [roleName]);
    if (roles.length > 0) return roles[0].id;
  } catch (e) {}
  return 4; // Default to student
};

router.post('/register', async (req, res) => {
  const { name, email, password, phone, role } = req.body;
  try {
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ error: 'User already exists' });

    // Restrict public registration to safe roles
    const assignedRoleName = (role === 'client' || role === 'student') ? role : 'student';
    const roleId = await getRoleId(assignedRoleName);

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    let result;
    try {
      // Try inserting into new schema structure (password_hash + role_id)
      [result] = await pool.query(
        'INSERT INTO users (name, email, phone, password_hash, role_id, status) VALUES (?, ?, ?, ?, ?, ?)',
        [name, email, phone || null, hash, roleId, 'active']
      );
    } catch (err) {
      // Fallback for older schema structure (password + role)
      [result] = await pool.query(
        'INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
        [name, email, phone || null, hash, assignedRoleName]
      );
    }

    res.json({ success: true, userId: result.insertId });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let users = [];
    try {
      // Try fetching user joined with roles table
      [users] = await pool.query(
        `SELECT u.*, r.name as role_name 
         FROM users u 
         LEFT JOIN roles r ON u.role_id = r.id 
         WHERE u.email = ?`, 
        [email]
      );
    } catch (e) {
      // Fallback to simple SELECT
      [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    }

    if (users.length === 0) return res.status(400).json({ error: 'Invalid credentials' });

    const user = users[0];
    const passwordField = user.password_hash || user.password;
    if (!passwordField) return res.status(400).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, passwordField);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const userRole = user.role_name || user.role || 'student';

    const token = jwt.sign(
      { id: user.id, email: user.email, role: userRole },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: userRole }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

module.exports = router;
