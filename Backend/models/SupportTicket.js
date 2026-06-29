const mongoose = require('mongoose');

const SupportTicketSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['bug-report', 'feature-request', 'complaint', 'general-inquiry', 'feedback'],
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
        maxlength: [2000, 'Description cannot be more than 2000 characters']
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['open', 'in-progress', 'resolved', 'closed'],
        default: 'open'
    },
    attachments: [String],
    response: {
        responder: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        message: String,
        respondedAt: Date
    },
    relatedRideId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Ride'
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    }
}, { timestamps: true });

module.exports = mongoose.model('SupportTicket', SupportTicketSchema);
