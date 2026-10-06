const db = require('../db');
const crypto = require('crypto');
const { logAuditEvent } = require('../middleware/securityMiddleware');

// Get all invoices with pagination & status filters
exports.getInvoices = async (req, res) => {
  try {
    const { status, client_id, fy_year, limit = 50, offset = 0 } = req.query;
    let query = `
      SELECT i.*, u.name as client_name, u.email as client_email, COALESCE(s.title, CONCAT('Project #', i.project_id)) as project_title
      FROM invoices i
      JOIN users u ON i.client_id = u.id
      LEFT JOIN projects p ON i.project_id = p.id
      LEFT JOIN services s ON p.service_id = s.id
      WHERE i.deleted_at IS NULL
    `;
    const params = [];

    if (status) {
      query += ` AND i.status = ?`;
      params.push(status);
    }
    if (client_id) {
      query += ` AND i.client_id = ?`;
      params.push(client_id);
    }
    if (fy_year) {
      query += ` AND i.fy_year = ?`;
      params.push(fy_year);
    }

    query += ` ORDER BY i.created_at DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const [invoices] = await db.query(query, params);
    res.json({ success: true, invoices });
  } catch (err) {
    console.error('Error fetching invoices:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch invoices' });
  }
};

// Create new GST invoice
exports.createInvoice = async (req, res) => {
  try {
    const {
      client_id, project_id, service_request_id,
      place_of_supply, gst_treatment = 'registered',
      subtotal, cgst_rate = 0, sgst_rate = 0, igst_rate = 0,
      issued_date, due_date, items = [], fy_year = '2026-27'
    } = req.body;

    if (!client_id || !subtotal || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Client, subtotal and line items are required' });
    }

    const cgstAmount = (Number(subtotal) * Number(cgst_rate)) / 100;
    const sgstAmount = (Number(subtotal) * Number(sgst_rate)) / 100;
    const igstAmount = (Number(subtotal) * Number(igst_rate)) / 100;
    const totalAmount = Number(subtotal) + cgstAmount + sgstAmount + igstAmount;

    // Generate sequential invoice number
    const [countRows] = await db.query(
      `SELECT COUNT(*) as count FROM invoices WHERE fy_year = ?`,
      [fy_year]
    );
    const seq = String(countRows[0].count + 1).padStart(4, '0');
    const invoiceNo = `EDZ/${fy_year}/${seq}`;

    const [result] = await db.query(
      `INSERT INTO invoices (invoice_no, fy_year, project_id, service_request_id, client_id, place_of_supply, gst_treatment, subtotal, cgst_rate, sgst_rate, igst_rate, cgst_amount, sgst_amount, igst_amount, total_amount, status, issued_date, due_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?)`,
      [invoiceNo, fy_year, project_id || null, service_request_id || null, client_id, place_of_supply || null, gst_treatment, subtotal, cgst_rate, sgst_rate, igst_rate, cgstAmount, sgstAmount, igstAmount, totalAmount, issued_date || null, due_date || null]
    );

    const invoiceId = result.insertId;

    for (const item of items) {
      await db.query(
        `INSERT INTO invoice_items (invoice_id, description, hsn_sac_code, quantity, unit_price, amount)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [invoiceId, item.description, item.hsn_sac_code || '998314', item.quantity || 1, item.unit_price, Number(item.quantity || 1) * Number(item.unit_price)]
      );
    }

    await logAuditEvent({
      userId: req.user?.id || null,
      action: 'invoices.create',
      entityType: 'invoice',
      entityId: invoiceId,
      metadata: { invoiceNo, totalAmount }
    });

    res.status(201).json({ success: true, message: 'Invoice created', invoiceId, invoiceNo });
  } catch (err) {
    console.error('Error creating invoice:', err);
    res.status(500).json({ success: false, error: 'Failed to create invoice' });
  }
};

// Record payment (manual or gateway callback)
exports.recordPayment = async (req, res) => {
  try {
    const { invoice_id, amount, method, gateway_payment_id, gateway_order_id, receipt_url } = req.body;

    if (!invoice_id || !amount || !method) {
      return res.status(400).json({ success: false, error: 'Invoice ID, amount, and payment method are required' });
    }

    const [invoices] = await db.query(`SELECT * FROM invoices WHERE id = ?`, [invoice_id]);
    if (invoices.length === 0) return res.status(404).json({ success: false, error: 'Invoice not found' });

    const invoice = invoices[0];

    const [payResult] = await db.query(
      `INSERT INTO payments (invoice_id, client_id, amount, method, gateway_payment_id, gateway_order_id, status, receipt_url, paid_at)
       VALUES (?, ?, ?, ?, ?, ?, 'success', ?, NOW())`,
      [invoice_id, invoice.client_id, amount, method, gateway_payment_id || null, gateway_order_id || null, receipt_url || null]
    );

    // Update running amount_paid on invoice
    const newAmountPaid = Number(invoice.amount_paid) + Number(amount);
    const newStatus = newAmountPaid >= Number(invoice.total_amount) ? 'paid' : 'partially_paid';

    await db.query(
      `UPDATE invoices SET amount_paid = ?, status = ? WHERE id = ?`,
      [newAmountPaid, newStatus, invoice_id]
    );

    await logAuditEvent({
      userId: req.user?.id || null,
      action: 'payments.recorded',
      entityType: 'payment',
      entityId: payResult.insertId,
      metadata: { invoiceId: invoice_id, amount, method, newStatus }
    });

    res.status(201).json({ success: true, message: 'Payment recorded', paymentId: payResult.insertId, newStatus });
  } catch (err) {
    console.error('Error recording payment:', err);
    res.status(500).json({ success: false, error: 'Failed to record payment' });
  }
};

// Razorpay / Payment Gateway Webhook Handler
exports.handlePaymentWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'test_webhook_secret';
    const signature = req.headers['x-razorpay-signature'];
    const payload = JSON.stringify(req.body);

    let isSignatureValid = false;
    if (signature && webhookSecret) {
      const expectedSignature = crypto.createHmac('sha256', webhookSecret).update(payload).digest('hex');
      isSignatureValid = signature === expectedSignature;
    }

    const eventType = req.body.event || 'unknown';
    const paymentEntity = req.body.payload?.payment?.entity;

    if (paymentEntity && isSignatureValid) {
      const gatewayPaymentId = paymentEntity.id;
      const amount = paymentEntity.amount / 100; // Razorpay amounts are in paise

      // Check if payment row exists
      const [existingPay] = await db.query(
        `SELECT id, invoice_id FROM payments WHERE gateway_payment_id = ?`,
        [gatewayPaymentId]
      );

      if (existingPay.length > 0) {
        await db.query(
          `INSERT INTO payment_transactions (payment_id, event_type, raw_payload, gateway_signature_verified)
           VALUES (?, ?, ?, ?)`,
          [existingPay[0].id, eventType, payload, isSignatureValid]
        );
      }
    }

    res.json({ status: 'ok', verified: isSignatureValid });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: 'Webhook processing error' });
  }
};
