const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authorizeRoles } = require('../middleware/authMiddleware');

router.get('/dashboard', authorizeRoles('admin', 'super_admin'), analyticsController.getDashboardStats);

module.exports = router;
