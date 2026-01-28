import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import SymptomChecker from './pages/SymptomChecker';
import LifestyleTracker from './pages/LifestyleTracker';
import Trends from './pages/Trends';
import Emergency from './pages/Emergency';
import Landing from './pages/Landing';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <div className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/symptom-checker" element={<PrivateRoute><SymptomChecker /></PrivateRoute>} />
              <Route path="/tracker" element={<PrivateRoute><LifestyleTracker /></PrivateRoute>} />
              <Route path="/trends" element={<PrivateRoute><Trends /></PrivateRoute>} />
              <Route path="/emergency" element={<Emergency />} />
            </Routes>
          </div>
          <Chatbot />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
