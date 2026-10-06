const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { authenticateToken, requireModuleAccess } = require('../middleware/authMiddleware');

router.use(authenticateToken);

// Employee self actions
router.post('/attendance/check-in-out', employeeController.recordAttendance);
router.post('/leaves', employeeController.submitLeaveRequest);

// Management actions
router.get('/', requireModuleAccess('employees'), employeeController.getEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.post('/', requireModuleAccess('employees'), employeeController.createEmployee);
router.patch('/leaves/:id', requireModuleAccess('employees'), employeeController.updateLeaveStatus);

module.exports = router;
