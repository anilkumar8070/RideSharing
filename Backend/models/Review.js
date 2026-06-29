const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    rideId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Ride',
        required: true
    },
    riderFrom: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    riderTo: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: [true, 'Please provide a rating'],
        min: 1,
        max: 5
    },
    title: {
        type: String,
        required: [true, 'Please provide a title']
    },
    comment: {
        type: String,
        required: [true, 'Please provide a comment']
    },
    categories: {
        cleanliness: Number,
        communication: Number,
        driving: Number,
        friendliness: Number
    },
    isAnonymous: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);
