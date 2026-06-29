const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    chatId: {
        type: String,
        required: true,
        index: true // Room ID or ride configuration string
    },
    senderId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    senderName: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
