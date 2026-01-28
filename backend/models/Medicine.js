const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    dosage: { type: String },
    time: { type: String, required: true }, // e.g. "08:00 AM"
    active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Medicine', medicineSchema);
