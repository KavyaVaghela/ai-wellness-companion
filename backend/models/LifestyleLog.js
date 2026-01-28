const mongoose = require('mongoose');

const lifestyleSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    sleepHours: { type: Number },
    waterIntake: { type: Number }, // in liters or glasses
    steps: { type: Number },
    mood: { type: String, enum: ['Happy', 'Neutral', 'Stressed', 'Sad'] },
    dietQuality: { type: String, enum: ['Healthy', 'Mixed', 'Unhealthy'] },
}, { timestamps: true });

module.exports = mongoose.model('LifestyleLog', lifestyleSchema);
