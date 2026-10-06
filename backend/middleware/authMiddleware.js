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

  jwt.verify(token, JWT_SECRET, async (err, user) => {
    if (err) {
      console.error("JWT Verify Error:", err.message);
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }

    try {
      // Check user status in live DB
      const [rows] = await pool.query(
        `SELECT id, uuid, full_name, name, email, role_id, status FROM users WHERE id = ? AND deleted_at IS NULL`,
        [user.id]
      );
      if (rows.length === 0 || rows[0].status === 'banned') {
        return res.status(403).json({ error: 'Account is deactivated or suspended.' });
      }
      req.user = { ...user, uuid: rows[0].uuid, status: rows[0].status, name: rows[0].full_name || rows[0].name };
      next();
    } catch (dbErr) {
      req.user = user;
      next();
    }
  });
};

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, JWT_SECRET, async (err, user) => {
    if (!err && user) {
      try {
        const [rows] = await pool.query(
          `SELECT id, uuid, full_name, name, email, role_id, status FROM users WHERE id = ? AND deleted_at IS NULL`,
          [user.id]
        );
        if (rows.length > 0 && rows[0].status !== 'banned') {
          req.user = { ...user, uuid: rows[0].uuid, status: rows[0].status, name: rows[0].full_name || rows[0].name };
        } else {
          req.user = null;
        }
      } catch (dbErr) {
        req.user = user;
      }
    } else {
      req.user = null;
    }
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

    if (isAdminRole(user.role) || isAdminRole(user.role_id)) {
      return next();
    }

    // Fallback: Query live database
    try {
      if (user.id || user.email) {
        const [rows] = await pool.query(
          `SELECT u.id, u.uuid, u.status, u.role_id, r.name as role_name 
           FROM users u 
           LEFT JOIN roles r ON u.role_id = r.id 
           WHERE (u.id = ? OR u.email = ?) AND u.deleted_at IS NULL`,
          [user.id || null, user.email || null]
        );
        if (rows.length > 0) {
          const dbUser = rows[0];
          if (dbUser.status === 'banned') {
            return res.status(403).json({ error: 'Account is deactivated.' });
          }
          if (isAdminRole(dbUser.role_name) || isAdminRole(dbUser.role_id)) {
            req.user.role = dbUser.role_name;
            req.user.uuid = dbUser.uuid;
            return next();
          }
        }
      }
    } catch (dbErr) {
      console.error("DB Role Check Error:", dbErr.message);
    }

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
            `SELECT u.id, u.uuid, u.status, u.role_id, r.name as role_name 
             FROM users u 
             LEFT JOIN roles r ON u.role_id = r.id 
             WHERE (u.id = ? OR u.email = ?) AND u.deleted_at IS NULL`,
            [user.id || null, user.email || null]
          );
          if (rows.length > 0) {
            const dbUser = rows[0];
            const dbRole = String(dbUser.role_name || '').toLowerCase();
            const dbIsAdmin = isAdminRole(dbRole) || isAdminRole(dbUser.role_id);
            if ((dbIsAdmin && requiresAdmin) || normalizedAllowed.includes(dbRole)) {
              req.user.role = dbRole;
              req.user.uuid = dbUser.uuid;
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

/**
 * Module-scoped permission check (e.g. 'crm', 'billing', 'projects')
 */
const requireModuleAccess = (moduleName) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (isAdminRole(req.user.role) || isAdminRole(req.user.role_id)) {
      return next();
    }

    // Role-specific shortcuts
    const role = String(req.user.role || '').toLowerCase();
    if (moduleName === 'crm' && (role === 'sales' || role === 'staff')) return next();
    if (moduleName === 'projects' && (role === 'staff' || role === 'client')) return next();
    if (moduleName === 'billing' && (role === 'sales' || role === 'client')) return next();
    if (moduleName === 'consultations' && (role === 'staff' || role === 'sales')) return next();

    try {
      const [perms] = await pool.query(
        `SELECT p.code, p.module FROM role_permissions rp
         JOIN permissions p ON rp.permission_id = p.id
         WHERE rp.role_id = ? AND p.module = ?`,
        [req.user.role_id, moduleName]
      );
      if (perms.length > 0) {
        return next();
      }
    } catch (err) {
      console.error('Module perm check error:', err.message);
    }

    return res.status(403).json({ error: `Access to ${moduleName} module denied.` });
  };
};

module.exports = { 
  authenticateToken, 
  optionalAuth,
  authenticateAdmin, 
  authorizeRoles, 
  requireModuleAccess, 
  isAdminRole 
};
