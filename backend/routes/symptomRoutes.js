const express = require('express');
const router = express.Router();
const SymptomLog = require('../models/SymptomLog');
const { protect } = require('../middleware/authMiddleware');

// Mock AI Logic for Demo
const getAIAdvice = (symptoms) => {
    const s = symptoms.map(sym => sym.toLowerCase());
    if (s.includes('headache') && s.includes('fever')) return "Possible Viral Fever. Rest, hydrate, and take Paracetamol if needed. Consult a doctor if fever persists > 3 days.";
    if (s.includes('chest pain')) return "Warning: Chest pain can be serious. Please visit a doctor immediately or call emergency services.";
    if (s.includes('stomach ache')) return "Could be indigestion or food poisoning. Avoid spicy food and stay hydrated.";
    return "Please monitor your symptoms. Maintain a healthy diet and sleep schedule. Consult a doctor if symptoms worsen.";
};

// @desc    Get community symptom trends (Public/Protected)
// @route   GET /api/symptoms/trends
// @access  Private (or Public if desired)
router.get('/trends', protect, async (req, res) => {
    try {
        const logs = await SymptomLog.find({});

        // Simple aggregation for demo
        const symptomCounts = {};
        logs.forEach(log => {
            log.symptoms.forEach(sym => {
                const s = sym.trim();
                symptomCounts[s] = (symptomCounts[s] || 0) + 1;
            });
        });

        // Convert to array and sort
        const topSymptoms = Object.entries(symptomCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Calculate percentages (demo logic)
        const total = logs.length || 1;
        const result = topSymptoms.map(item => ({
            name: item.name,
            percentage: Math.round((item.count / total) * 100)
        }));

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Log symptoms and get AI advice
// @route   POST /api/symptoms
// @access  Private
router.post('/', protect, async (req, res) => {
    const { symptoms, severity } = req.body; // symptoms is array of strings

    try {
        const advice = getAIAdvice(symptoms);

        const log = await SymptomLog.create({
            user: req.user._id,
            symptoms,
            severity,
            aiAdvice: advice,
        });

        res.status(201).json(log);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Get user symptom history
// @route   GET /api/symptoms
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const logs = await SymptomLog.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
