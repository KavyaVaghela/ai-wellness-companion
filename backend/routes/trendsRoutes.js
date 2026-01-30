const express = require('express');
const router = express.Router();
const SymptomLog = require('../models/SymptomLog');
const LifestyleLog = require('../models/LifestyleLog');
const { protect } = require('../middleware/authMiddleware');
const { analyzeTrends } = require('../services/aiService');

// @desc    Get aggregated community trends
// @route   GET /api/trends/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
    try {
        // 1. Aggegrate Symptoms (Last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const symptomLogs = await SymptomLog.find({ createdAt: { $gte: sevenDaysAgo } });
        const symptomCounts = {};
        let totalSymptoms = 0;

        symptomLogs.forEach(log => {
            log.symptoms.forEach(sym => {
                const s = sym.trim();
                symptomCounts[s] = (symptomCounts[s] || 0) + 1;
                totalSymptoms++;
            });
        });

        const topSymptoms = Object.entries(symptomCounts)
            .map(([name, count]) => ({
                name,
                count,
                value: count, // for Recharts
                percentage: totalSymptoms > 0 ? Math.round((count / totalSymptoms) * 100) : 0
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5); // Top 5

        // 2. Aggregate Lifestyle (All time or last 30 days for better averages)
        const lifestyleLogs = await LifestyleLog.find({});

        let totalSleep = 0, totalWater = 0, totalSteps = 0, count = 0;
        const moodCounts = {};

        lifestyleLogs.forEach(log => {
            if (log.sleepHours) totalSleep += log.sleepHours;
            if (log.waterIntake) totalWater += log.waterIntake;
            if (log.steps) totalSteps += log.steps;
            if (log.mood) moodCounts[log.mood] = (moodCounts[log.mood] || 0) + 1;
            count++;
        });

        const averages = count > 0 ? {
            sleep: (totalSleep / count).toFixed(1),
            water: (totalWater / count).toFixed(1),
            steps: Math.round(totalSteps / count),
            totalLogs: count
        } : { sleep: 0, water: 0, steps: 0, totalLogs: 0 };

        // Determine dominant mood
        const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Neutral';

        // 3. Generate Alerts
        const alerts = [];
        if (topSymptoms.some(s => s.name.toLowerCase().includes('fever') && s.percentage > 20)) {
            alerts.push({ type: 'High', message: 'Viral Fever spike detected in community.', location: 'Global' });
        }
        if (averages.sleep < 6) {
            alerts.push({ type: 'Medium', message: 'Community Sleep Average is low (< 6h).', location: 'Global' });
        }
        // Mock regional alert for demo
        alerts.push({ type: 'Medium', message: 'Heatwave advisory. Stay hydrated.', location: 'Local Region' });


        // 4. Calculate Community Risk Level
        let riskLevel = 'Low';
        if (alerts.some(a => a.type === 'High')) {
            riskLevel = 'High';
        } else if (alerts.some(a => a.type === 'Medium') || averages.sleep < 6.5) {
            riskLevel = 'Moderate';
        }

        // 5. Generate AI Community Summary
        // We pass the aggregated stats to the AI
        const aiSummary = await analyzeTrends({
            topSymptoms: topSymptoms.map(s => s.name),
            averages,
            riskLevel,
            alerts: alerts.map(a => a.message)
        });

        res.json({
            symptoms: topSymptoms,
            lifestyle: { ...averages, dominantMood },
            alerts,
            riskLevel,
            aiSummary
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error fetching trends' });
    }
});

module.exports = router;
