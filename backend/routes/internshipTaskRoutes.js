const express = require('express');
const router = express.Router();
const internshipTaskController = require('../controllers/internshipTaskController');
const { authenticateToken, requireModuleAccess } = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.get('/batch/:batchId', internshipTaskController.getBatchTasks);
router.post('/tasks', requireModuleAccess('internships'), internshipTaskController.createBatchTask);
router.post('/daily-reports', internshipTaskController.submitDailyReport);
router.get('/daily-reports/:enrollmentId', internshipTaskController.getDailyReports);
router.post('/mentor-feedback', requireModuleAccess('internships'), internshipTaskController.submitMentorFeedback);

module.exports = router;
