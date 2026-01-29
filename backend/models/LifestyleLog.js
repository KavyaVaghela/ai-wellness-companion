const mongoose = require('mongoose');

const lifestyleSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    sleepHours: { type: Number },
    waterIntake: { type: Number, required: true }, // in Liters
    steps: { type: Number, default: 0 },
    mood: { type: String, enum: ['Happy', 'Neutral', 'Stressed', 'Sad'], default: 'Neutral' },
    screenTime: { type: Number, default: 0 }, // in Hours
    exercise: { type: Boolean, default: false }, // Yes/No
    dietQuality: { type: String, enum: ['Healthy', 'Mixed', 'Unhealthy'] },
}, { timestamps: true });

module.exports = mongoose.model('LifestyleLog', lifestyleSchema);
