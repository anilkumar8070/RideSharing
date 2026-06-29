const Ride = require('../models/Ride');
const User = require('../models/User');
const { calculateDistance } = require('../utils/haversine');
const { estimateFare, calculateSplitFare } = require('../utils/fareCalc');

// @desc    Get matching travelers
// @route   GET /api/match/:rideId
// @access  Private
exports.findMatches = async (req, res) => {
    try {
        const { rideId } = req.params;
        const currentRide = await Ride.findById(rideId);

        if (!currentRide) {
            return res.status(404).json({ success: false, error: 'Ride not found' });
        }

        let potentialMatches = [];

        const exactMatchModes = ['Train', 'Flight', 'Bus'];

        if (exactMatchModes.includes(currentRide.transportMode) && currentRide.transportId) {
            // Matching by PNR, Flight No, or Bus Route No
            potentialMatches = await Ride.find({
                _id: { $ne: currentRide._id },
                user: { $ne: req.user.id },
                status: 'looking',
                transportMode: currentRide.transportMode,
                transportId: currentRide.transportId // Match exact transport ID
            }).populate('user', 'name phone isPhoneVerified rideCount profilePhoto');
        } else {
            // Default Geospatial matching
            const startLng = currentRide.startCoordinates.coordinates[0];
            const startLat = currentRide.startCoordinates.coordinates[1];

            // Max distance in radians for $geoWithin (e.g., 2km / 6378.1 km radius of earth)
            const radiusInRadians = 2 / 6378.1;

            potentialMatches = await Ride.find({
                _id: { $ne: currentRide._id },
                user: { $ne: req.user.id },
                status: 'looking',
                startCoordinates: {
                    $geoWithin: {
                        $centerSphere: [[startLng, startLat], radiusInRadians]
                    }
                }
            }).populate('user', 'name phone isPhoneVerified rideCount profilePhoto');
        }

        // 2. Filter by Destination Proximity (within 5km of each other)
        const currentDestCoords = currentRide.destinationCoordinates.coordinates;
        
        let finalMatches = [];

        for (let match of potentialMatches) {
            const matchDestCoords = match.destinationCoordinates.coordinates;
            const destDistance = calculateDistance(currentDestCoords, matchDestCoords);

            const hasAccepted = currentRide.acceptedUsers.some(id => id.toString() === match.user._id.toString());
            const isMutualMatch = currentRide.confirmedMatches.some(id => id.toString() === match.user._id.toString());

            // For fixed transport, we don't strictly need destination proximity
            // But we include the match if they are on the same transportId.
            if (exactMatchModes.includes(currentRide.transportMode)) {
                finalMatches.push({
                    matchRideId: match._id,
                    traveler: match.user,
                    transportMode: match.transportMode,
                    transportId: match.transportId,
                    coachAndSeat: match.coachAndSeat,
                    interests: match.interests,
                    destinationName: match.destinationName,
                    timeOfArrival: match.timeOfArrival,
                    distanceToTheirDestination: `${destDistance.toFixed(1)} km`,
                    hasAccepted,
                    isMutualMatch,
                    fareEstimation: {
                        totalFare: `₹0 (${match.transportMode})`,
                        splitFare: `₹0`, 
                        savings: `₹0`
                    }
                });
            } else if (destDistance <= 5) {
                // Calculate distance from start to destination to estimate fare
                const rideDistance = calculateDistance(
                    currentRide.startCoordinates.coordinates,
                    currentRide.destinationCoordinates.coordinates
                );

                const totalEstimatedFare = estimateFare(rideDistance);
                
                // Construct the Match Data Object for the Frontend card
                finalMatches.push({
                    matchRideId: match._id,
                    traveler: match.user,
                    transportMode: match.transportMode,
                    transportId: match.transportId,
                    destinationName: match.destinationName,
                    distanceToTheirDestination: `${destDistance.toFixed(1)} km`,
                    timeOfArrival: match.timeOfArrival,
                    hasAccepted,
                    isMutualMatch,
                    
                    // Standout Feature 1: Fare Splitting
                    fareEstimation: {
                        totalFare: `₹${totalEstimatedFare}`,
                        // Split between the initiator + this 1 match
                        splitFare: `₹${calculateSplitFare(totalEstimatedFare, 2)} per person`, 
                        savings: `₹${totalEstimatedFare - calculateSplitFare(totalEstimatedFare, 2)}`
                    }
                });
            }
        }

        res.status(200).json({
            success: true,
            count: finalMatches.length,
            data: finalMatches
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error during matching' });
    }
};
