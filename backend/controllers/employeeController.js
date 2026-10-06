const db = require('../db');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private (Staff/Admin)
exports.getEmployees = async (req, res) => {
  try {
    const { department, status, employment_type } = req.query;

    let query = `
      SELECT e.*, 
             u.name AS full_name, u.name, u.email, u.phone,
             m.employee_code AS manager_code, mu.name AS manager_name
      FROM employees e
      JOIN users u ON e.user_id = u.id
      LEFT JOIN employees m ON e.reporting_to = m.id
      LEFT JOIN users mu ON m.user_id = mu.id
      WHERE 1=1
    `;
    const params = [];

    if (department) {
      query += ` AND e.department = ?`;
      params.push(department);
    }
    if (status) {
      query += ` AND e.status = ?`;
      params.push(status);
    }
    if (employment_type) {
      query += ` AND e.employment_type = ?`;
      params.push(employment_type);
    }

    query += ` ORDER BY e.id ASC`;

    const [employees] = await db.query(query, params);
    res.json({ success: true, count: employees.length, data: employees });
  } catch (error) {
    console.error('getEmployees error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching employees' });
  }
};

// @desc    Get employee by ID with attendance & leaves
// @route   GET /api/employees/:id
// @access  Private (Staff/Admin/Self)
exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const [employees] = await db.query(
      `SELECT e.*, 
              u.name AS full_name, u.name, u.email, u.phone,
              m.employee_code AS manager_code, mu.name AS manager_name
       FROM employees e
       JOIN users u ON e.user_id = u.id
       LEFT JOIN employees m ON e.reporting_to = m.id
       LEFT JOIN users mu ON m.user_id = mu.id
       WHERE e.id = ? OR e.user_id = ?`,
      [id, id]
    );

    if (!employees.length) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const employee = employees[0];

    // Fetch recent attendance (last 30 days)
    const [attendance] = await db.query(
      `SELECT * FROM attendance WHERE employee_id = ? ORDER BY work_date DESC LIMIT 30`,
      [employee.id]
    );

    // Fetch leaves
    const [leaves] = await db.query(
      `SELECT lr.*, u.name AS approver_name
       FROM leave_requests lr
       LEFT JOIN users u ON lr.approved_by = u.id
       WHERE lr.employee_id = ?
       ORDER BY lr.start_date DESC`,
      [employee.id]
    );

    // Fetch performance reviews
    let reviews = [];
    try {
      const [reviewRows] = await db.query(
        `SELECT pr.*, u.name AS reviewer_name
         FROM performance_reviews pr
         LEFT JOIN users u ON pr.reviewer_id = u.id
         WHERE pr.employee_id = ?
         ORDER BY pr.created_at DESC`,
        [employee.id]
      );
      reviews = reviewRows;
    } catch (e) {
      // Table may be optional
    }

    res.json({
      success: true,
      data: {
        ...employee,
        attendance,
        leaves,
        reviews
      }
    });
  } catch (error) {
    console.error('getEmployeeById error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching employee details' });
  }
};

// @desc    Create new employee record
// @route   POST /api/employees
// @access  Private (Admin/HR)
exports.createEmployee = async (req, res) => {
  try {
    const { user_id, employee_code, department, designation, date_of_joining, reporting_to, employment_type } = req.body;

    if (!user_id) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    // Auto-generate employee code if missing (e.g. EDZ-EMP-001)
    let empCode = employee_code;
    if (!empCode) {
      const [countResult] = await db.query(`SELECT COUNT(*) AS total FROM employees`);
      empCode = `EDZ-EMP-${String(countResult[0].total + 1).padStart(3, '0')}`;
    }

    const [result] = await db.query(
      `INSERT INTO employees (user_id, employee_code, department, designation, date_of_joining, reporting_to, employment_type, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'active')`,
      [
        user_id,
        empCode,
        department || 'Engineering',
        designation || 'Software Engineer',
        date_of_joining || new Date().toISOString().slice(0, 10),
        reporting_to || null,
        employment_type || 'full_time'
      ]
    );

    const [newEmp] = await db.query(`SELECT * FROM employees WHERE id = ?`, [result.insertId]);
    res.status(201).json({
      success: true,
      message: 'Employee record created successfully',
      data: newEmp[0]
    });
  } catch (error) {
    console.error('createEmployee error:', error);
    res.status(500).json({ success: false, message: 'Server error creating employee record' });
  }
};

// @desc    Record daily check-in / check-out
// @route   POST /api/employees/attendance/check-in-out
// @access  Private (Employee/Self)
exports.recordAttendance = async (req, res) => {
  try {
    // Find current employee id from logged in user
    const [emps] = await db.query(`SELECT id FROM employees WHERE user_id = ?`, [req.user.id]);
    if (!emps.length) {
      return res.status(404).json({ success: false, message: 'No employee record linked to your user account' });
    }

    const employeeId = emps[0].id;
    const today = new Date().toISOString().slice(0, 10);
    const nowTime = new Date().toTimeString().slice(0, 8);
    const { status } = req.body;

    const [existing] = await db.query(
      `SELECT * FROM attendance WHERE employee_id = ? AND work_date = ?`,
      [employeeId, today]
    );

    if (!existing.length) {
      // Check in
      await db.query(
        `INSERT INTO attendance (employee_id, work_date, check_in, status)
         VALUES (?, ?, ?, ?)`,
        [employeeId, today, nowTime, status || 'present']
      );
      res.status(201).json({ success: true, message: 'Checked in successfully', check_in: nowTime });
    } else {
      // Check out
      await db.query(
        `UPDATE attendance SET check_out = ? WHERE id = ?`,
        [nowTime, existing[0].id]
      );
      res.json({ success: true, message: 'Checked out successfully', check_out: nowTime });
    }
  } catch (error) {
    console.error('recordAttendance error:', error);
    res.status(500).json({ success: false, message: 'Server error recording attendance' });
  }
};

// @desc    Submit leave request
// @route   POST /api/employees/leaves
// @access  Private (Employee/Self)
exports.submitLeaveRequest = async (req, res) => {
  try {
    const { leave_type, start_date, end_date, reason } = req.body;

    if (!leave_type || !start_date || !end_date) {
      return res.status(400).json({ success: false, message: 'Leave type, start date, and end date are required' });
    }

    const [emps] = await db.query(`SELECT id FROM employees WHERE user_id = ?`, [req.user.id]);
    if (!emps.length) {
      return res.status(404).json({ success: false, message: 'Employee record not found for your account' });
    }

    const [result] = await db.query(
      `INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, reason, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [emps[0].id, leave_type, start_date, end_date, reason || '']
    );

    res.status(201).json({
      success: true,
      message: 'Leave request submitted successfully',
      leave_id: result.insertId
    });
  } catch (error) {
    console.error('submitLeaveRequest error:', error);
    res.status(500).json({ success: false, message: 'Server error submitting leave request' });
  }
};

// @desc    Review/Approve/Reject leave request
// @route   PATCH /api/employees/leaves/:id
// @access  Private (Admin/HR/Manager)
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'approved' | 'rejected'

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid leave status' });
    }

    await db.query(
      `UPDATE leave_requests SET status = ?, approved_by = ? WHERE id = ?`,
      [status, req.user.id, id]
    );

    res.json({ success: true, message: `Leave request marked as ${status}` });
  } catch (error) {
    console.error('updateLeaveStatus error:', error);
    res.status(500).json({ success: false, message: 'Server error updating leave request' });
  }
};
