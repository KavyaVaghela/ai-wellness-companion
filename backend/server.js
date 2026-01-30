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
    origin: "*", // Allow all origins for now to fix deployment issues
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

app.get('/', (req, res) => {
    res.send('AI Wellness Companion API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
