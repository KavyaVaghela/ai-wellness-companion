const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    birthdate: { type: Date }, // New: for age calculation
    mobile: { type: String }, // New: User mobile number
    gender: { type: String },
    profession: { type: String },
    profilePic: { type: String, default: "" },
    isOnboardingComplete: { type: Boolean, default: false }, // Default to false so they go through onboarding
    questionnaireAnswers: { type: Object, default: {} },
    emergencyContact: {
        name: { type: String },
        email: { type: String }, // New: Emergency contact email
        relationship: { type: String },
        phone: { type: String }
    },
    healthGoals: { type: String }, // e.g., "Lose weight", "Sleep better"
    // Smartwatch Integration
    googleFitConnected: { type: Boolean, default: false },
    googleFitAccessToken: { type: String },
    googleFitRefreshToken: { type: String },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
