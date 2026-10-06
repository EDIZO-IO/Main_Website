const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { authenticateToken } = require('../middleware/authMiddleware');

// All ticket routes require authentication
router.use(authenticateToken);

router.get('/', ticketController.getTickets);
router.get('/:id', ticketController.getTicketById);
router.post('/', ticketController.createTicket);
router.post('/:id/reply', ticketController.replyTicket);
router.patch('/:id', ticketController.updateTicket);

module.exports = router;
