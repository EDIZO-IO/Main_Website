const db = require('../db');
const { logAuditEvent } = require('../middleware/securityMiddleware');

// Get all sprints for a project
exports.getProjectSprints = async (req, res) => {
  try {
    const { projectId } = req.params;
    const [sprints] = await db.query(
      `SELECT * FROM project_sprints WHERE project_id = ? ORDER BY start_date DESC`,
      [projectId]
    );
    res.json({ success: true, sprints, data: sprints });
  } catch (err) {
    console.error('Error fetching sprints:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch sprints' });
  }
};

// Create sprint
exports.createSprint = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, start_date, end_date, status = 'planned' } = req.body;

    if (!name) return res.status(400).json({ success: false, error: 'Sprint name is required' });

    const [result] = await db.query(
      `INSERT INTO project_sprints (project_id, name, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)`,
      [projectId, name, start_date || null, end_date || null, status]
    );

    res.status(201).json({ success: true, sprintId: result.insertId, message: 'Sprint created' });
  } catch (err) {
    console.error('Error creating sprint:', err);
    res.status(500).json({ success: false, error: 'Failed to create sprint' });
  }
};

// Get Kanban tasks for a project
exports.getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { sprint_id } = req.query || {};

    let query = `
      SELECT t.*, u.name as assignee_name, u.email as assignee_email, c.name as creator_name
      FROM project_tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      LEFT JOIN users c ON t.created_by = c.id
      WHERE t.project_id = ? AND t.deleted_at IS NULL
    `;
    const params = [projectId];

    if (sprint_id) {
      query += ` AND t.sprint_id = ?`;
      params.push(sprint_id);
    }

    query += ` ORDER BY t.position ASC, t.created_at DESC`;

    const [tasks] = await db.query(query, params);
    res.json({ success: true, tasks, data: tasks });
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch project tasks' });
  }
};

// Create a task
exports.createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { sprint_id, parent_task_id, title, description, status = 'todo', priority = 'medium', assigned_to, due_date, estimated_hours } = req.body;

    if (!title) return res.status(400).json({ success: false, error: 'Task title is required' });

    // Get next position index
    const [posRows] = await db.query(
      `SELECT COALESCE(MAX(position), 0) + 1 as nextPos FROM project_tasks WHERE project_id = ? AND status = ?`,
      [projectId, status]
    );

    const [result] = await db.query(
      `INSERT INTO project_tasks (project_id, sprint_id, parent_task_id, title, description, status, priority, assigned_to, created_by, due_date, estimated_hours, position)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [projectId, sprint_id || null, parent_task_id || null, title, description || null, status, priority, assigned_to || null, req.user?.id || null, due_date || null, estimated_hours || null, posRows[0].nextPos]
    );

    res.status(201).json({ success: true, taskId: result.insertId, message: 'Task created' });
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ success: false, error: 'Failed to create task' });
  }
};

// Update task status and position (drag & drop reordering)
exports.updateTaskPosition = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, position } = req.body;

    await db.query(
      `UPDATE project_tasks SET status = COALESCE(?, status), position = COALESCE(?, position) WHERE id = ?`,
      [status, position, id]
    );

    res.json({ success: true, message: 'Task position updated' });
  } catch (err) {
    console.error('Error updating task position:', err);
    res.status(500).json({ success: false, error: 'Failed to update task position' });
  }
};

// Add comment to task
exports.addTaskComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    if (!comment) return res.status(400).json({ success: false, error: 'Comment text required' });

    await db.query(
      `INSERT INTO task_comments (task_id, author_id, comment) VALUES (?, ?, ?)`,
      [id, req.user.id, comment]
    );

    res.status(201).json({ success: true, message: 'Comment added' });
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ success: false, error: 'Failed to add comment' });
  }
};

// Log time spent on task
exports.logTaskTime = async (req, res) => {
  try {
    const { id } = req.params;
    const { minutes_spent, work_date, notes } = req.body;

    if (!minutes_spent || !work_date) {
      return res.status(400).json({ success: false, error: 'Minutes spent and work date are required' });
    }

    await db.query(
      `INSERT INTO time_logs (task_id, user_id, minutes_spent, work_date, notes) VALUES (?, ?, ?, ?, ?)`,
      [id, req.user.id, minutes_spent, work_date, notes || null]
    );

    res.status(201).json({ success: true, message: 'Time logged successfully' });
  } catch (err) {
    console.error('Error logging time:', err);
    res.status(500).json({ success: false, error: 'Failed to log time' });
  }
};
