const express = require('express');
const { 
    createTicket, 
    getMyTickets, 
    getTicket, 
    closeTicket, 
    rateTicket 
} = require('../controllers/support.ctrl');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createTicket);
router.get('/', protect, getMyTickets);
router.get('/:id', protect, getTicket);
router.patch('/:id/close', protect, closeTicket);
router.patch('/:id/rate', protect, rateTicket);

module.exports = router;
