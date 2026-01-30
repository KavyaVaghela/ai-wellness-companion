const mongoose = require('mongoose');

const smartwatchVitalsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    provider: {
        type: String,
        default: 'boat-googlefit'
    },
    heartRate: { type: Number, default: 0 },
    steps: { type: Number, default: 0 },
    calories: { type: Number, default: 0 },
    sleepHours: { type: Number, default: 0 },
    lastSyncedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('SmartwatchVitals', smartwatchVitalsSchema);
