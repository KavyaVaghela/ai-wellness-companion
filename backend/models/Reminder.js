const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true }, // "Water", "Rest", "Exercise", "Follow-up"
    time: { type: String, required: true }, // "09:00"
    label: { type: String }, // Custom label e.g., "Drink 500ml"
    isCompleted: { type: Boolean, default: false },
    days: [{ type: String }], // ["Mon", "Tue"] etc.
}, { timestamps: true });

module.exports = mongoose.model('Reminder', reminderSchema);
