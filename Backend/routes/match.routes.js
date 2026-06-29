const express = require('express');
const { findMatches } = require('../controllers/match.ctrl');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/:rideId')
    .get(protect, findMatches);

module.exports = router;
