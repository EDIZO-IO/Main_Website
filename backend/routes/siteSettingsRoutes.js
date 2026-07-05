const express = require('express');
const router = express.Router();
const siteSettingsController = require('../controllers/siteSettingsController');
const { authorizeRoles } = require('../middleware/authMiddleware');

// Public route to fetch global settings (used by React client)
router.get('/', siteSettingsController.getSettings);

// Admin route to update settings
router.put('/', authorizeRoles('admin', 'super_admin'), siteSettingsController.updateSettingsBulk);

router.put('/:key', authorizeRoles('admin', 'super_admin'), siteSettingsController.updateSetting);

module.exports = router;
