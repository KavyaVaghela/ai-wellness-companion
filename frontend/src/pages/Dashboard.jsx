import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { Activity, Moon, Droplets, Smile, ArrowRight, Heart, AlertOctagon, Clipboard, Bell, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';
import { heartRateSimulator } from '../services/HeartRateSimulator';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        sleep: 0,
        water: 0,
        steps: 0,
        mood: 'Neutral'
    });
    const [emergenyLoading, setEmergencyLoading] = useState(false);

    // Heart Rate State
    const [heartRate, setHeartRate] = useState({ bpm: '--', status: 'Normal' });

    // Simulator Effect
    useEffect(() => {
        heartRateSimulator.start();
        const unsubscribe = heartRateSimulator.subscribe((data) => {
            setHeartRate({ bpm: data.bpm, status: data.status });
        });
        return () => {
            unsubscribe();
            heartRateSimulator.stop();
        };
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const token = userInfo?.token;

                if (!token) {
                    console.error("No authentication token found.");
                    return;
                }

                const { data } = await axios.get(`${API_URL}/api/lifestyle`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (data && data.length > 0) {
                    const latest = data[0];
                    setStats({
                        sleep: latest.sleepHours || 0,
                        water: latest.waterIntake || 0,
                        steps: latest.steps || 0,
                        mood: latest.mood || 'Neutral'
                    });
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };
        fetchStats();
    }, []);

    const handleEmergency = async () => {
        if (!window.confirm("Are you sure you want to trigger an EMERGENCY ALERT? This will notify your emergency contact and emergency services.")) return;

        setEmergencyLoading(true);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            await axios.post(`${API_URL}/api/auth/emergency-alert`, {
                userId: user._id,
                type: "SOS_BUTTON",
                location: { lat: 0, lng: 0 } // Mock location
            }, {
                headers: { Authorization: `Bearer ${userInfo?.token}` }
            });
            alert("Emergency Alert Sent! Help is on the way.");
        } catch (error) {
            alert("Failed to send alert.");
        }
        setEmergencyLoading(false);
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header & Profile */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-gradient-to-r from-teal-50 to-white p-6 rounded-3xl border border-teal-100">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-teal-500 shadow-md">
                        {user?.profilePic ? (
                            <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-teal-100 flex items-center justify-center text-teal-700">
                                <User size={32} />
                            </div>
                        )}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Hello, {user?.name.split(' ')[0]}! 👋</h1>
                        <p className="text-gray-500">
                            {user?.profession ? `${user.profession} • ` : ''}
                            {user?.age ? `${user.age} yrs` : ''}
                            {user?.mobile ? ` • ${user.mobile}` : ''}
                        </p>
                        {user?.emergencyContact && (
                            <p className="text-xs text-red-500 font-medium mt-1 flex items-center gap-1">
                                <AlertOctagon size={12} />
                                Emergency: {user.emergencyContact.name} ({user.emergencyContact.phone})
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex gap-3">
                    <Link to="/onboarding" className="bg-white text-gray-600 px-5 py-2 rounded-full font-semibold shadow-sm border border-gray-200 hover:bg-gray-50 transition flex items-center gap-2">
                        <User size={18} /> My Profile
                    </Link>
                    <button
                        onClick={handleEmergency}
                        disabled={emergenyLoading}
                        className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:bg-red-600 transition animate-pulse flex items-center gap-2"
                    >
                        <AlertOctagon size={18} /> {emergenyLoading ? 'Sending...' : 'SOS Emergency'}
                    </button>
                </div>
            </div>

            {/* Live Heart Rate Monitor */}
            <div className={`p-6 rounded-2xl shadow-lg border-2 transition-all duration-500 ${heartRate.status === 'Alert' ? 'bg-red-50 border-red-500' : 'bg-white border-transparent'}`}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                        <Activity className={heartRate.status === 'Alert' ? 'text-red-500 animate-pulse' : 'text-teal-600'} />
                        Live Heart Rate
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${heartRate.status === 'Alert' ? 'bg-red-100 text-red-600 animate-bounce' : 'bg-teal-100 text-teal-700'}`}>
                        {heartRate.status}
                    </span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <Heart
                            size={64}
                            className={`transition-all duration-300 ${heartRate.status === 'Alert' ? 'text-red-500 fill-red-500 animate-ping' : 'text-rose-500 fill-rose-500 animate-pulse'}`}
                            style={{ animationDuration: `${60 / heartRate.bpm}s` }}
                        />
                    </div>
                    <div>
                        <p className="text-5xl font-black text-gray-900">{heartRate.bpm}</p>
                        <p className="text-gray-500 text-sm">Beats Per Minute</p>
                    </div>
                    {heartRate.status === 'Alert' && (
                        <div className="ml-auto text-right">
                            <p className="text-red-600 font-bold flex items-center gap-1">
                                <AlertOctagon size={16} /> EMERGENCY ALERT
                            </p>
                            <p className="text-xs text-red-400">Notifying {user?.emergencyContact?.name || 'Emergency Services'}...</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                        <Moon size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Sleep</p>
                        <p className="text-xl font-bold text-gray-800">{stats.sleep}h</p>
                    </div>
                </div>
                <div className="bg-blue-50 p-6 rounded-2xl shadow-sm border border-blue-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-200 text-blue-700 rounded-xl">
                        <Droplets size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Water</p>
                        <p className="text-xl font-bold text-gray-800">{stats.water} L</p>
                    </div>
                </div>
                <div className="bg-green-50 p-6 rounded-2xl shadow-sm border border-green-100 flex items-center gap-4">
                    <div className="p-3 bg-green-200 text-green-700 rounded-xl">
                        <Activity size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Steps</p>
                        <p className="text-xl font-bold text-gray-800">{stats.steps}</p>
                    </div>
                </div>
                <div className="bg-yellow-50 p-6 rounded-2xl shadow-sm border border-yellow-100 flex items-center gap-4">
                    <div className="p-3 bg-yellow-200 text-yellow-700 rounded-xl">
                        <Smile size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Mood</p>
                        <p className="text-xl font-bold text-gray-800">{stats.mood}</p>
                    </div>
                </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link to="/symptom-checker" className="col-span-1 bg-teal-600 rounded-2xl p-6 text-white shadow-lg hover:bg-teal-700 transition relative overflow-hidden group">
                    <h3 className="text-xl font-bold mb-1">Symptom Checker</h3>
                    <p className="text-teal-100 text-sm mb-4">AI-powered health guidance</p>
                    <ArrowRight className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0" />
                    <Activity className="absolute -right-4 -bottom-4 opacity-10" size={100} />
                </Link>

                <Link to="/onboarding" className="col-span-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:border-teal-300 transition group">
                    <div className="bg-indigo-100 w-12 h-12 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
                        <Clipboard size={24} />
                    </div>
                    <h3 className="font-bold text-gray-800">Update Profile</h3>
                    <p className="text-gray-500 text-sm">Refresh your details</p>
                </Link>

                <Link to="/reminders" className="col-span-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:border-teal-300 transition group">
                    <div className="bg-orange-100 w-12 h-12 rounded-xl flex items-center justify-center text-orange-600 mb-4">
                        <Bell size={24} />
                    </div>
                    <h3 className="font-bold text-gray-800">Reminders</h3>
                    <p className="text-gray-500 text-sm">Meds & Habits</p>
                </Link>

                <Link to="/tracker" className="col-span-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:border-teal-300 transition group">
                    <div className="bg-gray-100 w-12 h-12 rounded-xl flex items-center justify-center text-gray-600 mb-4">
                        <Activity size={24} />
                    </div>
                    <h3 className="font-bold text-gray-800">Log Habits</h3>
                    <p className="text-gray-500 text-sm">Sleep, Water, Steps</p>
                </Link>
            </div>

            {/* Recommendations - Personalized */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Personalized Recommendations</h3>
                <div className="space-y-3">
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                            <Droplets size={20} />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800">Hydration</p>
                            <p className="text-sm text-gray-500 text-sm">Given your high activity level ({user?.questionnaireAnswers?.activity || 'Unknown'}), aim for 3L of water today.</p>
                        </div>
                    </div>
                    {user?.questionnaireAnswers?.stress === 'High' && (
                        <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl">
                            <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
                                <Smile size={20} />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">Stress Relief</p>
                                <p className="text-sm text-gray-500 text-sm">You reported high stress. Try a 5-minute breathing exercise.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
