const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number },
    gender: { type: String },
    profession: { type: String },
    profilePic: { type: String, default: "" },
    isOnboardingComplete: { type: Boolean, default: true },
    questionnaireAnswers: { type: Object, default: {} },
    emergencyContact: {
        name: { type: String },
        email: { type: String },
        relationship: { type: String },
        phone: { type: String }
    },
    healthGoals: { type: String }, // e.g., "Lose weight", "Sleep better"
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
