const Review = require('../models/Review');
const User = require('../models/User');
const Ride = require('../models/Ride');

// @desc    Create a review for a rider
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res) => {
    try {
        const { rideId, rideTo, rating, title, comment, categories, isAnonymous } = req.body;

        // Validate review data
        if (!rideId || !rideTo || !rating || !title || !comment) {
            return res.status(400).json({ success: false, error: 'Please provide all required fields' });
        }

        // Check if ride exists
        const ride = await Ride.findById(rideId);
        if (!ride) {
            return res.status(404).json({ success: false, error: 'Ride not found' });
        }

        // Check if reviewed user was on the ride
        if (!ride.confirmedMatches.includes(rideTo) && ride.user._id.toString() !== rideTo) {
            return res.status(400).json({ success: false, error: 'User was not on this ride' });
        }

        // Check if review already exists
        const existingReview = await Review.findOne({ rideId, riderFrom: req.user.id, riderTo: rideTo });
        if (existingReview) {
            return res.status(400).json({ success: false, error: 'You have already reviewed this user for this ride' });
        }

        const review = await Review.create({
            rideId,
            riderFrom: req.user.id,
            riderTo: rideTo,
            rating,
            title,
            comment,
            categories,
            isAnonymous
        });

        // Update user's average rating
        const allReviews = await Review.find({ riderTo: rideTo });
        const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

        await User.findByIdAndUpdate(rideTo, {
            averageRating: parseFloat(avgRating.toFixed(1)),
            totalRatings: allReviews.length
        });

        res.status(201).json({
            success: true,
            data: review
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get reviews for a user
// @route   GET /api/reviews/user/:userId
// @access  Public
exports.getUserReviews = async (req, res) => {
    try {
        const { userId } = req.params;

        const reviews = await Review.find({ riderTo: userId })
            .populate('riderFrom', 'name profilePhoto')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get all reviews by a user
// @route   GET /api/reviews/by/:userId
// @access  Public
exports.getReviewsByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const reviews = await Review.find({ riderFrom: userId })
            .populate('riderTo', 'name profilePhoto')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
