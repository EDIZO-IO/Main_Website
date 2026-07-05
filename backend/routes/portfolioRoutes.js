const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', portfolioController.getProjects);
router.post('/', authenticateToken, authorizeRoles('super_admin', 'admin'), portfolioController.addProject);
router.put('/:id', authenticateToken, authorizeRoles('super_admin', 'admin'), portfolioController.updateProject);
router.delete('/:id', authenticateToken, authorizeRoles('super_admin', 'admin'), portfolioController.deleteProject);

module.exports = router;
