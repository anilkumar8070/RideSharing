const express = require('express');
const { 
    getMe,
    getUserProfile,
    updateProfile,
    updatePreferences,
    addSavedLocation,
    getSavedLocations,
    deleteSavedLocation,
    updateNotificationSettings,
    generateReferralCode,
    blockUser,
    unblockUser,
    getUserStats
} = require('../controllers/user.ctrl');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protected routes (require authentication)
router.get('/me', protect, getMe);
router.get('/me/stats', protect, getUserStats);
router.patch('/update', protect, updateProfile);
router.patch('/preferences', protect, updatePreferences);
router.post('/saved-locations', protect, addSavedLocation);
router.get('/saved-locations', protect, getSavedLocations);
router.delete('/saved-locations/:locationId', protect, deleteSavedLocation);
router.patch('/notification-settings', protect, updateNotificationSettings);
router.post('/generate-referral', protect, generateReferralCode);
router.post('/:userId/block', protect, blockUser);
router.delete('/:userId/unblock', protect, unblockUser);

// Public routes
router.get('/:id', getUserProfile);

module.exports = router;
