import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { Activity, Moon, Droplets, Smile, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config'; // Assuming API_URL is defined in a config file

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        sleep: 0,
        water: 0,
        steps: 0,
        mood: 'Neutral'
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const token = userInfo?.token;

                if (!token) {
                    console.error("No authentication token found.");
                    return;
                }

                const { data } = await axios.get(`${API_URL} /api/lifestyle`, {
                    headers: { Authorization: `Bearer ${token} ` }
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

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Hello, {user?.name.split(' ')[0]}! 👋</h1>
                    <p className="text-gray-500 mt-1">Here's your daily health overview.</p>
                </div>
                <Link to="/emergency" className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:bg-red-600 transition animate-pulse">
                    Emergency Help
                </Link>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-2">Symptom Checker</h3>
                        <p className="text-teal-100 mb-6 max-w-sm">
                            Feeling unwell? Describe your symptoms and get instant AI-powered guidance.
                        </p>
                        <Link to="/symptom-checker" className="inline-flex items-center gap-2 bg-white text-teal-700 px-5 py-2 rounded-lg font-semibold hover:bg-teal-50 transition">
                            Check Symptoms <ArrowRight size={18} />
                        </Link>
                    </div>
                    <Activity className="absolute right-[-20px] bottom-[-20px] text-teal-400 opacity-20" size={140} />
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-2 text-gray-800">Lifestyle Tracker</h3>
                        <p className="text-gray-500 mb-6 max-w-sm">
                            Log your daily habits, sleep, and water intake to keep your wellness score high.
                        </p>
                        <Link to="/tracker" className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-700 transition">
                            Track Today <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Recommended for you</h3>
                <div className="space-y-3">
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                            <Droplets size={20} />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800">Drink more water</p>
                            <p className="text-sm text-gray-500 text-sm">Your average intake is lower than last week. Try to hit 2.5L today.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
