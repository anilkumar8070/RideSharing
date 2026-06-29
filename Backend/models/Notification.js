const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['match-found', 'match-accepted', 'match-rejected', 'ride-cancelled', 'message-received', 'ride-completed', 'review-received'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    relatedRideId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Ride'
    },
    relatedUserId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    actionUrl: String,
    icon: String,
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    }
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
