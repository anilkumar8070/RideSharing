const SupportTicket = require('../models/SupportTicket');

// @desc    Create a support ticket
// @route   POST /api/support
// @access  Private
exports.createTicket = async (req, res) => {
    try {
        const { type, title, description, priority, relatedRideId, attachments } = req.body;

        if (!type || !title || !description) {
            return res.status(400).json({ success: false, error: 'Please provide all required fields' });
        }

        const ticket = await SupportTicket.create({
            userId: req.user.id,
            type,
            title,
            description,
            priority: priority || 'medium',
            relatedRideId,
            attachments
        });

        res.status(201).json({
            success: true,
            data: ticket
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get all tickets for current user
// @route   GET /api/support
// @access  Private
exports.getMyTickets = async (req, res) => {
    try {
        const tickets = await SupportTicket.find({ userId: req.user.id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: tickets.length,
            data: tickets
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get single ticket
// @route   GET /api/support/:id
// @access  Private
exports.getTicket = async (req, res) => {
    try {
        const ticket = await SupportTicket.findById(req.params.id)
            .populate('userId', 'name email phone')
            .populate('response.responder', 'name');

        if (!ticket) {
            return res.status(404).json({ success: false, error: 'Ticket not found' });
        }

        // Check if user owns the ticket
        if (ticket.userId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, error: 'Not authorized' });
        }

        res.status(200).json({
            success: true,
            data: ticket
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Close a ticket
// @route   PATCH /api/support/:id/close
// @access  Private
exports.closeTicket = async (req, res) => {
    try {
        let ticket = await SupportTicket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ success: false, error: 'Ticket not found' });
        }

        // Check if user owns the ticket
        if (ticket.userId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, error: 'Not authorized' });
        }

        ticket = await SupportTicket.findByIdAndUpdate(
            req.params.id,
            { status: 'closed' },
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: ticket
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Rate support response
// @route   PATCH /api/support/:id/rate
// @access  Private
exports.rateTicket = async (req, res) => {
    try {
        const { rating } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, error: 'Please provide a rating between 1 and 5' });
        }

        let ticket = await SupportTicket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ success: false, error: 'Ticket not found' });
        }

        if (ticket.userId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, error: 'Not authorized' });
        }

        ticket = await SupportTicket.findByIdAndUpdate(
            req.params.id,
            { rating },
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: ticket
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
