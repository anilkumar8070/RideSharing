const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    rideId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Ride'
    },
    type: {
        type: String,
        enum: ['payment', 'refund', 'split-payment', 'wallet-topup'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['wallet', 'card', 'upi', 'bank-transfer'],
        default: 'wallet'
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'cancelled'],
        default: 'pending'
    },
    description: String,
    transactionId: String,
    orderId: String,
    relatedUsers: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
