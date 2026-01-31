import { useContext, useEffect, useState, useRef } from 'react';
import AuthContext from '../context/AuthContext';
import { Activity, Moon, Droplets, Smile, ArrowRight, Heart, AlertOctagon, Clipboard, Bell, User, Zap, Shield, Sun, Sparkles, X, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';
import BoatWatchCard from '../components/BoatWatchCard';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return <div className="flex h-screen items-center justify-center text-xl font-bold text-gray-500">Loading your profile...</div>;
    }

    const [stats, setStats] = useState({
        sleep: 0,
        water: 0,
        steps: 0,
        mood: 'Neutral'
    });
    const [insight, setInsight] = useState("Analyzing your health trends...");
    const [nextReminder, setNextReminder] = useState(null);
    const [emergencyLoading, setEmergencyLoading] = useState(false);
    const [comfortMode, setComfortMode] = useState(false);

    // SOS Modal State
    const [showSOSModal, setShowSOSModal] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const timerRef = useRef(null);

    // Heart Rate State
    const [heartRate, setHeartRate] = useState({ bpm: '--', status: 'Normal' });

    // Simulator Effect
    useEffect(() => {
        const interval = setInterval(() => {
            setHeartRate({ bpm: 72 + Math.floor(Math.random() * 5), status: 'Normal' });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const token = userInfo?.token;
                if (!token) return;

                const config = { headers: { Authorization: `Bearer ${token}` } };

                // 1. Fetch Lifestyle Stats
                const { data: lifestyleData } = await axios.get(`${API_URL}/api/lifestyle`, config);
                if (lifestyleData && lifestyleData.length > 0) {
                    const latest = lifestyleData[0];
                    setStats({
                        sleep: latest.sleepHours || 0,
                        water: latest.waterIntake || 0,
                        steps: latest.steps || 0,
                        mood: latest.mood || 'Neutral'
                    });
                }

                // 2. Fetch AI Insight
                const { data: insightData } = await axios.get(`${API_URL}/api/lifestyle/insight`, config);
                if (insightData.insight) setInsight(insightData.insight);

                // 3. Fetch Reminders 
                const { data: remindersData } = await axios.get(`${API_URL}/api/reminders`, config);
                if (remindersData.length > 0) {
                    setNextReminder(remindersData[0]);
                }

            } catch (error) {
                console.error("Dashboard Data Error:", error);
            }
        };
        fetchData();
    }, []);

    /* --- SOS LOGIC START --- */
    const handleSOSClick = () => {
        setShowSOSModal(true);
        setCountdown(5);
    };

    const cancelSOS = () => {
        setShowSOSModal(false);
        setCountdown(5);
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const confirmSOS = async () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setEmergencyLoading(true);

        // Get Location
        if (!navigator.geolocation) {
            sendSOSRequest({ lat: 0, lng: 0 }); // Fallback
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                sendSOSRequest({ lat: latitude, lng: longitude });
            },
            (error) => {
                console.error("Location Error:", error);
                sendSOSRequest({ lat: 0, lng: 0 }); // Send anyway without precise location
            }
        );
    };

    const sendSOSRequest = async (location) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const { data } = await axios.post(`${API_URL}/api/auth/emergency-alert`, {
                userId: user._id,
                type: "SOS_BUTTON",
                location
            }, { headers: { Authorization: `Bearer ${userInfo?.token}` } });

            alert(`🚨 ${data.message}`); // Replace with nicer UI feedback in future
            setShowSOSModal(false);
        } catch (error) {
            console.error(error);
            alert("Failed to send alert. Please call emergency services directly.");
        }
        setEmergencyLoading(false);
    };

    // Countdown Effect
    useEffect(() => {
        if (showSOSModal && countdown > 0) {
            timerRef.current = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else if (countdown === 0 && showSOSModal) {
            // Auto-trigger if countdown ends? Or just stay at 0 waiting for confirm?
            // Usually SOS apps auto-trigger at 0. Let's auto-trigger.
            confirmSOS();
        }
        return () => clearInterval(timerRef.current);
    }, [showSOSModal, countdown]);
    /* --- SOS LOGIC END --- */

    const getStatusColor = (val, type) => {
        if (type === 'sleep') return val < 6 ? 'text-red-500' : 'text-gray-800';
        if (type === 'water') return val < 2 ? 'text-orange-500' : 'text-gray-800';
        return 'text-gray-800';
    };

    const getStatusLabel = (val, type) => {
        if (type === 'sleep') return val < 6 ? 'Needs Attention' : 'Good';
        if (type === 'water') return val < 2 ? 'Low' : 'Hydrated';
        if (type === 'steps') return val < 5000 ? 'Sedentary' : 'Active';
        return 'Stable';
    };

    const bgTheme = comfortMode ? 'bg-[#f4f9f4]' : 'bg-gray-50';
    const cardTheme = comfortMode ? 'bg-[#eaf4ea] border-none shadow-sm' : 'bg-white shadow-sm border border-gray-100';

    return (
        <div className={`space-y-6 transition-colors duration-500 animate-fadeIn ${bgTheme} min-h-screen p-4 rounded-3xl relative`}>

            {/* 1. Greeting & Context */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">👋 Hello, {user?.name?.split(' ')[0] || 'User'}</h1>
                    <p className="text-gray-500 mt-1">Here’s your health snapshot for today</p>
                </div>
                <button
                    onClick={() => setComfortMode(!comfortMode)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition ${comfortMode ? 'bg-teal-200 text-teal-800' : 'bg-white border text-gray-600'}`}
                >
                    {comfortMode ? <Sun size={16} /> : <Moon size={16} />}
                    {comfortMode ? 'Standard Mode' : 'Comfort Mode'}
                </button>
            </div>

            {/* 2. Emergency Status Banner */}
            <div className={`w-full p-4 rounded-xl flex items-center justify-center gap-3 transition-colors duration-500 ${heartRate.status === 'Alert' ? 'bg-red-50 text-red-700 animate-pulse border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                <div className={`w-3 h-3 rounded-full ${heartRate.status === 'Alert' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                <span className="font-semibold">
                    {heartRate.status === 'Alert' ? "🚨 Abnormal vitals detected. Emergency contact has been notified." : "🟢 All vitals are stable. We’re monitoring continuously."}
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Hero & Insight */}
                <div className="space-y-6 lg:col-span-2">

                    {/* 3. Live Heart Rate Hero */}
                    <div className={`${cardTheme} p-8 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 transition-all hover:shadow-md`}>
                        <div className="flex flex-col gap-2 z-10">
                            <h2 className="text-gray-500 font-medium flex items-center gap-2">
                                <Heart className="text-rose-500 animate-pulse" size={20} /> Live Heart Rate
                            </h2>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-6xl font-black tracking-tighter ${heartRate.status === 'Alert' ? 'text-red-500' : 'text-gray-900'}`}>{heartRate.bpm}</span>
                                <span className="text-lg text-gray-400 font-medium">BPM</span>
                            </div>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold w-max ${heartRate.status === 'Alert' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'}`}>
                                {heartRate.status}
                            </span>
                            <p className="text-sm text-gray-400 mt-2">Your heart is working hard for you.</p>
                        </div>

                        {/* Interactive Visual */}
                        <div className="relative w-40 h-40 flex items-center justify-center">
                            <div className={`absolute inset-0 bg-rose-500 rounded-full opacity-10 animate-ping`} style={{ animationDuration: `${60 / (heartRate.bpm === '--' ? 60 : heartRate.bpm)}s` }}></div>
                            <div className={`absolute inset-4 bg-rose-500 rounded-full opacity-20 animate-pulse`} style={{ animationDuration: `${60 / (heartRate.bpm === '--' ? 60 : heartRate.bpm)}s` }}></div>
                            <Heart size={60} className="text-rose-500 relative z-10" fill="currentColor" />
                        </div>
                        <span className="absolute bottom-4 right-6 text-xs text-gray-300">Last updated: just now</span>
                    </div>

                    {/* NEW: boAt Watch Integration Card */}
                    <BoatWatchCard />

                    {/* 4. AI Health Insight */}
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10"><Zap size={100} /></div>
                        <h3 className="font-bold text-indigo-100 mb-2 flex items-center gap-2">
                            <Sparkles size={18} /> AI Health Insight
                        </h3>
                        <p className="text-xl font-medium leading-relaxed relative z-10">"{insight}"</p>
                    </div>

                    {/* 5. Health Snapshot Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Sleep', icon: Moon, val: stats.sleep + 'h', type: 'sleep', sub: getStatusLabel(stats.sleep, 'sleep'), color: 'text-indigo-500', bg: 'bg-indigo-50' },
                            { label: 'Water', icon: Droplets, val: stats.water + 'L', type: 'water', sub: getStatusLabel(stats.water, 'water'), color: 'text-blue-500', bg: 'bg-blue-50' },
                            { label: 'Steps', icon: Activity, val: stats.steps, type: 'steps', sub: getStatusLabel(stats.steps, 'steps'), color: 'text-emerald-500', bg: 'bg-emerald-50' },
                            { label: 'Stress', icon: Smile, val: stats.mood, type: 'stress', sub: 'Moderate', color: 'text-yellow-500', bg: 'bg-yellow-50' },
                        ].map((item, idx) => (
                            <Link to="/tracker" key={idx} className={`${cardTheme} p-4 rounded-2xl flex flex-col items-center text-center gap-2 hover:scale-105 transition`}>
                                <div className={`p-2 rounded-full ${item.bg} ${item.color}`}>
                                    <item.icon size={20} />
                                </div>
                                <div>
                                    <p className={`text-xl font-bold ${getStatusColor(parseFloat(item.val), item.type)}`}>{item.val}</p>
                                    <p className="text-xs text-gray-500 font-medium">{item.label}</p>
                                    <p className={`text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full ${item.sub === 'Good' || item.sub === 'Hydrated' || item.sub === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'}`}>{item.sub}</p>
                                </div>
                            </Link>
                        ))}
                    </div>

                </div>

                {/* Right Column: Interaction & Tools */}
                <div className="space-y-6">

                    {/* 6. Mood Check */}
                    <div className={`${cardTheme} p-6 rounded-3xl`}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-700">🙂 Mood Check</h3>
                        </div>
                        <div className="flex justify-between gap-2 mb-4">
                            {['Happy', 'Neutral', 'Stressed'].map((m) => (
                                <button key={m} onClick={() => setStats({ ...stats, mood: m })} className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${stats.mood === m ? 'bg-teal-100 text-teal-700 ring-2 ring-teal-500' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                                    {m}
                                </button>
                            ))}
                        </div>
                        <div className="bg-orange-50 p-3 rounded-xl text-xs text-orange-700 flex gap-2">
                            <Sun size={14} className="shrink-0 mt-0.5" />
                            <p>Small walks can help maintain a positive mood.</p>
                        </div>
                    </div>

                    {/* 7. Active Reminder Preview */}
                    <div className={`${cardTheme} p-6 rounded-3xl border-l-4 border-l-blue-500`}>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Bell size={12} /> Next Reminder
                        </h3>
                        {nextReminder ? (
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-bold text-gray-800">{nextReminder.type}</p>
                                    <p className="text-sm text-gray-500">at {nextReminder.time}</p>
                                </div>
                                <button className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-bold hover:bg-blue-200">Done</button>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic">No upcoming reminders.</p>
                        )}
                    </div>

                    {/* 8. Symptom Checker CTA */}
                    <Link to="/symptom-checker" className="block bg-teal-800 rounded-3xl p-6 text-white shadow-lg items-center relative overflow-hidden group hover:shadow-xl transition">
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold mb-1">🤒 Feeling unwell?</h3>
                            <p className="text-teal-200 text-sm mb-4">Check symptoms with AI-powered guidance</p>
                            <span className="inline-flex items-center gap-2 text-xs font-bold bg-white/20 px-3 py-1 rounded-full">Start Check <ArrowRight size={12} /></span>
                        </div>
                        <Activity className="absolute -right-6 -bottom-6 text-teal-700 opacity-50 group-hover:scale-110 transition" size={120} />
                    </Link>

                    {/* 9. Safety Score */}
                    <div className={`${cardTheme} p-4 rounded-2xl flex items-center gap-4`}>
                        <div className="bg-green-100 p-2 rounded-full text-green-600">
                            <Shield size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Safety Confidence</p>
                            <p className="text-lg font-bold text-gray-800">Safe (92%)</p>
                        </div>
                    </div>

                    {/* 10. Emergency Button (Compact) */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSOSClick}
                        className="w-full bg-red-50 text-red-600 py-4 rounded-2xl text-base font-bold hover:bg-red-100 transition flex items-center justify-center gap-2 border-2 border-red-100"
                    >
                        <AlertOctagon size={20} /> Trigger SOS
                    </motion.button>

                </div>
            </div>

            {/* ERROR / SOS MODAL */}
            <AnimatePresence>
                {showSOSModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center relative overflow-hidden"
                        >
                            <div className="absolute inset-x-0 top-0 h-2 bg-red-500 animate-progress" style={{ width: `${(countdown / 5) * 100}%`, transition: 'width 1s linear' }}></div>

                            <button onClick={cancelSOS} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>

                            <div className="mx-auto w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                <AlertOctagon size={40} />
                            </div>

                            <h2 className="text-2xl font-black text-gray-900 mb-2">SOS ALERT</h2>
                            <p className="text-gray-500 mb-6">
                                Sending emergency alert to your contacts and sharing your live location in <span className="font-bold text-red-600 text-xl">{countdown}s</span>...
                            </p>

                            <div className="space-y-3">
                                <button
                                    onClick={confirmSOS}
                                    disabled={emergencyLoading}
                                    className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 shadow-xl shadow-red-200 transition flex items-center justify-center gap-2"
                                >
                                    {emergencyLoading ? 'Sending Alert...' : 'SEND NOW'}
                                </button>
                                <button
                                    onClick={cancelSOS}
                                    className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                            </div>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
