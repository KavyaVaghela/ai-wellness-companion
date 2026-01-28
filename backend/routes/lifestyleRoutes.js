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

module.exports = router;
