const jwt = require('jsonwebtoken');
const pool = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_edizo';

const isAdminRole = (role) => {
  if (role === undefined || role === null) return false;
  const normalized = String(role).toLowerCase();
  return (
    normalized === 'admin' ||
    normalized === 'super_admin' ||
    normalized === 'superadmin' ||
    normalized === '1' ||
    normalized === '2' ||
    role === 1 ||
    role === 2
  );
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT Verify Error:", err.message);
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }
    req.user = user;
    next();
  });
};

const authenticateAdmin = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  jwt.verify(token, JWT_SECRET, async (err, user) => {
    if (err) {
      console.error("JWT Admin Verify Error:", err.message);
      return res.status(403).json({ error: 'Invalid or expired token. Please log in again.' });
    }

    req.user = user;

    // Check if token payload explicitly contains admin role
    if (isAdminRole(user.role) || isAdminRole(user.role_id)) {
      return next();
    }

    // Fallback: Query live database by user ID or email
    try {
      if (user.id || user.email) {
        const [rows] = await pool.query(
          `SELECT u.id, u.role, u.role_id, r.name as role_name 
           FROM users u 
           LEFT JOIN roles r ON u.role_id = r.id 
           WHERE u.id = ? OR u.email = ?`,
          [user.id || null, user.email || null]
        );
        if (rows.length > 0) {
          const dbUser = rows[0];
          if (
            isAdminRole(dbUser.role_name) ||
            isAdminRole(dbUser.role) ||
            isAdminRole(dbUser.role_id)
          ) {
            req.user.role = dbUser.role_name || dbUser.role;
            return next();
          }
        }
      }
    } catch (dbErr) {
      console.error("DB Role Check Error:", dbErr.message);
    }

    console.warn(`403 Forbidden for User: ${user.email}, Role: ${user.role}`);
    return res.status(403).json({ error: 'Admin access required.' });
  });
};

const authorizeRoles = (...allowedRoles) => {
  const normalizedAllowed = allowedRoles.map(r => String(r).toLowerCase());

  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    jwt.verify(token, JWT_SECRET, async (err, user) => {
      if (err) {
        console.error("JWT Roles Verify Error:", err.message);
        return res.status(403).json({ error: 'Invalid or expired token. Please log in again.' });
      }

      req.user = user;

      const userIsAdmin = isAdminRole(user.role) || isAdminRole(user.role_id);
      const requiresAdmin = normalizedAllowed.includes('admin') || normalizedAllowed.includes('super_admin');

      if (userIsAdmin && requiresAdmin) {
        return next();
      }

      const userRole = String(user.role || '').toLowerCase();
      if (normalizedAllowed.includes(userRole)) {
        return next();
      }

      // Fallback DB check
      try {
        if (user.id || user.email) {
          const [rows] = await pool.query(
            `SELECT u.id, u.role, u.role_id, r.name as role_name 
             FROM users u 
             LEFT JOIN roles r ON u.role_id = r.id 
             WHERE u.id = ? OR u.email = ?`,
            [user.id || null, user.email || null]
          );
          if (rows.length > 0) {
            const dbUser = rows[0];
            const dbRole = String(dbUser.role_name || dbUser.role || '').toLowerCase();
            const dbIsAdmin = isAdminRole(dbRole) || isAdminRole(dbUser.role_id);
            if ((dbIsAdmin && requiresAdmin) || normalizedAllowed.includes(dbRole)) {
              req.user.role = dbRole;
              return next();
            }
          }
        }
      } catch (dbErr) {
        console.error("DB Role Check Error:", dbErr.message);
      }

      return res.status(403).json({ error: 'Insufficient permissions.' });
    });
  };
};

module.exports = { authenticateToken, authenticateAdmin, authorizeRoles };
