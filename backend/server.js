const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Explicit CORS Configuration
// Explicit CORS Configuration
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5000",
        "https://ai-wellness-companion-tj7c.vercel.app",
        "https://ai-wellness-companion.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Debug Logging Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/symptoms', require('./routes/symptomRoutes'));
app.use('/api/lifestyle', require('./routes/lifestyleRoutes'));
app.use('/api/questionnaire', require('./routes/questionnaireRoutes'));
app.use('/api/reminders', require('./routes/reminderRoutes'));
app.use('/api/trends', require('./routes/trendsRoutes'));
app.use('/api/trends', require('./routes/trendsRoutes'));
app.use('/api/chat', require('./routes/chatRoutes')); // New Chat Route
app.use('/api/googlefit', require('./routes/googleFitRoutes')); // New Smartwatch Route

// Cron Job: Auto-Sync Smartwatch Data every 15 minutes
const cron = require('node-cron');
const User = require('./models/User');
const { fetchFitnessData } = require('./services/googleFitService');
const SmartwatchVitals = require('./models/SmartwatchVitals');

cron.schedule('*/15 * * * *', async () => {
    console.log('Running Auto-Sync for Smartwatch Vitals...');
    try {
        const users = await User.find({ googleFitConnected: true });
        for (const user of users) {
            if (user.googleFitAccessToken) {
                try {
                    const data = await fetchFitnessData(user.googleFitAccessToken);
                    await SmartwatchVitals.create({ user: user._id, ...data });
                    console.log(`Synced for user: ${user.name}`);
                } catch (err) {
                    console.error(`Sync failed for ${user.name}:`, err.message);
                }
            }
        }
    } catch (error) {
        console.error("Cron Job Error:", error);
    }
});

app.get('/', (req, res) => {
    res.send('AI Wellness Companion API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
