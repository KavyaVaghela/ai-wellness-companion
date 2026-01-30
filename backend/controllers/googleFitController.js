const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const SmartwatchVitals = require('../models/SmartwatchVitals');
const { getAuthURL, getTokens, fetchFitnessData } = require('../services/googleFitService');

// @desc    Redirect to Google for OAuth
// @route   GET /api/googlefit/auth
// @access  Private
const authGoogleFit = asyncHandler(async (req, res) => {
    // Pass user ID as state so we know who to update in the callback
    const url = getAuthURL(req.user._id.toString());
    res.json({ url });
});

// @desc    Handle Google Fit Callback
// @route   GET /api/googlefit/callback
// @access  Public (Called by Google)
const googleFitCallback = asyncHandler(async (req, res) => {
    const { code, state } = req.query; // state is the userId

    if (!code || !state) {
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?error=auth_failed_missing_params`);
    }

    try {
        // 1. Exchange Code for Tokens
        const tokens = await getTokens(code);

        // 2. Find User by ID (from state)
        const user = await User.findById(state);

        if (!user) {
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?error=user_not_found`);
        }

        // 3. Save Tokens
        user.googleFitAccessToken = tokens.access_token;
        user.googleFitRefreshToken = tokens.refresh_token;
        user.googleFitConnected = true;
        await user.save();

        // 4. Redirect to Frontend with Success Flag
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?connected=true`);

    } catch (error) {
        console.error("Callback Error:", error);
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?error=auth_failed_exception`);
    }
});

// @desc    Connect Google Fit (Legacy/Manual - Not used in new flow but kept for safety)
// @route   POST /api/googlefit/connect
// @access  Private
const connectGoogleFit = asyncHandler(async (req, res) => {
    res.status(400).json({ message: "Use GET /auth flow" });
});


// @desc    Sync Data Manually
// @route   POST /api/googlefit/sync
// @access  Private
const syncData = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user.googleFitConnected || !user.googleFitAccessToken) {
        res.status(400);
        throw new Error('Google Fit not connected');
    }

    try {
        const data = await fetchFitnessData(user.googleFitAccessToken);

        // Save to DB
        const vitals = await SmartwatchVitals.create({
            user: user._id,
            ...data
        });

        res.json(vitals);
    } catch (error) {
        console.error("Sync Error", error);
        res.status(500).json({ message: 'Sync failed, try reconnecting' });
    }
});

// @desc    Get Stored Vitals
// @route   GET /api/googlefit/data
// @access  Private
const getStoredData = asyncHandler(async (req, res) => {
    const latest = await SmartwatchVitals.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(latest || {});
});

module.exports = { authGoogleFit, googleFitCallback, connectGoogleFit, syncData, getStoredData };
