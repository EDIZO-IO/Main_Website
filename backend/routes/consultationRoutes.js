const express = require('express');
const router = express.Router();
const consultationController = require('../controllers/consultationController');
const { authenticateToken, optionalAuth, requireModuleAccess } = require('../middleware/authMiddleware');

// Public or Client booking routes
router.get('/slots', consultationController.getAvailableSlots);
router.post('/book', optionalAuth, consultationController.bookConsultation);

// Authenticated management routes
router.use(authenticateToken);
router.get('/', consultationController.getConsultations);
router.post('/slots', requireModuleAccess('consultations'), consultationController.createSlots);
router.patch('/:id', requireModuleAccess('consultations'), consultationController.updateConsultation);

module.exports = router;
