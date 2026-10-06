const express = require('express');
const router = express.Router();
const whatsappController = require('../controllers/whatsappController');
const { authorizeRoles } = require('../middleware/authMiddleware');

// Protect these routes to be accessible only by admin
router.use(authorizeRoles('admin', 'super_admin'));

router.get('/status', whatsappController.getStatus);
router.post('/logout', whatsappController.logout);
router.get('/stats', whatsappController.getStats);
router.get('/logs', whatsappController.getLogs);
router.post('/send', whatsappController.sendMessage);

module.exports = router;
