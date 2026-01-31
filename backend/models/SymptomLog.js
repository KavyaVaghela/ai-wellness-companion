const mongoose = require('mongoose');

const symptomSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    symptoms: [{ type: String, required: true }],
    duration: { type: String },
    severity: { type: String, enum: ['Mild', 'Moderate', 'Severe'] },
    aiAdvice: { type: String }, // Response from AI
    notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('SymptomLog', symptomSchema);
