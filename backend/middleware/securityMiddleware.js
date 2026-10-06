const db = require('../db');

/**
 * IP Blocklist / Allowlist Middleware
 * Checks incoming client IP against `ip_rules` table.
 */
const ipRuleGuard = async (req, res, next) => {
  try {
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || '';
    
    if (!clientIp) return next();

    const [rules] = await db.query(
      `SELECT rule_type, reason, expires_at FROM ip_rules 
       WHERE ip_address = ? AND (expires_at IS NULL OR expires_at > NOW()) 
       LIMIT 1`,
      [clientIp]
    );

    if (rules.length > 0 && rules[0].rule_type === 'block') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Your IP address has been restricted.',
        reason: rules[0].reason || 'Security policy violation'
      });
    }

    req.clientIp = clientIp;
    next();
  } catch (err) {
    console.error('IP rule guard check warning:', err.message);
    next();
  }
};

/**
 * Database-backed rate limiter for distributed nodes/restarts
 */
const dbRateLimiter = (options = { windowSec: 60, maxRequests: 120, keyPrefix: 'api' }) => {
  return async (req, res, next) => {
    try {
      const clientIp = req.clientIp || req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
      const bucketKey = `${options.keyPrefix}:${clientIp}`;
      const now = new Date();
      // Round down to current window
      const windowStart = new Date(Math.floor(now.getTime() / (options.windowSec * 1000)) * (options.windowSec * 1000));

      await db.query(
        `INSERT INTO rate_limits (bucket_key, window_start, request_count) 
         VALUES (?, ?, 1) 
         ON DUPLICATE KEY UPDATE request_count = request_count + 1`,
        [bucketKey, windowStart]
      );

      const [rows] = await db.query(
        `SELECT request_count FROM rate_limits WHERE bucket_key = ? AND window_start = ?`,
        [bucketKey, windowStart]
      );

      if (rows.length > 0 && rows[0].request_count > options.maxRequests) {
        return res.status(429).json({
          success: false,
          message: 'Too many requests. Please slow down and try again shortly.'
        });
      }

      next();
    } catch (err) {
      console.error('Rate limit error:', err.message);
      next();
    }
  };
};

/**
 * Asynchronous Security Audit Logger
 */
const logAuditEvent = async ({ userId = null, action, entityType = null, entityId = null, ipAddress = null, metadata = {} }) => {
  try {
    await db.query(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address, metadata, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [userId, action, entityType, entityId, ipAddress, JSON.stringify(metadata)]
    );
  } catch (err) {
    console.error('Failed to write audit log:', err.message);
  }
};

/**
 * Safe Recursive Sanitization Function for Objects / Values
 */
const sanitizeObject = (obj, seen = new WeakSet(), depth = 0) => {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') {
    // Trim and strip null bytes
    return obj.replace(/\0/g, '').trim();
  }
  if (typeof obj !== 'object') return obj;
  if (depth > 6) return obj; // Max nesting protection
  if (Buffer.isBuffer(obj) || obj instanceof Date || obj instanceof RegExp) return obj;
  if (seen.has(obj)) return obj; // Circular reference protection

  seen.add(obj);

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, seen, depth + 1));
  }

  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    // Disallow prototype pollution keys
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }
    cleaned[key] = sanitizeObject(value, seen, depth + 1);
  }
  return cleaned;
};

/**
 * Express Middleware for Request Input Sanitization
 */
const sanitizeInput = (req, res, next) => {
  try {
    if (req.body && typeof req.body === 'object') {
      req.body = sanitizeObject(req.body);
    }
    if (req.query && typeof req.query === 'object') {
      req.query = sanitizeObject(req.query);
    }
    if (req.params && typeof req.params === 'object') {
      req.params = sanitizeObject(req.params);
    }
    next();
  } catch (err) {
    console.error('Input sanitization middleware error:', err.message);
    next();
  }
};

module.exports = {
  ipRuleGuard,
  dbRateLimiter,
  logAuditEvent,
  sanitizeInput,
  sanitizeObject
};

