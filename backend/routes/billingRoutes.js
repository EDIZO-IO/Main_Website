const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');
const { authenticateToken, requireModuleAccess } = require('../middleware/authMiddleware');

// Public Webhook (Raw payload verified via HMAC signature)
router.post('/webhook', billingController.handlePaymentWebhook);

// Protected Staff & Client Routes
router.use(authenticateToken);
router.use(requireModuleAccess('billing'));

router.get('/invoices', billingController.getInvoices);
router.post('/invoices', billingController.createInvoice);
router.post('/payments', billingController.recordPayment);

module.exports = router;
