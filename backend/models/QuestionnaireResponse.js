const mongoose = require('mongoose');

const questionnaireResponseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tirednessFrequency: { type: String }, // e.g., "Often", "Rarely"
    headacheDiscomfort: { type: String },
    sleepDuration: { type: String }, // e.g., "<6 hours", "6-8 hours"
    physicalActivity: { type: String },
    screenTime: { type: String },
    stressLevel: { type: String }, // "Low", "Medium", "High"
    discomfortSituations: { type: String },
    emergencyPreference: { type: String }, // "Call Family", "Call Ambulance"
    doctorConsultationStatus: { type: String }, // "Yes", "No"
    wellnessSelfAssessment: { type: String }, // "Good", "Fair", "Poor"
}, { timestamps: true });

module.exports = mongoose.model('QuestionnaireResponse', questionnaireResponseSchema);
