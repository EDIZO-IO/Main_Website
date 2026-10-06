const express = require('express');
const router = express.Router();
const taskBoardController = require('../controllers/taskBoardController');
const { authenticateToken, requireModuleAccess } = require('../middleware/authMiddleware');

router.use(authenticateToken);
router.use(requireModuleAccess('projects'));

// Sprints
router.get('/:projectId/sprints', taskBoardController.getProjectSprints);
router.post('/:projectId/sprints', taskBoardController.createSprint);
router.get('/projects/:projectId/sprints', taskBoardController.getProjectSprints);
router.post('/projects/:projectId/sprints', taskBoardController.createSprint);

// Tasks
router.get('/:projectId/tasks', taskBoardController.getProjectTasks);
router.post('/:projectId/tasks', taskBoardController.createTask);
router.get('/projects/:projectId/tasks', taskBoardController.getProjectTasks);
router.post('/projects/:projectId/tasks', taskBoardController.createTask);

// Task status & position updates
router.put('/tasks/:id/position', taskBoardController.updateTaskPosition);
router.patch('/tasks/:id/status', taskBoardController.updateTaskPosition);
router.put('/tasks/:id/status', taskBoardController.updateTaskPosition);

// Comments & Time tracking
router.post('/tasks/:id/comments', taskBoardController.addTaskComment);
router.post('/tasks/:id/time-logs', taskBoardController.logTaskTime);

module.exports = router;

