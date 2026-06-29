const mongoose = require('mongoose');

const RideSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    transportMode: {
        type: String,
        enum: ['Train', 'Flight', 'Bus', 'Already There'],
        required: [true, 'Please specify mode of transport']
    },
    transportId: {
        type: String, // PNR no, Flight no, Bus route
        trim: true
    },
    coachAndSeat: {
        type: String,
        trim: true
    },
    interests: {
        type: [String]
    },
    startLocationName: {
        type: String,
        required: [true, 'Please add a starting location name (e.g. Station/Airport)']
    },
    startCoordinates: { // GeoJSON Point for geospatial queries
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: [true, 'Please provide start coordinates']
        }
    },
    destinationName: {
        type: String,
        required: [true, 'Please add a destination name']
    },
    destinationCoordinates: { // GeoJSON Point
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: [true, 'Please provide destination coordinates']
        }
    },
    timeOfArrival: {
        type: Date,
        required: [true, 'Please add an arrival time']
    },
    capacity: {
        type: Number,
        default: 4,
        min: 2,
        max: 8
    },
    acceptedUsers: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    confirmedMatches: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    rejectedUsers: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['looking', 'matched', 'in-transit', 'completed', 'cancelled'],
        default: 'looking'
    },
    cancellationReason: String
}, { timestamps: true });

// Add 2dsphere indexes for location-based matching calculations
RideSchema.index({ startCoordinates: '2dsphere' });
RideSchema.index({ destinationCoordinates: '2dsphere' });

module.exports = mongoose.model('Ride', RideSchema);
