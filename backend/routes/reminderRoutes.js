const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all reminders for user
// @route   GET /api/reminders
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const reminders = await Reminder.find({ user: req.user._id }).sort({ time: 1 });
        res.json(reminders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a reminder
// @route   POST /api/reminders
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const reminder = await Reminder.create({
            user: req.user._id,
            ...req.body
        });
        res.status(201).json(reminder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete a reminder
// @route   DELETE /api/reminders/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const reminder = await Reminder.findById(req.params.id);

        if (!reminder) {
            return res.status(404).json({ message: 'Reminder not found' });
        }

        if (reminder.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await reminder.deleteOne();
        res.json({ message: 'Reminder removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
