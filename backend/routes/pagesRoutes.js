const express = require('express');
const router = express.Router();
const pagesController = require('../controllers/pagesController');
const { authorizeRoles } = require('../middleware/authMiddleware');

// Public route to fetch a page (used by React client)
router.get('/:slug', pagesController.getPageBySlug);

// Admin routes
router.put('/:slug', authorizeRoles('admin', 'super_admin', 'content_manager'), pagesController.updatePage);
router.put('/:slug/sections/:section_key', authorizeRoles('admin', 'super_admin', 'content_manager'), pagesController.updatePageSection);

module.exports = router;
