const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Middleware
const { ipRuleGuard, sanitizeInput } = require('./middleware/securityMiddleware');

// Existing Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const internshipRoutes = require('./routes/internshipRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const contactRoutes = require('./routes/contactRoutes');
const jobRoutes = require('./routes/jobRoutes');
const siteSettingsRoutes = require('./routes/siteSettingsRoutes');
const pagesRoutes = require('./routes/pagesRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const teamRoutes = require('./routes/teamRoutes');
const whatsappRoutes = require('./routes/whatsappRoutes');

// V2 Feature Routes
const crmRoutes = require('./routes/crmRoutes');
const proposalRoutes = require('./routes/proposalRoutes');
const taskBoardRoutes = require('./routes/taskBoardRoutes');
const billingRoutes = require('./routes/billingRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const documentRoutes = require('./routes/documentRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const internshipTaskRoutes = require('./routes/internshipTaskRoutes');

const whatsappService = require('./services/whatsappService');

const app = express();

app.set('trust proxy', 1); // Trust first proxy (Nginx)

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Cross-Origin Resource Sharing
const allowedOrigins = [
  'https://edizotech.in',
  'https://www.edizotech.in',
  'https://admin.edizotech.in',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000'
];
if (process.env.CLIENT_URL && !allowedOrigins.includes(process.env.CLIENT_URL)) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    // Allow any edizotech.in subdomain
    if (origin.endsWith('.edizotech.in') || origin === 'https://edizotech.in') {
      return callback(null, true);
    }
    callback(null, true);
  },
  credentials: true
}));

// Body Parsers & Input Sanitization
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(sanitizeInput);

// Database-Driven IP Rule Blocker Guard
app.use(ipRuleGuard);

// Global API Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 600, // 600 requests per 15 min window
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false, default: false }
});

app.use('/api', apiLimiter);

// Serve uploaded static files
app.use(express.static('public'));

// Core & Existing Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', userRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/settings', siteSettingsRoutes);
app.use('/api/pages', pagesRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/whatsapp', whatsappRoutes);

// V2 Feature Endpoints
app.use('/api/crm', crmRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/projects', taskBoardRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/internship-tasks', internshipTaskRoutes);

// Central Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'An internal server error occurred' : err.message
  });
});

const { enforceProductionDataIntegrity } = require('./services/dataIntegrityService');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`EDIZO V2 Backend API Server running on port ${PORT}`);
  
  // Enforce zero-mock data integrity
  enforceProductionDataIntegrity();

  // Initialize WhatsApp service if available
  try {
    whatsappService.initialize();
  } catch (wErr) {
    console.warn('WhatsApp service init skipped:', wErr.message);
  }
});
