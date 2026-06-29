const Ride = require('../models/Ride');
const User = require('../models/User');

// @desc    Create a new ride plan (Post Travel Plan)
// @route   POST /api/rides
// @access  Private
exports.createRide = async (req, res) => {
    try {
        const { 
            transportMode, 
            transportId, 
            startLocationName, 
            startCoordinates,   // Expecting [lng, lat]
            destinationName, 
            destinationCoordinates, // Expecting [lng, lat]
            timeOfArrival,
            capacity,
            coachAndSeat,
            interests
        } = req.body;

        // Construct the ride object linking back to the verified user
        const rideData = {
            user: req.user.id,
            transportMode,
            transportId,
            startLocationName,
            startCoordinates: {
                type: 'Point',
                coordinates: startCoordinates 
            },
            destinationName,
            destinationCoordinates: {
                type: 'Point',
                coordinates: destinationCoordinates
            },
            timeOfArrival,
            capacity: capacity || 4,
            coachAndSeat,
            interests
        };

        const ride = await Ride.create(rideData);

        // Increment user's ride count
        await User.findByIdAndUpdate(req.user.id, { $inc: { rideCount: 1 } });

        res.status(201).json({
            success: true,
            data: ride
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get user's rides
// @route   GET /api/rides/my-rides
// @access  Private
exports.getMyRides = async (req, res) => {
    try {
        const rides = await Ride.find({ user: req.user.id })
            .populate('confirmedMatches', 'name profilePhoto phone')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: rides.length,
            data: rides
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get single ride
// @route   GET /api/rides/:id
// @access  Public
exports.getRide = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id)
            .populate('user', 'name phone profilePhoto averageRating totalRatings')
            .populate('confirmedMatches', 'name phone profilePhoto averageRating');

        if (!ride) {
            return res.status(404).json({ success: false, error: 'Ride not found' });
        }

        res.status(200).json({
            success: true,
            data: ride
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Update ride status
// @route   PATCH /api/rides/:id/status
// @access  Private
exports.updateRideStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['looking', 'matched', 'in-transit', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({ success: false, error: 'Invalid status' });
        }

        let ride = await Ride.findById(req.params.id);

        if (!ride) {
            return res.status(404).json({ success: false, error: 'Ride not found' });
        }

        if (ride.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, error: 'Not authorized' });
        }

        // If completing ride, update user stats
        if (status === 'completed') {
            await User.findByIdAndUpdate(req.user.id, { $inc: { completedRides: 1 } });
            // Also update confirmed matches stats
            if (ride.confirmedMatches.length > 0) {
                await User.updateMany(
                    { _id: { $in: ride.confirmedMatches } },
                    { $inc: { completedRides: 1 } }
                );
            }
        }

        ride = await Ride.findByIdAndUpdate(req.params.id, { status }, { new: true });

        res.status(200).json({
            success: true,
            data: ride
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Cancel ride
// @route   PATCH /api/rides/:id/cancel
// @access  Private
exports.cancelRide = async (req, res) => {
    try {
        const { reason } = req.body;

        let ride = await Ride.findById(req.params.id);

        if (!ride) {
            return res.status(404).json({ success: false, error: 'Ride not found' });
        }

        if (ride.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, error: 'Not authorized' });
        }

        ride = await Ride.findByIdAndUpdate(
            req.params.id,
            { status: 'cancelled', cancellationReason: reason },
            { new: true }
        );

        // Update user's cancelled rides count
        await User.findByIdAndUpdate(req.user.id, { $inc: { cancelledRides: 1 } });

        res.status(200).json({
            success: true,
            data: ride
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Accept a match
// @route   POST /api/rides/:rideId/accept-match/:matchRideId
// @access  Private
exports.acceptMatch = async (req, res) => {
    try {
        const { rideId, matchRideId } = req.params;

        const ride = await Ride.findById(rideId);
        const matchRide = await Ride.findById(matchRideId);

        if (!ride || !matchRide) {
            return res.status(404).json({ success: false, error: 'Ride not found' });
        }

        // Check capacity
        if (ride.confirmedMatches.length >= ride.capacity - 1) {
            return res.status(400).json({ success: false, error: 'Ride is at capacity' });
        }

        // Add to accepted users for the current ride
        if (!ride.acceptedUsers.includes(matchRide.user)) {
            ride.acceptedUsers.push(matchRide.user);
            await ride.save();
        }

        // Check for mutual match
        let isMutualMatch = false;
        if (matchRide.acceptedUsers.includes(ride.user)) {
            isMutualMatch = true;

            // Add to confirmed matches for both
            if (!ride.confirmedMatches.includes(matchRide.user)) {
                ride.confirmedMatches.push(matchRide.user);
                await ride.save();
            }

            if (!matchRide.confirmedMatches.includes(ride.user)) {
                matchRide.confirmedMatches.push(ride.user);
                await matchRide.save();
            }
        }

        res.status(200).json({
            success: true,
            isMutualMatch,
            message: isMutualMatch ? 'Mutual match! You can now chat.' : 'Match accepted. Waiting for the other person to accept.'
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Reject a match
// @route   POST /api/rides/:rideId/reject-match/:userId
// @access  Private
exports.rejectMatch = async (req, res) => {
    try {
        const { rideId, userId } = req.params;

        let ride = await Ride.findById(rideId);

        if (!ride) {
            return res.status(404).json({ success: false, error: 'Ride not found' });
        }

        if (ride.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, error: 'Not authorized' });
        }

        if (!ride.rejectedUsers.includes(userId)) {
            ride.rejectedUsers.push(userId);
            await ride.save();
        }

        res.status(200).json({
            success: true,
            message: 'Match rejected'
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
