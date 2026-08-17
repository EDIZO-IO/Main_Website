const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const teamController = require('../controllers/teamController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

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

// Public routes
router.get('/', teamController.getAllTeamMembers);
router.get('/:id', teamController.getTeamMemberById);

// Protected routes (Admin only)
router.post('/', authenticateToken, authorizeRoles('super_admin', 'admin'), upload.single('image'), teamController.createTeamMember);
router.put('/:id', authenticateToken, authorizeRoles('super_admin', 'admin'), upload.single('image'), teamController.updateTeamMember);
router.delete('/:id', authenticateToken, authorizeRoles('super_admin', 'admin'), teamController.deleteTeamMember);

module.exports = router;
