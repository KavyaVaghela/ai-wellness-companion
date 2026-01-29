const mongoose = require('mongoose');

const heartRateLogSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bpm: { type: Number, required: true },
    status: { type: String, enum: ['Normal', 'Alert'], default: 'Normal' },
    source: { type: String, default: 'Simulation' }, // 'Hardware' or 'Simulation'
}, { timestamps: true });

module.exports = mongoose.model('HeartRateLog', heartRateLogSchema);
