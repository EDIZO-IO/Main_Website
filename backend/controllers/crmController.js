const db = require('../db');
const { logAuditEvent } = require('../middleware/securityMiddleware');

// Get all leads with optional stage, temperature, search filters
exports.getLeads = async (req, res) => {
  try {
    const { stage, temperature, search, assigned_to, limit = 50, offset = 0 } = req.query;
    let query = `
      SELECT l.*, ls.name as source_name, s.title as service_title, u.name as assigned_to_name
      FROM leads l
      LEFT JOIN lead_sources ls ON l.source_id = ls.id
      LEFT JOIN services s ON l.service_id = s.id
      LEFT JOIN users u ON l.assigned_to = u.id
      WHERE l.deleted_at IS NULL
    `;
    const params = [];

    if (stage) {
      query += ` AND l.stage = ?`;
      params.push(stage);
    }
    if (temperature) {
      query += ` AND l.temperature = ?`;
      params.push(temperature);
    }
    if (assigned_to) {
      query += ` AND l.assigned_to = ?`;
      params.push(assigned_to);
    }
    if (search) {
      query += ` AND (l.contact_name LIKE ? OR l.company_name LIKE ? OR l.email LIKE ? OR l.phone LIKE ?)`;
      const searchWild = `%${search}%`;
      params.push(searchWild, searchWild, searchWild, searchWild);
    }

    query += ` ORDER BY l.created_at DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const [leads] = await db.query(query, params);

    // Get count for pagination
    const [countRows] = await db.query(`SELECT COUNT(*) as total FROM leads WHERE deleted_at IS NULL`);

    res.json({
      success: true,
      data: leads,
      total: countRows[0].total
    });
  } catch (err) {
    console.error('Error fetching leads:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch leads' });
  }
};

// Create a new lead
exports.createLead = async (req, res) => {
  try {
    const {
      contact_name, company_name, email, phone,
      source_id, service_id, stage = 'new',
      estimated_value, assigned_to, temperature = 'warm',
      initial_note
    } = req.body;

    if (!contact_name) {
      return res.status(400).json({ success: false, error: 'Contact name is required' });
    }

    const [result] = await db.query(
      `INSERT INTO leads (contact_name, company_name, email, phone, source_id, service_id, stage, temperature, estimated_value, assigned_to)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [contact_name, company_name || null, email || null, phone || null, source_id || null, service_id || null, stage, temperature, estimated_value || null, assigned_to || null]
    );

    const leadId = result.insertId;

    if (initial_note && req.user?.id) {
      await db.query(
        `INSERT INTO lead_notes (lead_id, author_id, note) VALUES (?, ?, ?)`,
        [leadId, req.user.id, initial_note]
      );
    }

    // Log activity
    await db.query(
      `INSERT INTO lead_activities (lead_id, activity_type, details, performed_by) VALUES (?, 'other', 'Lead created in system', ?)`,
      [leadId, req.user?.id || null]
    );

    await logAuditEvent({
      userId: req.user?.id || null,
      action: 'crm.lead_create',
      entityType: 'lead',
      entityId: leadId,
      metadata: { contact_name, company_name, email }
    });

    res.status(201).json({ success: true, message: 'Lead created successfully', leadId });
  } catch (err) {
    console.error('Error creating lead:', err);
    res.status(500).json({ success: false, error: 'Failed to create lead' });
  }
};

// Get lead details with timeline and notes
exports.getLeadById = async (req, res) => {
  try {
    const { id } = req.params;
    const [leads] = await db.query(
      `SELECT l.*, ls.name as source_name, s.title as service_title, u.name as assigned_to_name
       FROM leads l
       LEFT JOIN lead_sources ls ON l.source_id = ls.id
       LEFT JOIN services s ON l.service_id = s.id
       LEFT JOIN users u ON l.assigned_to = u.id
       WHERE l.id = ? AND l.deleted_at IS NULL`,
      [id]
    );

    if (leads.length === 0) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }

    const [notes] = await db.query(
      `SELECT n.*, u.name as author_name 
       FROM lead_notes n 
       JOIN users u ON n.author_id = u.id 
       WHERE n.lead_id = ? 
       ORDER BY n.created_at DESC`,
      [id]
    );

    const [activities] = await db.query(
      `SELECT a.*, u.name as performed_by_name 
       FROM lead_activities a 
       LEFT JOIN users u ON a.performed_by = u.id 
       WHERE a.lead_id = ? 
       ORDER BY a.created_at DESC`,
      [id]
    );

    res.json({
      success: true,
      lead: leads[0],
      notes,
      activities
    });
  } catch (err) {
    console.error('Error fetching lead details:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch lead details' });
  }
};

// Update lead stage / status / assignee
exports.updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const { contact_name, company_name, email, phone, stage, temperature, score, estimated_value, assigned_to, lost_reason } = req.body;

    const [current] = await db.query(`SELECT * FROM leads WHERE id = ? AND deleted_at IS NULL`, [id]);
    if (current.length === 0) return res.status(404).json({ success: false, error: 'Lead not found' });

    await db.query(
      `UPDATE leads SET 
        contact_name = COALESCE(?, contact_name),
        company_name = COALESCE(?, company_name),
        email = COALESCE(?, email),
        phone = COALESCE(?, phone),
        stage = COALESCE(?, stage),
        temperature = COALESCE(?, temperature),
        score = COALESCE(?, score),
        estimated_value = COALESCE(?, estimated_value),
        assigned_to = COALESCE(?, assigned_to),
        lost_reason = COALESCE(?, lost_reason)
       WHERE id = ?`,
      [contact_name, company_name, email, phone, stage, temperature, score, estimated_value, assigned_to, lost_reason, id]
    );

    if (stage && stage !== current[0].stage) {
      await db.query(
        `INSERT INTO lead_activities (lead_id, activity_type, details, performed_by) VALUES (?, 'stage_change', ?, ?)`,
        [id, `Stage changed from ${current[0].stage} to ${stage}`, req.user?.id || null]
      );
    }

    res.json({ success: true, message: 'Lead updated successfully' });
  } catch (err) {
    console.error('Error updating lead:', err);
    res.status(500).json({ success: false, error: 'Failed to update lead' });
  }
};

// Add note to lead
exports.addLeadNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;
    if (!note) return res.status(400).json({ success: false, error: 'Note text required' });

    await db.query(
      `INSERT INTO lead_notes (lead_id, author_id, note) VALUES (?, ?, ?)`,
      [id, req.user.id, note]
    );

    res.status(201).json({ success: true, message: 'Note added successfully' });
  } catch (err) {
    console.error('Error adding lead note:', err);
    res.status(500).json({ success: false, error: 'Failed to add note' });
  }
};

// Log activity (Call, Email, Meeting, Follow-up)
exports.addLeadActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { activity_type, details, follow_up_at } = req.body;

    await db.query(
      `INSERT INTO lead_activities (lead_id, activity_type, details, follow_up_at, performed_by) VALUES (?, ?, ?, ?, ?)`,
      [id, activity_type || 'other', details, follow_up_at || null, req.user.id]
    );

    res.status(201).json({ success: true, message: 'Activity logged successfully' });
  } catch (err) {
    console.error('Error logging activity:', err);
    res.status(500).json({ success: false, error: 'Failed to log activity' });
  }
};

// Get lead sources
exports.getLeadSources = async (req, res) => {
  try {
    const [sources] = await db.query(`SELECT * FROM lead_sources ORDER BY name ASC`);
    res.json({ success: true, sources });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch lead sources' });
  }
};
