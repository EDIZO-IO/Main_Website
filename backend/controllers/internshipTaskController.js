const db = require('../db');

// @desc    Get tasks for an internship batch
// @route   GET /api/internships/tasks/batch/:batchId
// @access  Private
exports.getBatchTasks = async (req, res) => {
  try {
    const { batchId } = req.params;

    const [tasks] = await db.query(
      `SELECT it.*, u.name AS creator_name, ib.batch_name
       FROM internship_tasks it
       JOIN internship_batches ib ON it.batch_id = ib.id
       LEFT JOIN users u ON it.created_by = u.id
       WHERE it.batch_id = ?
       ORDER BY it.due_date ASC, it.id ASC`,
      [batchId]
    );

    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    console.error('getBatchTasks error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching batch tasks' });
  }
};

// @desc    Create a task for an internship batch
// @route   POST /api/internships/tasks
// @access  Private (Staff/Mentor)
exports.createBatchTask = async (req, res) => {
  try {
    const { batch_id, title, description, due_date, max_score } = req.body;

    if (!batch_id || !title) {
      return res.status(400).json({ success: false, message: 'Batch ID and Task Title are required' });
    }

    const [result] = await db.query(
      `INSERT INTO internship_tasks (batch_id, title, description, due_date, max_score, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [batch_id, title, description || '', due_date || null, max_score || 10, req.user.id]
    );

    const [newTask] = await db.query(`SELECT * FROM internship_tasks WHERE id = ?`, [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Internship task assigned successfully',
      data: newTask[0]
    });
  } catch (error) {
    console.error('createBatchTask error:', error);
    res.status(500).json({ success: false, message: 'Server error creating internship task' });
  }
};

// @desc    Submit daily progress report
// @route   POST /api/internships/daily-reports
// @access  Private (Intern)
exports.submitDailyReport = async (req, res) => {
  try {
    const { enrollment_id, report_date, summary, hours_spent, attachment_url } = req.body;

    if (!enrollment_id || !summary) {
      return res.status(400).json({ success: false, message: 'Enrollment ID and report summary are required' });
    }

    const dateOfReport = report_date || new Date().toISOString().slice(0, 10);

    // Verify ownership of enrollment
    const [enrollments] = await db.query(
      `SELECT * FROM internship_enrollments WHERE id = ? AND user_id = ?`,
      [enrollment_id, req.user.id]
    );

    if (!enrollments.length && req.user.role_name !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized for this enrollment' });
    }

    await db.query(
      `INSERT INTO daily_reports (enrollment_id, report_date, summary, hours_spent, attachment_url)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE summary = VALUES(summary), hours_spent = VALUES(hours_spent), attachment_url = VALUES(attachment_url)`,
      [enrollment_id, dateOfReport, summary, hours_spent || 0, attachment_url || null]
    );

    res.status(201).json({
      success: true,
      message: 'Daily progress report submitted successfully'
    });
  } catch (error) {
    console.error('submitDailyReport error:', error);
    res.status(500).json({ success: false, message: 'Server error saving daily report' });
  }
};

// @desc    Get daily reports for an enrollment
// @route   GET /api/internships/daily-reports/:enrollmentId
// @access  Private
exports.getDailyReports = async (req, res) => {
  try {
    const { enrollmentId } = req.params;

    const [reports] = await db.query(
      `SELECT dr.*, ie.user_id, u.name AS full_name, u.name, u.email
       FROM daily_reports dr
       JOIN internship_enrollments ie ON dr.enrollment_id = ie.id
       JOIN users u ON ie.user_id = u.id
       WHERE dr.enrollment_id = ?
       ORDER BY dr.report_date DESC`,
      [enrollmentId]
    );

    res.json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    console.error('getDailyReports error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching daily reports' });
  }
};

// @desc    Submit mentor feedback & score
// @route   POST /api/internships/mentor-feedback
// @access  Private (Mentor/Staff)
exports.submitMentorFeedback = async (req, res) => {
  try {
    const { enrollment_id, task_id, mentor_id, score, comments } = req.body;

    if (!enrollment_id) {
      return res.status(400).json({ success: false, message: 'Enrollment ID is required' });
    }

    // Lookup mentor id if not provided
    let finalMentorId = mentor_id;
    if (!finalMentorId) {
      const [mentors] = await db.query(`SELECT id FROM mentors WHERE user_id = ?`, [req.user.id]);
      if (mentors.length) {
        finalMentorId = mentors[0].id;
      } else {
        // Fallback or admin
        const [anyMentor] = await db.query(`SELECT id FROM mentors LIMIT 1`);
        finalMentorId = anyMentor.length ? anyMentor[0].id : 1;
      }
    }

    const [result] = await db.query(
      `INSERT INTO mentor_feedback (enrollment_id, task_id, mentor_id, score, comments)
       VALUES (?, ?, ?, ?, ?)`,
      [enrollment_id, task_id || null, finalMentorId, score || null, comments || '']
    );

    res.status(201).json({
      success: true,
      message: 'Mentor feedback recorded successfully',
      feedback_id: result.insertId
    });
  } catch (error) {
    console.error('submitMentorFeedback error:', error);
    res.status(500).json({ success: false, message: 'Server error submitting mentor feedback' });
  }
};
