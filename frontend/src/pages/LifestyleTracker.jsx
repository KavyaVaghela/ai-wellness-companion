import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';
import { Send, CheckCircle, Moon, Droplets, Activity, Smile, Zap, ChevronRight, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, ReferenceLine, Cell } from 'recharts';

const LifestyleTracker = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        sleepHours: 7,
        waterIntake: 1.5,
        steps: 5000,
        mood: 'Happy',
    });
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [insight, setInsight] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    // Fetch History for Trends
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get(`${API_URL}/api/lifestyle`, config);

                // Process last 7 days (reverse chronological from backend)
                const last7Days = data.slice(0, 7).reverse().map(log => ({
                    day: new Date(log.createdAt).toLocaleDateString('en-US', { weekday: 'short' }),
                    sleep: log.sleepHours,
                    water: log.waterIntake
                }));
                setHistory(last7Days);
            } catch (error) {
                console.error("Failed to fetch history", error);
            }
        };
        fetchHistory();
    }, []);

    // Instant AI Feedback Logic
    useEffect(() => {
        let text = "Balanced Start. ";
        if (formData.sleepHours < 6) text = "😴 Low sleep may increase stress levels today.";
        else if (formData.sleepHours > 8) text = "🔋 Well rested! You will have good energy.";

        if (formData.waterIntake < 1.5) text += " 💧 Hydration is a bit low.";
        else text += " 💧 Great hydration!";

        if (formData.mood === 'Stressed') text += " 🧘 Take a breather.";

        setInsight(text);
    }, [formData]);

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.post(`${API_URL}/api/lifestyle`, formData, config);

            // Show success animation
            setLoading(false);
            setShowSuccess(true);
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);

        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const getSleepEmoji = () => {
        if (formData.sleepHours < 5) return '😴';
        if (formData.sleepHours < 7) return '😐';
        return '😃';
    };

    // Water Card Colors
    const getWaterColor = (amount) => {
        if (amount <= 0.5) return 'bg-red-50 text-red-600 border-red-200';
        if (amount <= 1.0) return 'bg-yellow-50 text-yellow-600 border-yellow-200';
        if (amount <= 1.5) return 'bg-blue-50 text-blue-600 border-blue-200';
        return 'bg-green-50 text-green-600 border-green-200';
    };

    return (
        <div className="max-w-4xl mx-auto min-h-screen py-8 px-4 animate-fadeIn">

            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Daily Wellness Check-In</h1>
                <p className="text-gray-500 mt-2 text-lg">Track your habits. Improve your life.</p>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">

                {/* Top Insight Card */}
                <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10"><Zap size={100} /></div>
                    <div className="relative z-10 flex gap-4 items-start">
                        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                            <Zap size={24} className="text-yellow-300 fill-current" />
                        </div>
                        <div>
                            <h3 className="font-bold text-blue-100 text-xs tracking-wider uppercase mb-1">Today's Wellness Insight</h3>
                            <p className="font-medium text-xl leading-snug">"{insight}"</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-12">

                    {/* TWO COLUMN GRID FOR INPUTS & CHARTS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                        {/* LEFT: SLEEP */}
                        <div>
                            <label className="flex items-center justify-between font-bold text-gray-800 mb-6 text-lg">
                                <span className="flex items-center gap-3"><div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><Moon size={20} /></div> Sleep Duration</span>
                                <span className="text-3xl font-black text-indigo-600 flex items-center gap-2">{formData.sleepHours}<span className="text-base text-gray-400 font-normal">hrs</span> {getSleepEmoji()}</span>
                            </label>

                            <input
                                type="range"
                                min="0"
                                max="12"
                                step="0.5"
                                value={formData.sleepHours}
                                onChange={(e) => handleChange('sleepHours', parseFloat(e.target.value))}
                                className="w-full h-4 bg-gray-200 rounded-full appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-500 transition-all"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-3 font-semibold uppercase tracking-wide">
                                <span>0h</span>
                                <span>Target: 7-8h</span>
                                <span>12h</span>
                            </div>

                            {/* Sleep Trend Chart */}
                            <div className="mt-8 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">💤 Sleep Trend (Last 7 Days)</h4>
                                <div className="h-32">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={[...history, { day: 'Today', sleep: formData.sleepHours }]}>
                                            <Defs>
                                                <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                                </linearGradient>
                                            </Defs>
                                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                                            <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                            <Area type="monotone" dataKey="sleep" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSleep)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: WATER */}
                        <div>
                            <label className="flex items-center justify-between font-bold text-gray-800 mb-6 text-lg">
                                <span className="flex items-center gap-3"><div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Droplets size={20} /></div> Water Intake</span>
                                <span className="text-3xl font-black text-blue-600 flex items-center gap-2">{formData.waterIntake}<span className="text-base text-gray-400 font-normal">L</span></span>
                            </label>

                            <div className="grid grid-cols-4 gap-3">
                                {[0.5, 1.0, 1.5, 2.5].map((amount) => (
                                    <motion.button
                                        key={amount}
                                        type="button"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleChange('waterIntake', amount)}
                                        className={`py-4 rounded-2xl font-bold transition-all border-2 flex flex-col items-center gap-1 ${formData.waterIntake === amount ? getWaterColor(amount) + ' ring-4 ring-offset-2 ring-blue-100 shadow-lg scale-105' : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100'}`}
                                    >
                                        <span className="text-xl">{amount >= 2 ? '🥤' : '💧'}</span>
                                        <span className="text-sm">{amount}L</span>
                                    </motion.button>
                                ))}
                            </div>

                            {/* Water Trend Chart */}
                            <div className="mt-8 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">💧 Avg Intake (Last 7 Days)</h4>
                                <div className="h-32">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={[...history, { day: 'Today', water: formData.waterIntake }]}>
                                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                            <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px' }} />
                                            <ReferenceLine y={2} stroke="#3b82f6" strokeDasharray="3 3" />
                                            <Bar dataKey="water" radius={[4, 4, 0, 0]}>
                                                {[...history, { water: formData.waterIntake }].map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.water >= 2 ? '#3b82f6' : '#93c5fd'} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* ACTIVITY & MOOD */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                        {/* Activity */}
                        <div>
                            <label className="block font-bold text-gray-800 mb-6 flex items-center gap-3 text-lg">
                                <div className="p-2 bg-teal-100 rounded-lg text-teal-600"><Activity size={20} /></div> Activity Level
                            </label>
                            <div className="space-y-3">
                                {[
                                    { label: 'Sedentary', val: 2000, icon: '🛋️', desc: 'Mostly sitting' },
                                    { label: 'Light', val: 6000, icon: '🚶', desc: 'Short walks' },
                                    { label: 'Active', val: 10000, icon: '🏃', desc: 'Exercise / Sports' },
                                ].map((opt) => (
                                    <motion.button
                                        key={opt.label}
                                        type="button"
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleChange('steps', opt.val)}
                                        className={`w-full p-4 rounded-2xl font-bold transition-all border flex items-center justify-between group ${formData.steps === opt.val ? 'bg-teal-50 border-teal-500 text-teal-800 shadow-md' : 'bg-white border-gray-200 text-gray-500 hover:border-teal-300'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="text-2xl bg-white p-2 rounded-full shadow-sm">{opt.icon}</span>
                                            <div className="text-left">
                                                <div className="text-base">{opt.label}</div>
                                                <div className="text-xs font-normal opacity-70">{opt.desc}</div>
                                            </div>
                                        </div>
                                        {formData.steps === opt.val && <CheckCircle size={20} className="text-teal-600" />}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Mood */}
                        <div>
                            <label className="block font-bold text-gray-800 mb-6 flex items-center gap-3 text-lg">
                                <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600"><Smile size={20} /></div> Current Mood
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                {['Happy', 'Neutral', 'Stressed', 'Sad'].map((m) => (
                                    <motion.button
                                        key={m}
                                        type="button"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleChange('mood', m)}
                                        className={`h-24 rounded-2xl font-bold transition-all border flex flex-col items-center justify-center gap-2 ${formData.mood === m ? 'bg-yellow-50 border-yellow-400 text-yellow-800 shadow-lg' : 'bg-white border-gray-200 text-gray-400 hover:border-yellow-200'}`}
                                    >
                                        <span className="text-3xl">
                                            {m === 'Happy' && '😄'}
                                            {m === 'Neutral' && '😐'}
                                            {m === 'Stressed' && '😫'}
                                            {m === 'Sad' && '😢'}
                                        </span>
                                        <span className="text-sm">{m}</span>
                                    </motion.button>
                                ))}
                            </div>
                            <p className="text-center text-sm text-gray-400 mt-6 font-medium bg-gray-50 py-3 rounded-xl border border-gray-100">
                                {formData.mood === 'Stressed' || formData.mood === 'Sad' ? "It's okay not to be okay. Take it easy today 💙" : "Keep up the positive vibes! ✨"}
                            </p>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6">
                        <motion.button
                            type="submit"
                            disabled={loading || showSuccess}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full py-5 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-3 text-lg relative overflow-hidden ${showSuccess ? 'bg-green-500 text-white' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
                        >
                            <AnimatePresence mode='wait'>
                                {showSuccess ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-2"
                                    >
                                        <CheckCircle size={24} /> Dashboard Updated!
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-2"
                                    >
                                        {loading ? 'Saving...' : <>Save My Day <ChevronRight size={20} /></>}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>

                </form>
            </div>
        </div>
    );
};

// Helper for Recharts Gradient
const Defs = ({ children }) => (
    <svg style={{ height: 0 }}>
        <defs>{children}</defs>
    </svg>
);

export default LifestyleTracker;
