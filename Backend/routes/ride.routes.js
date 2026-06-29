const express = require('express');
const { 
    createRide,
    getMyRides,
    getRide,
    updateRideStatus,
    cancelRide,
    acceptMatch,
    rejectMatch
} = require('../controllers/ride.ctrl');
const { protect } = require('../middleware/auth'); // Require valid JWT to use these routes
const validate = require('../middleware/validate');
const { createRideSchema } = require('../validations/ride.validation');

const router = express.Router();

router.route('/')
    .post(protect, validate(createRideSchema), createRide);

router.get('/my-rides', protect, getMyRides);
router.get('/:id', getRide);
router.patch('/:id/status', protect, updateRideStatus);
router.patch('/:id/cancel', protect, cancelRide);
router.post('/:rideId/accept-match/:matchRideId', protect, acceptMatch);
router.post('/:rideId/reject-match/:userId', protect, rejectMatch);

module.exports = router;
