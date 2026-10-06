const db = require('../db');

// @desc    Get all tickets with filters & role scoping
// @route   GET /api/tickets
// @access  Private
exports.getTickets = async (req, res) => {
  try {
    const { status, priority, project_id, client_id } = req.query;
    const isStaff = ['admin', 'super_admin', 'manager', 'employee', 'support'].includes(req.user.role_name);

    let query = `
      SELECT t.*, 
             u.name AS client_name, u.email AS client_email,
             a.name AS assigned_to_name,
             COALESCE(s.title, CONCAT('Project #', t.project_id)) AS project_title,
             (SELECT COUNT(*) FROM ticket_replies tr WHERE tr.ticket_id = t.id) AS reply_count
      FROM tickets t
      LEFT JOIN users u ON t.client_id = u.id
      LEFT JOIN users a ON t.assigned_to = a.id
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN services s ON p.service_id = s.id
      WHERE 1=1
    `;
    const params = [];

    // Role-based scoping: regular clients only see their own tickets
    if (!isStaff) {
      query += ` AND t.client_id = ?`;
      params.push(req.user.id);
    } else if (client_id) {
      query += ` AND t.client_id = ?`;
      params.push(client_id);
    }

    if (status) {
      query += ` AND t.status = ?`;
      params.push(status);
    }
    if (priority) {
      query += ` AND t.priority = ?`;
      params.push(priority);
    }
    if (project_id) {
      query += ` AND t.project_id = ?`;
      params.push(project_id);
    }

    query += ` ORDER BY FIELD(t.priority, 'urgent', 'high', 'medium', 'low'), t.updated_at DESC`;

    const [tickets] = await db.query(query, params);
    res.json({ success: true, count: tickets.length, data: tickets });
  } catch (error) {
    console.error('getTickets error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching tickets' });
  }
};

// @desc    Get single ticket details with reply thread
// @route   GET /api/tickets/:id
// @access  Private
exports.getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    const isStaff = ['admin', 'super_admin', 'manager', 'employee', 'support'].includes(req.user.role_name);

    let ticketQuery = `
      SELECT t.*, 
             u.name AS client_name, u.email AS client_email,
             a.name AS assigned_to_name,
             COALESCE(s.title, CONCAT('Project #', t.project_id)) AS project_title
      FROM tickets t
      LEFT JOIN users u ON t.client_id = u.id
      LEFT JOIN users a ON t.assigned_to = a.id
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN services s ON p.service_id = s.id
      WHERE t.id = ? OR t.uuid = ?
    `;
    const [tickets] = await db.query(ticketQuery, [id, id]);

    if (!tickets.length) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const ticket = tickets[0];

    // Client ownership check
    if (!isStaff && ticket.client_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this ticket' });
    }

    // Fetch replies. Exclude internal notes for non-staff
    let replyQuery = `
      SELECT tr.*, u.name AS author_name, r.name AS author_role
      FROM ticket_replies tr
      JOIN users u ON tr.author_id = u.id
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE tr.ticket_id = ?
    `;
    const replyParams = [ticket.id];

    if (!isStaff) {
      replyQuery += ` AND tr.is_internal_note = FALSE`;
    }

    replyQuery += ` ORDER BY tr.created_at ASC`;

    const [replies] = await db.query(replyQuery, replyParams);

    res.json({
      success: true,
      data: {
        ...ticket,
        replies
      }
    });
  } catch (error) {
    console.error('getTicketById error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching ticket' });
  }
};

// @desc    Create a new support ticket
// @route   POST /api/tickets
// @access  Private
exports.createTicket = async (req, res) => {
  try {
    const { subject, description, priority, project_id } = req.body;
    if (!subject || !description) {
      return res.status(400).json({ success: false, message: 'Subject and description are required' });
    }

    const clientId = req.user.id;
    const ticketPriority = priority || 'medium';

    const [result] = await db.query(
      `INSERT INTO tickets (client_id, project_id, subject, description, priority, status)
       VALUES (?, ?, ?, ?, ?, 'open')`,
      [clientId, project_id || null, subject, description, ticketPriority]
    );

    const [newTicket] = await db.query(`SELECT * FROM tickets WHERE id = ?`, [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Support ticket created successfully',
      data: newTicket[0]
    });
  } catch (error) {
    console.error('createTicket error:', error);
    res.status(500).json({ success: false, message: 'Server error creating ticket' });
  }
};

// @desc    Add reply to ticket
// @route   POST /api/tickets/:id/reply
// @access  Private
exports.replyTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, is_internal_note } = req.body;
    const isStaff = ['admin', 'super_admin', 'manager', 'employee', 'support'].includes(req.user.role_name);

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Reply message cannot be empty' });
    }

    const [tickets] = await db.query(`SELECT * FROM tickets WHERE id = ?`, [id]);
    if (!tickets.length) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const ticket = tickets[0];
    if (!isStaff && ticket.client_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to reply to this ticket' });
    }

    const internalNote = isStaff ? (is_internal_note === true || is_internal_note === 1) : false;

    await db.query(
      `INSERT INTO ticket_replies (ticket_id, author_id, message, is_internal_note)
       VALUES (?, ?, ?, ?)`,
      [ticket.id, req.user.id, message.trim(), internalNote]
    );

    // Auto-update ticket status: if client replied, set to 'open' / 'in_progress', if staff replied, set to 'waiting_on_client'
    let newStatus = ticket.status;
    if (!internalNote) {
      if (!isStaff && ticket.status === 'waiting_on_client') {
        newStatus = 'in_progress';
      } else if (isStaff && ticket.status === 'open') {
        newStatus = 'in_progress';
      }
    }

    await db.query(`UPDATE tickets SET status = ?, updated_at = NOW() WHERE id = ?`, [newStatus, ticket.id]);

    res.status(201).json({
      success: true,
      message: 'Reply posted successfully'
    });
  } catch (error) {
    console.error('replyTicket error:', error);
    res.status(500).json({ success: false, message: 'Server error posting reply' });
  }
};

// @desc    Update ticket status / priority / assignment (Staff only)
// @route   PATCH /api/tickets/:id
// @access  Private (Staff/Admin)
exports.updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, assigned_to } = req.body;

    const [tickets] = await db.query(`SELECT * FROM tickets WHERE id = ?`, [id]);
    if (!tickets.length) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const updates = [];
    const params = [];

    if (status) {
      updates.push(`status = ?`);
      params.push(status);
      if (status === 'resolved' || status === 'closed') {
        updates.push(`resolved_at = NOW()`);
      } else {
        updates.push(`resolved_at = NULL`);
      }
    }

    if (priority) {
      updates.push(`priority = ?`);
      params.push(priority);
    }

    if (assigned_to !== undefined) {
      updates.push(`assigned_to = ?`);
      params.push(assigned_to || null);
    }

    if (!updates.length) {
      return res.status(400).json({ success: false, message: 'No valid update fields provided' });
    }

    params.push(id);
    await db.query(`UPDATE tickets SET ${updates.join(', ')} WHERE id = ?`, params);

    const [updatedTicket] = await db.query(`SELECT * FROM tickets WHERE id = ?`, [id]);
    res.json({
      success: true,
      message: 'Ticket updated successfully',
      data: updatedTicket[0]
    });
  } catch (error) {
    console.error('updateTicket error:', error);
    res.status(500).json({ success: false, message: 'Server error updating ticket' });
  }
};
