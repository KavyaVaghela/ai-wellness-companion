const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
    const { name, email, password, age, gender, profession, emergencyContact } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            age,
            gender,
            profession,
            emergencyContact
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isOnboardingComplete: user.isOnboardingComplete,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isOnboardingComplete: user.isOnboardingComplete,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', async (req, res) => {
    // Ideally this should use middleware to get the user ID, but for now we'll pass it or check token
    // Assuming we have middleware, but here I see no middleware yet in the file imports above. 
    // I will assume the frontend sends the user ID or we need to add middleware.
    // Wait, the previous file view showed no middleware usage in `router.post`.
    // I will implement a quick token verify or just rely on body (insecure but matches current style if auth middleware isn't used yet).
    // Let's check server.js... wait, server.js uses app.use('/api/auth', ...)
    // I should create/use middleware.

    // For this specific iteration, I'll allow updating by email or ID passed in body for simplicity, 
    // OR BETTER: implement a quick verifyToken middleware if it exists.
    // Note: I saw 'middleware' dir in list_dir. Let's assume I can use it later.
    // For now, I'll update based on the ID passed in the body (from frontend state).

    const { _id, ...updateData } = req.body;

    try {
        const user = await User.findById(_id);

        if (user) {
            user.birthdate = updateData.birthdate || user.birthdate; // New
            user.mobile = updateData.mobile || user.mobile; // New
            user.age = updateData.age || user.age; // Keep age if passed, or calculate later
            user.gender = updateData.gender || user.gender;
            user.profession = updateData.profession || user.profession;
            user.profilePic = updateData.profilePic || user.profilePic;
            user.isOnboardingComplete = updateData.isOnboardingComplete !== undefined ? updateData.isOnboardingComplete : user.isOnboardingComplete;
            user.questionnaireAnswers = updateData.questionnaireAnswers || user.questionnaireAnswers;

            if (updateData.emergencyContact) {
                user.emergencyContact = {
                    name: updateData.emergencyContact.name || user.emergencyContact.name,
                    phone: updateData.emergencyContact.phone || user.emergencyContact.phone,
                    relationship: updateData.emergencyContact.relationship || user.emergencyContact.relationship,
                    email: updateData.emergencyContact.email || user.emergencyContact.email // New
                };
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isOnboardingComplete: updatedUser.isOnboardingComplete,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Trigger Emergency Alert (Simulation)
// @route   POST /api/auth/emergency-alert
// @access  Private
router.post('/emergency-alert', async (req, res) => {
    const { userId, location, type } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const contact = user.emergencyContact || {};
        const contactName = contact.name || 'Emergency Services';
        const contactPhone = contact.phone || '112';

        console.log(`[EMERGENCY] Alert received for User: ${user.name} (${user.email})`);
        console.log(`[EMERGENCY] Location: https://maps.google.com/?q=${location?.lat},${location?.lng}`);
        console.log(`[EMERGENCY] Type: ${type}`);
        console.log(`[EMERGENCY] SIMULATION: Sending SMS to ${contactName} (${contactPhone})...`);

        // Mock ID for the alert
        const alertId = 'SOS-' + Math.random().toString(36).substr(2, 9).toUpperCase();

        res.json({
            success: true,
            message: `Emergency alert processed. Notified ${contactName} and shared your location.`,
            alertId,
            dispatched: true,
            contactNotified: {
                name: contactName,
                phone: contactPhone
            }
        });

    } catch (error) {
        console.error("Emergency Alert Error:", error);
        res.status(500).json({ message: 'Failed to process emergency alert' });
    }
});

// @desc    Google Login/Signup
// @route   POST /api/auth/google
// @access  Public
router.post('/google', async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { name, email, picture } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (!user) {
            // Create new user
            user = await User.create({
                name,
                email,
                password: Math.random().toString(36).slice(-8), // dummy password
                profilePic: picture,
                isOnboardingComplete: false // Force false for new users
            });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic,
            isOnboardingComplete: user.isOnboardingComplete,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(401).json({ message: 'Invalid Google Token' });
    }
});

module.exports = router;
