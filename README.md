# AI Wellness Companion - Healthcare & Wellness Tech Demo

A Hackathon-ready full-stack AI Wellness application built for the IBM SkillsBuild AI Innovation Challenge 2026.

## Theme: Healthcare & Wellness Tech

### Features
- **User Authentication**: Secure Login/Signup with JWT.
- **AI Symptom Checker**: Analyze symptoms and get verified guidance (Mock AI integrated).
- **Lifestyle Tracker**: Log sleep, water, steps, and mood patterns.
- **AI Chatbot**: Intelligent health assistant widget.
- **Community Trends**: View anonymous health trends in your area.
- **Emergency Help**: Quick access to ambulance and nearby hospitals.

### Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)

### Prerequisites
- Node.js (v14+)
- MongoDB (Running locally on port 27017)

### Setup Instructions

1. **Clone & Install Dependencies**
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

2. **Environment Variables**
   The `backend/.env` is pre-configured for local development.
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/ai-wellness
   JWT_SECRET=supersecretkeyhackathon2026
   ```

3. **Seed Database (Optional)**
   Run this to create a demo user (`demo@example.com` / `password123`).
   ```bash
   cd backend
   node seeder.js
   ```

4. **Run Application**
   Open two terminals:

   **Terminal 1 (Backend):**
   ```bash
   cd backend
   node server.js
   ```

   **Terminal 2 (Frontend):**
   ```bash
   cd frontend
   npm run dev
   ```

5. **Access Application**
   Open [http://localhost:5173](http://localhost:5173) in your browser.

### Hackathon Usage
- The AI responses are currently mocked for specific keywords (e.g., "headache", "fever") to ensure reliable demo behavior without API keys.
- To enable real AI, uncomment the OpenAI integration in `backend/routes/symptomRoutes.js` and add `OPENAI_API_KEY` in `.env`.

### License
MIT
