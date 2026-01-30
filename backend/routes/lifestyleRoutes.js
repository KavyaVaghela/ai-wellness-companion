const express = require('express');
const router = express.Router();
const LifestyleLog = require('../models/LifestyleLog');
const { protect } = require('../middleware/authMiddleware');

// @desc    Log daily lifestyle data
// @route   POST /api/lifestyle
// @access  Private
router.post('/', protect, async (req, res) => {
    const { sleepHours, waterIntake, steps, mood, dietQuality } = req.body;

    try {
        const log = await LifestyleLog.create({
            user: req.user._id,
            sleepHours,
            waterIntake,
            steps,
            mood,
            dietQuality
        });
        res.status(201).json(log);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Get lifestyle history
// @route   GET /api/lifestyle
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const logs = await LifestyleLog.find({ user: req.user._id }).sort({ date: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const { getDashboardInsight } = require('../services/aiService');

// @desc    Get AI Dashboard Insight
// @route   GET /api/lifestyle/insight
// @access  Private
router.get('/insight', protect, async (req, res) => {
    try {
        // Fetch latest stats for the user
        const logs = await LifestyleLog.find({ user: req.user._id }).sort({ date: -1 }).limit(1);
        const latest = logs[0] || {};

        const insight = await getDashboardInsight({
            sleep: latest.sleepHours,
            water: latest.waterIntake,
            steps: latest.steps,
            mood: latest.mood
        });

        res.json({ insight });
    } catch (error) {
        res.status(500).json({ message: 'Failed to generate insight' });
    }
});

module.exports = router;
