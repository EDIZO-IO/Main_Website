const db = require('../db');
const { logAuditEvent } = require('../middleware/securityMiddleware');

// Get proposals list
exports.getProposals = async (req, res) => {
  try {
    const { status, client_id, lead_id } = req.query;
    let query = `
      SELECT p.*, u.name as client_name, u.email as client_email, l.contact_name as lead_name
      FROM proposals p
      LEFT JOIN users u ON p.client_id = u.id
      LEFT JOIN leads l ON p.lead_id = l.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ` AND p.status = ?`;
      params.push(status);
    }
    if (client_id) {
      query += ` AND p.client_id = ?`;
      params.push(client_id);
    }
    if (lead_id) {
      query += ` AND p.lead_id = ?`;
      params.push(lead_id);
    }

    query += ` ORDER BY p.created_at DESC`;
    const [proposals] = await db.query(query, params);

    res.json({ success: true, proposals });
  } catch (err) {
    console.error('Error fetching proposals:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch proposals' });
  }
};

// Create new proposal with line items
exports.createProposal = async (req, res) => {
  try {
    const { lead_id, service_request_id, client_id, title, valid_until, items = [], currency = 'INR' } = req.body;

    if (!title || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Title and line items are required' });
    }

    const totalAmount = items.reduce((acc, item) => acc + (Number(item.quantity || 1) * Number(item.unit_price || 0)), 0);

    const [result] = await db.query(
      `INSERT INTO proposals (lead_id, service_request_id, client_id, title, valid_until, total_amount, currency, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'draft', ?)`,
      [lead_id || null, service_request_id || null, client_id || null, title, valid_until || null, totalAmount, currency, req.user?.id || null]
    );

    const proposalId = result.insertId;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      await db.query(
        `INSERT INTO proposal_items (proposal_id, description, quantity, unit_price, sort_order)
         VALUES (?, ?, ?, ?, ?)`,
        [proposalId, item.description, item.quantity || 1, item.unit_price, i]
      );
    }

    // Save initial version snapshot (v1)
    await db.query(
      `INSERT INTO proposal_versions (proposal_id, version_no, snapshot, created_by) VALUES (?, 1, ?, ?)`,
      [proposalId, JSON.stringify({ title, totalAmount, items, valid_until }), req.user?.id || null]
    );

    await logAuditEvent({
      userId: req.user?.id || null,
      action: 'proposals.create',
      entityType: 'proposal',
      entityId: proposalId,
      metadata: { title, totalAmount }
    });

    res.status(201).json({ success: true, message: 'Proposal created', proposalId });
  } catch (err) {
    console.error('Error creating proposal:', err);
    res.status(500).json({ success: false, error: 'Failed to create proposal' });
  }
};

// Get proposal details by UUID (Client accessible)
exports.getProposalByUuid = async (req, res) => {
  try {
    const { uuid } = req.params;
    const [proposals] = await db.query(
      `SELECT p.*, u.name as client_name, u.email as client_email, l.contact_name as lead_name, l.company_name as lead_company
       FROM proposals p
       LEFT JOIN users u ON p.client_id = u.id
       LEFT JOIN leads l ON p.lead_id = l.id
       WHERE p.uuid = ?`,
      [uuid]
    );

    if (proposals.length === 0) {
      return res.status(404).json({ success: false, error: 'Proposal not found' });
    }

    const proposal = proposals[0];
    const [items] = await db.query(
      `SELECT * FROM proposal_items WHERE proposal_id = ? ORDER BY sort_order ASC`,
      [proposal.id]
    );

    // Update status to 'viewed' if was 'sent'
    if (proposal.status === 'sent') {
      await db.query(`UPDATE proposals SET status = 'viewed' WHERE id = ?`, [proposal.id]);
      proposal.status = 'viewed';
    }

    res.json({ success: true, proposal, items });
  } catch (err) {
    console.error('Error fetching proposal:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch proposal' });
  }
};

// Digital Signature Acceptance
exports.signProposal = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { signer_name, signer_designation, agreed_terms } = req.body;

    if (!signer_name || !agreed_terms) {
      return res.status(400).json({ success: false, error: 'Signer name and terms acceptance are required' });
    }

    const [proposals] = await db.query(`SELECT * FROM proposals WHERE uuid = ?`, [uuid]);
    if (proposals.length === 0) return res.status(404).json({ success: false, error: 'Proposal not found' });

    const proposal = proposals[0];
    if (proposal.status === 'approved') {
      return res.status(400).json({ success: false, error: 'Proposal has already been signed and approved.' });
    }

    const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || '';
    const signatureData = {
      signer_name,
      signer_designation: signer_designation || 'Authorized Representative',
      client_ip: clientIp,
      user_agent: req.headers['user-agent'],
      timestamp: new Date().toISOString()
    };

    await db.query(
      `UPDATE proposals SET status = 'approved', signed_at = NOW(), signature_data = ? WHERE id = ?`,
      [JSON.stringify(signatureData), proposal.id]
    );

    await logAuditEvent({
      userId: req.user?.id || null,
      action: 'proposals.signed',
      entityType: 'proposal',
      entityId: proposal.id,
      ipAddress: clientIp,
      metadata: signatureData
    });

    res.json({ success: true, message: 'Proposal accepted & digitally signed successfully!' });
  } catch (err) {
    console.error('Error signing proposal:', err);
    res.status(500).json({ success: false, error: 'Failed to sign proposal' });
  }
};
