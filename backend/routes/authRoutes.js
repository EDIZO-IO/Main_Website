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

// @desc    Register a new user (Client / Student)
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  const { name, full_name, email, password, phone, role } = req.body;
  const userName = full_name || name;

  if (!email || !password || !userName) {
    return res.status(400).json({ success: false, error: 'Name, email, and password are required' });
  }

  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, error: 'User already exists with this email' });
    }

    // Restrict public registration to safe roles (client, student)
    const assignedRoleName = (role === 'client' || role === 'student') ? role : 'student';
    const roleId = await getRoleId(assignedRoleName);

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const [result] = await pool.query(
      `INSERT INTO users (full_name, email, phone, password_hash, role_id, status)
       VALUES (?, ?, ?, ?, ?, 'active')`,
      [userName, email, phone || null, hash, roleId]
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      userId: result.insertId
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: 'Failed to register user' });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required' });
  }

  try {
    const [users] = await pool.query(
      `SELECT u.*, r.name as role_name 
       FROM users u 
       LEFT JOIN roles r ON u.role_id = r.id 
       WHERE u.email = ? AND (u.deleted_at IS NULL)`,
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }

    const user = users[0];

    // Check account status
    if (user.status === 'banned') {
      return res.status(403).json({ success: false, error: 'Your account has been suspended' });
    }

    const passwordField = user.password_hash || user.password;
    if (!passwordField) {
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, passwordField);
    if (!match) {
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }

    const userRole = user.role_name || user.role || 'student';
    const token = jwt.sign(
      { id: user.id, email: user.email, role: userRole, role_id: user.role_id },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.full_name || user.name,
        full_name: user.full_name || user.name,
        email: user.email,
        phone: user.phone,
        role: userRole,
        role_name: userRole,
        avatar_url: user.avatar_url
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Failed to login' });
  }
});

module.exports = router;
