import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import SymptomChecker from './pages/SymptomChecker';
import LifestyleTracker from './pages/LifestyleTracker';
import Trends from './pages/Trends';
import Emergency from './pages/Emergency';
import Landing from './pages/Landing';
import HealthQuestionnaire from './pages/HealthQuestionnaire';
import Reminders from './pages/Reminders';
import Onboarding from './pages/Onboarding';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_HERE";

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                <Route path="/onboarding" element={<PrivateRoute><Onboarding /></PrivateRoute>} />

                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/symptom-checker" element={<PrivateRoute><SymptomChecker /></PrivateRoute>} />
                <Route path="/tracker" element={<PrivateRoute><LifestyleTracker /></PrivateRoute>} />
                <Route path="/trends" element={<PrivateRoute><Trends /></PrivateRoute>} />
                <Route path="/questionnaire" element={<PrivateRoute><HealthQuestionnaire /></PrivateRoute>} />
                <Route path="/reminders" element={<PrivateRoute><Reminders /></PrivateRoute>} />
                <Route path="/emergency" element={<Emergency />} />
              </Routes>
            </div>
            <Chatbot />
          </div>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
