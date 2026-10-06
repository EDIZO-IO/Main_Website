const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { authenticateToken, requireModuleAccess } = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.get('/categories', documentController.getCategories);
router.get('/', documentController.getDocuments);
router.post('/', requireModuleAccess('documents'), documentController.createDocument);
router.delete('/:id', requireModuleAccess('documents'), documentController.deleteDocument);

module.exports = router;
