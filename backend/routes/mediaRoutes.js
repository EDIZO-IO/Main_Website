const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const mediaController = require('../controllers/mediaController');
const { authorizeRoles } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'public', 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Admin routes
router.post('/upload', authorizeRoles('admin', 'super_admin', 'content_manager'), upload.single('file'), mediaController.uploadMedia);
router.get('/', authorizeRoles('admin', 'super_admin', 'content_manager'), mediaController.getMedia);
router.delete('/:id', authorizeRoles('admin', 'super_admin', 'content_manager'), mediaController.deleteMedia);

module.exports = router;
