const express = require('express');
const router = express.Router();
const { getChatResponse } = require('../services/aiService');
const { protect } = require('../middleware/authMiddleware');

// @desc    Chat with AI
// @route   POST /api/chat
// @access  Private
router.post('/', protect, async (req, res) => {
    const { message, history } = req.body;

    if (!message) {
        return res.status(400).json({ message: 'Message is required' });
    }

    try {
        const reply = await getChatResponse(history, message);
        res.json({ reply });
    } catch (error) {
        res.status(500).json({ message: 'AI Service Error' });
    }
});

module.exports = router;
