const User = require('../models/User');
const crypto = require('crypto');

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password')
            .populate('preferences');

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Public
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password -email -phone -address -emergencyContacts -documents');

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Update profile information
// @route   PATCH /api/users/update
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const { name, bio, gender, profilePhoto, emergencyContacts } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (bio) updateData.bio = bio;
        if (gender) updateData.gender = gender;
        if (profilePhoto) updateData.profilePhoto = profilePhoto;
        if (emergencyContacts) updateData.emergencyContacts = emergencyContacts;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Update user preferences
// @route   PATCH /api/users/preferences
// @access  Private
exports.updatePreferences = async (req, res) => {
    try {
        const { smoking, conversation, music, genderPreference, petFriendly } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                $set: {
                    'preferences.smoking': smoking || 'no-preference',
                    'preferences.conversation': conversation || 'no-preference',
                    'preferences.music': music || 'no-preference',
                    'preferences.genderPreference': genderPreference || 'any',
                    'preferences.petFriendly': petFriendly || false
                }
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Add saved location
// @route   POST /api/users/saved-locations
// @access  Private
exports.addSavedLocation = async (req, res) => {
    try {
        const { label, name, coordinates } = req.body;

        if (!label || !name || !coordinates) {
            return res.status(400).json({ success: false, error: 'Please provide all required fields' });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                $push: {
                    savedLocations: {
                        label,
                        name,
                        coordinates: {
                            type: 'Point',
                            coordinates: coordinates
                        }
                    }
                }
            },
            { new: true }
        );

        res.status(201).json({
            success: true,
            data: user.savedLocations
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get saved locations
// @route   GET /api/users/saved-locations
// @access  Private
exports.getSavedLocations = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user.savedLocations
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Delete saved location
// @route   DELETE /api/users/saved-locations/:locationId
// @access  Private
exports.deleteSavedLocation = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $pull: { savedLocations: { _id: req.params.locationId } } },
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: user.savedLocations
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Update notification settings
// @route   PATCH /api/users/notification-settings
// @access  Private
exports.updateNotificationSettings = async (req, res) => {
    try {
        const { matchNotifications, emailNotifications, pushNotifications } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                $set: {
                    'notificationSettings.matchNotifications': matchNotifications,
                    'notificationSettings.emailNotifications': emailNotifications,
                    'notificationSettings.pushNotifications': pushNotifications
                }
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: user.notificationSettings
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Generate referral code
// @route   POST /api/users/generate-referral
// @access  Private
exports.generateReferralCode = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user.referralCode) {
            return res.status(400).json({ success: false, error: 'You already have a referral code' });
        }

        const referralCode = crypto.randomBytes(6).toString('hex').toUpperCase();

        user.referralCode = referralCode;
        await user.save();

        res.status(200).json({
            success: true,
            referralCode: user.referralCode
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Block a user
// @route   POST /api/users/:userId/block
// @access  Private
exports.blockUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(req.user.id);

        if (user.blockedUsers.includes(userId)) {
            return res.status(400).json({ success: false, error: 'User already blocked' });
        }

        user.blockedUsers.push(userId);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'User blocked successfully'
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Unblock a user
// @route   DELETE /api/users/:userId/unblock
// @access  Private
exports.unblockUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(req.user.id);

        user.blockedUsers = user.blockedUsers.filter(id => id.toString() !== userId);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'User unblocked successfully'
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get user statistics
// @route   GET /api/users/me/stats
// @access  Private
exports.getUserStats = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        const stats = {
            completedRides: user.completedRides,
            cancelledRides: user.cancelledRides,
            totalRides: user.rideCount,
            averageRating: user.averageRating,
            totalRatings: user.totalRatings,
            loyaltyPoints: user.loyaltyPoints
        };

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
