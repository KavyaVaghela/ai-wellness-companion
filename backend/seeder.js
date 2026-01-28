const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const SymptomLog = require('./models/SymptomLog');
const LifestyleLog = require('./models/LifestyleLog');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const importData = async () => {
    try {
        await User.deleteMany();
        await SymptomLog.deleteMany();
        await LifestyleLog.deleteMany();

        const user = await User.create({
            name: 'Demo User',
            email: 'demo@example.com',
            password: 'password123', // Will be hashed by pre-save hook
            age: 28,
            gender: 'Female',
            healthGoals: 'Improve sleep quality'
        });

        console.log('User Created');

        await SymptomLog.create({
            user: user._id,
            symptoms: ['Headache', 'Mild Fever'],
            severity: 'Low',
            aiAdvice: 'Stay hydrated and rest. Take paracetamol if fever increases.',
        });

        console.log('Symptom Log Created');

        await LifestyleLog.create({
            user: user._id,
            sleepHours: 7,
            waterIntake: 2.0,
            steps: 5000,
            mood: 'Happy',
            dietQuality: 'Healthy'
        });

        console.log('Lifestyle Log Created');

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
