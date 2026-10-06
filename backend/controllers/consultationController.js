const db = require('../db');

// @desc    Get available consultation slots (public & authenticated)
// @route   GET /api/consultations/slots
// @access  Public / Private
exports.getAvailableSlots = async (req, res) => {
  try {
    const { from_date, to_date, host_id } = req.query;

    let query = `
      SELECT cs.id, cs.slot_start, cs.slot_end, cs.host_id,
             u.name AS host_name
      FROM consultation_slots cs
      JOIN users u ON cs.host_id = u.id
      WHERE cs.is_booked = FALSE
        AND cs.slot_start >= NOW()
    `;
    const params = [];

    if (from_date) {
      query += ` AND cs.slot_start >= ?`;
      params.push(from_date);
    }
    if (to_date) {
      query += ` AND cs.slot_end <= ?`;
      params.push(to_date);
    }
    if (host_id) {
      query += ` AND cs.host_id = ?`;
      params.push(host_id);
    }

    query += ` ORDER BY cs.slot_start ASC LIMIT 100`;

    const [slots] = await db.query(query, params);
    res.json({ success: true, count: slots.length, data: slots });
  } catch (error) {
    console.error('getAvailableSlots error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching available slots' });
  }
};

// @desc    Create consultation slots (Host / Admin)
// @route   POST /api/consultations/slots
// @access  Private (Staff/Admin)
exports.createSlots = async (req, res) => {
  try {
    const { slots } = req.body; // Array of { slot_start, slot_end } or single object
    const hostId = req.body.host_id || req.user.id;

    if (!slots || (!Array.isArray(slots) && (!req.body.slot_start || !req.body.slot_end))) {
      return res.status(400).json({ success: false, message: 'Slot details (start and end times) are required' });
    }

    const slotList = Array.isArray(slots) ? slots : [{ slot_start: req.body.slot_start, slot_end: req.body.slot_end }];

    for (const slot of slotList) {
      await db.query(
        `INSERT INTO consultation_slots (host_id, slot_start, slot_end, is_booked)
         VALUES (?, ?, ?, FALSE)`,
        [hostId, slot.slot_start, slot.slot_end]
      );
    }

    res.status(201).json({
      success: true,
      message: `Successfully created ${slotList.length} consultation slot(s)`
    });
  } catch (error) {
    console.error('createSlots error:', error);
    res.status(500).json({ success: false, message: 'Server error creating consultation slots' });
  }
};

// @desc    Book a consultation session
// @route   POST /api/consultations/book
// @access  Public (Guest) or Private (Client)
exports.bookConsultation = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { slot_id, guest_name, guest_email, topic, lead_id, meeting_link } = req.body;
    const clientId = req.user ? req.user.id : null;

    if (!slot_id || (!clientId && (!guest_name || !guest_email))) {
      return res.status(400).json({ success: false, message: 'Slot ID, name, and email are required' });
    }

    await connection.beginTransaction();

    // Check slot availability with FOR UPDATE lock
    const [slots] = await connection.query(
      `SELECT * FROM consultation_slots WHERE id = ? FOR UPDATE`,
      [slot_id]
    );

    if (!slots.length) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Consultation slot not found' });
    }

    if (slots[0].is_booked) {
      await connection.rollback();
      return res.status(409).json({ success: false, message: 'This slot has already been booked' });
    }

    // Insert consultation record
    const [bookingResult] = await connection.query(
      `INSERT INTO consultations (slot_id, lead_id, client_id, guest_name, guest_email, topic, meeting_link, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'scheduled')`,
      [
        slot_id,
        lead_id || null,
        clientId,
        guest_name || (req.user ? req.user.name : null),
        guest_email || (req.user ? req.user.email : null),
        topic || 'General Consultation',
        meeting_link || 'https://meet.google.com/edizo-consult'
      ]
    );

    // Mark slot as booked
    await connection.query(`UPDATE consultation_slots SET is_booked = TRUE WHERE id = ?`, [slot_id]);

    await connection.commit();

    const [newBooking] = await db.query(
      `SELECT c.*, cs.slot_start, cs.slot_end, u.name AS host_name
       FROM consultations c
       JOIN consultation_slots cs ON c.slot_id = cs.id
       JOIN users u ON cs.host_id = u.id
       WHERE c.id = ?`,
      [bookingResult.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Consultation successfully scheduled',
      data: newBooking[0]
    });
  } catch (error) {
    await connection.rollback();
    console.error('bookConsultation error:', error);
    res.status(500).json({ success: false, message: 'Server error booking consultation' });
  } finally {
    connection.release();
  }
};

// @desc    Get consultations list
// @route   GET /api/consultations
// @access  Private
exports.getConsultations = async (req, res) => {
  try {
    const { status, host_id } = req.query;
    const isStaff = ['admin', 'super_admin', 'manager', 'employee'].includes(req.user.role_name);

    let query = `
      SELECT c.*, cs.slot_start, cs.slot_end, cs.host_id,
             h.name AS host_name,
             u.name AS client_name, u.email AS registered_email
      FROM consultations c
      JOIN consultation_slots cs ON c.slot_id = cs.id
      JOIN users h ON cs.host_id = h.id
      LEFT JOIN users u ON c.client_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (!isStaff) {
      query += ` AND (c.client_id = ? OR c.guest_email = ?)`;
      params.push(req.user.id, req.user.email);
    } else {
      if (host_id) {
        query += ` AND cs.host_id = ?`;
        params.push(host_id);
      }
    }

    if (status) {
      query += ` AND c.status = ?`;
      params.push(status);
    }

    query += ` ORDER BY cs.slot_start DESC`;

    const [consultations] = await db.query(query, params);
    res.json({ success: true, count: consultations.length, data: consultations });
  } catch (error) {
    console.error('getConsultations error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching consultations' });
  }
};

// @desc    Update consultation status (Staff/Host)
// @route   PATCH /api/consultations/:id
// @access  Private
exports.updateConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, meeting_link, topic } = req.body;

    const [consultations] = await db.query(`SELECT * FROM consultations WHERE id = ?`, [id]);
    if (!consultations.length) {
      return res.status(404).json({ success: false, message: 'Consultation not found' });
    }

    const consultation = consultations[0];
    const updates = [];
    const params = [];

    if (status) {
      updates.push(`status = ?`);
      params.push(status);

      // If cancelled, free up the slot
      if (status === 'cancelled') {
        await db.query(`UPDATE consultation_slots SET is_booked = FALSE WHERE id = ?`, [consultation.slot_id]);
      }
    }

    if (meeting_link) {
      updates.push(`meeting_link = ?`);
      params.push(meeting_link);
    }
    if (topic) {
      updates.push(`topic = ?`);
      params.push(topic);
    }

    if (!updates.length) {
      return res.status(400).json({ success: false, message: 'No valid update fields provided' });
    }

    params.push(id);
    await db.query(`UPDATE consultations SET ${updates.join(', ')} WHERE id = ?`, params);

    const [updated] = await db.query(`SELECT * FROM consultations WHERE id = ?`, [id]);
    res.json({
      success: true,
      message: 'Consultation updated successfully',
      data: updated[0]
    });
  } catch (error) {
    console.error('updateConsultation error:', error);
    res.status(500).json({ success: false, message: 'Server error updating consultation' });
  }
};
