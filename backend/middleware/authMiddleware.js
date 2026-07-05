const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_edizo';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT Error:", err);
      return res.status(403).json({ error: 'Invalid token.' });
    }
    req.user = user;
    next();
  });
};

const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT Error Admin:", err);
      return res.status(403).json({ error: 'Invalid token.' });
    }
    if (user.role !== 'admin' && user.role !== 'super_admin') return res.status(403).json({ error: 'Admin or Super Admin only.' });
    req.user = user;
    next();
  });
};

// Generic role authorization middleware (e.g. authorizeRoles('student', 'client'))
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied.' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        console.error("JWT Error Roles:", err);
        return res.status(403).json({ error: 'Invalid token.' });
      }
      if (!allowedRoles.includes(user.role) && user.role !== 'super_admin') {
        return res.status(403).json({ error: 'Insufficient permissions.' });
      }
      req.user = user;
      next();
    });
  };
};

module.exports = { authenticateToken, authenticateAdmin, authorizeRoles };
