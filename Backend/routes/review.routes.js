const express = require('express');
const { 
    createReview, 
    getUserReviews, 
    getReviewsByUser 
} = require('../controllers/review.ctrl');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createReview);
router.get('/user/:userId', getUserReviews);
router.get('/by/:userId', getReviewsByUser);

module.exports = router;
