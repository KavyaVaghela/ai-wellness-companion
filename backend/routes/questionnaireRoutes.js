const express = require('express');
const router = express.Router();
const QuestionnaireResponse = require('../models/QuestionnaireResponse');
const { protect } = require('../middleware/authMiddleware');

// @desc    Submit questionnaire response
// @route   POST /api/questionnaire
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const response = await QuestionnaireResponse.create({
            user: req.user._id,
            ...req.body
        });
        res.status(201).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get user's latest response
// @route   GET /api/questionnaire
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const responses = await QuestionnaireResponse.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(responses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
