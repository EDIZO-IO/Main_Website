const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

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
const whatsappService = require('./services/whatsappService');

const app = express();

app.set('trust proxy', 1); // Trust first proxy (Nginx)

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors());
app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

app.use('/api', apiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', userRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/services', serviceRoutes);
app.use(express.static('public')); // Serve uploaded media files
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Initialize WhatsApp service
  whatsappService.initialize();
});
