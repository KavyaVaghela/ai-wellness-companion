const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

// Explicit CORS Configuration
app.use(cors({
    origin: [
        "https://ai-wellness-companion-rwzv.vercel.app", // Your Vercel Frontend
        "http://localhost:5173", // Localhost (Vite)
        "http://localhost:5000"  // Localhost (Backend)
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
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

app.get('/', (req, res) => {
    res.send('AI Wellness Companion API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
