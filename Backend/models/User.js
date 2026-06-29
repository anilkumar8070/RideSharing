const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    email: {
        type: String,
        unique: true,
        sparse: true, // Allows null/missing if only phone is provided
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    phone: {
        type: String,
        unique: true,
        sparse: true // Allows null/missing if only email is provided
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false // Do not return password in queries by default
    },
    // We will use MongoDB GeoJSON for geospatial queries later
    currentLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            index: '2dsphere'
        }
    },
    destination: {
        type: String
    },
    // For Trust / Safety feature
    isPhoneVerified: {
        type: Boolean,
        default: false
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    rideCount: {
        type: Number,
        default: 0
    },
    // Trust & Safety Features
    averageRating: {
        type: Number,
        default: 5.0,
        min: 1,
        max: 5
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    completedRides: {
        type: Number,
        default: 0
    },
    cancelledRides: {
        type: Number,
        default: 0
    },
    blockedUsers: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    // Preferences
    preferences: {
        smoking: {
            type: String,
            enum: ['smoker', 'non-smoker', 'no-preference'],
            default: 'no-preference'
        },
        conversation: {
            type: String,
            enum: ['quiet', 'chatty', 'no-preference'],
            default: 'no-preference'
        },
        music: {
            type: String,
            enum: ['yes', 'no', 'no-preference'],
            default: 'no-preference'
        },
        genderPreference: {
            type: String,
            enum: ['male', 'female', 'any'],
            default: 'any'
        },
        petFriendly: {
            type: Boolean,
            default: false
        }
    },
    // Saved Locations
    savedLocations: [{
        label: String,
        name: String,
        coordinates: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: [Number]
        }
    }],
    // Gamification
    loyaltyPoints: {
        type: Number,
        default: 0
    },
    referralCode: {
        type: String,
        unique: true,
        sparse: true
    },
    referredBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    badges: [{
        name: String,
        icon: String,
        unlockedAt: Date
    }],
    // Profile
    profilePhoto: String,
    bio: String,
    gender: {
        type: String,
        enum: ['male', 'female', 'other', 'prefer-not-to-say']
    },
    // Emergency Contacts
    emergencyContacts: [{
        name: String,
        phone: String,
        relation: String
    }],
    // Account Settings
    notificationSettings: {
        matchNotifications: {
            type: Boolean,
            default: true
        },
        emailNotifications: {
            type: Boolean,
            default: true
        },
        pushNotifications: {
            type: Boolean,
            default: true
        }
    },
    // Documents (for future verification)
    documents: [{
        type: String,
        documentType: String,
        uploadedAt: Date
    }]
}, { timestamps: true });

// Encrypt password using bcrypt before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return it
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
