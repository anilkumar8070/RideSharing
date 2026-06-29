const User = require('../models/User');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, phone, password, address } = req.body;

        // Ensure user provided at least email or phone
        if (!email && !phone) {
            return res.status(400).json({ success: false, error: 'Please provide either email or phone number' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            phone,
            password,
            address
        });

        sendTokenResponse(user, 201, res);
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { identifier, password } = req.body; // identifier can be email or phone

        // Validate email/phone & password
        if (!identifier || !password) {
            return res.status(400).json({ success: false, error: 'Please provide an email/phone and password' });
        }

        // Check for user
        const user = await User.findOne({ 
            $or: [{ email: identifier }, { phone: identifier }] 
        }).select('+password'); // We need the password to compare

        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// Helper: Get token from model, create response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone
        }
    });
};
