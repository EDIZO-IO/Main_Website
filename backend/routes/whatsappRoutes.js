const express = require('express');
const router = express.Router();
const whatsappController = require('../controllers/whatsappController');
const { authorizeRoles } = require('../middleware/authMiddleware');

// Protect these routes to be accessible only by admin
router.get('/status', authorizeRoles('admin', 'super_admin'), whatsappController.getStatus);
router.post('/logout', authorizeRoles('admin', 'super_admin'), whatsappController.logout);
router.get('/stats', authorizeRoles('admin', 'super_admin'), whatsappController.getStats);

module.exports = router;
