const express = require('express');
const router = express.Router();
const crmController = require('../controllers/crmController');
const { authenticateToken, requireModuleAccess } = require('../middleware/authMiddleware');

router.use(authenticateToken);
router.use(requireModuleAccess('crm'));

router.get('/leads', crmController.getLeads);
router.post('/leads', crmController.createLead);
router.get('/leads/:id', crmController.getLeadById);
router.put('/leads/:id', crmController.updateLead);
router.post('/leads/:id/notes', crmController.addLeadNote);
router.post('/leads/:id/activities', crmController.addLeadActivity);
router.get('/sources', crmController.getLeadSources);

module.exports = router;
