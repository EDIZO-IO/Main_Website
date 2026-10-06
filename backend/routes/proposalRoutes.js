const express = require('express');
const router = express.Router();
const proposalController = require('../controllers/proposalController');
const { authenticateToken, requireModuleAccess } = require('../middleware/authMiddleware');

// Public view & digital signing
router.get('/view/:uuid', proposalController.getProposalByUuid);
router.post('/view/:uuid/sign', proposalController.signProposal);

// Protected Staff / Admin routes
router.use(authenticateToken);
router.use(requireModuleAccess('crm'));

router.get('/', proposalController.getProposals);
router.post('/', proposalController.createProposal);

module.exports = router;
