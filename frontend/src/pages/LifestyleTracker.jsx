import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';
import { Send, CheckCircle, Moon, Droplets, Activity, Smile, ArrowRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LifestyleTracker = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        sleepHours: 7,
        waterIntake: 1.5,
        steps: 5000,
        mood: 'Happy',
    });
    const [loading, setLoading] = useState(false);
    const [insight, setInsight] = useState('');

    // Instant AI Feedback Logic (Client-side heuristic)
    useEffect(() => {
        let text = "Balanced Start. ";
        if (formData.sleepHours < 6) text = "😴 Low sleep may increase stress levels today.";
        else if (formData.sleepHours > 8) text = "🔋 Well rested! You should have good energy.";

        if (formData.waterIntake < 1.5) text += " 💧 Hydration is a bit low for heart stability.";
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

            // Artificial delay for "processing" feel
            setTimeout(() => {
                navigate('/dashboard');
            }, 800);

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

    return (
        <div className="max-w-xl mx-auto min-h-screen py-6 animate-fadeIn">

            {/* 1. Title & Context */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">🌱 Daily Wellness Check-In</h1>
                <p className="text-gray-500 mt-2">It takes less than 30 seconds. Small habits matter.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

                {/* 3. Instant AI Feedback Card (Top) */}
                <div className="bg-indigo-600 p-6 text-white flex gap-4 items-start">
                    <div className="bg-white/20 p-2 rounded-full mt-1">
                        <Zap size={20} className="text-yellow-300 fill-current" />
                    </div>
                    <div>
                        <h3 className="font-bold text-indigo-100 text-xs tracking-wider uppercase mb-1">🤖 Today's Wellness Insight</h3>
                        <p className="font-medium text-lg leading-snug">"{insight}"</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">

                    {/* Sleep Input */}
                    <div>
                        <label className="flex items-center justify-between font-bold text-gray-700 mb-4">
                            <span className="flex items-center gap-2"><Moon size={18} className="text-indigo-500" /> Sleep Duration</span>
                            <span className="text-2xl">{getSleepEmoji()} <span className="text-indigo-600">{formData.sleepHours}h</span></span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="12"
                            step="0.5"
                            value={formData.sleepHours}
                            onChange={(e) => handleChange('sleepHours', parseFloat(e.target.value))}
                            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                            <span>0h</span>
                            <span>6h (Min)</span>
                            <span>12h</span>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Water Input */}
                    <div>
                        <label className="block font-bold text-gray-700 mb-4 flex items-center gap-2">
                            <Droplets size={18} className="text-blue-500" /> Water Intake
                        </label>
                        <div className="grid grid-cols-4 gap-3">
                            {[0.5, 1.0, 1.5, 2.5].map((amount) => (
                                <button
                                    key={amount}
                                    type="button"
                                    onClick={() => handleChange('waterIntake', amount)}
                                    className={`py-3 rounded-xl font-bold transition flex flex-col items-center gap-1 ${formData.waterIntake === amount ? 'bg-blue-100 text-blue-700 border-2 border-blue-500' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                                >
                                    <span className="text-lg">{amount >= 2 ? '🥤' : '💧'}</span>
                                    <span className="text-sm">{amount}L</span>
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-3 text-center">Hydration supports heart stability.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Activity Input */}
                    <div>
                        <label className="block font-bold text-gray-700 mb-4 flex items-center gap-2">
                            <Activity size={18} className="text-teal-500" /> Activity Level
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { label: 'Sedentary', val: 2000, icon: '🛋️' },
                                { label: 'Light', val: 6000, icon: '🚶' },
                                { label: 'Active', val: 10000, icon: '🏃' },
                            ].map((opt) => (
                                <button
                                    key={opt.label}
                                    type="button"
                                    onClick={() => handleChange('steps', opt.val)}
                                    className={`py-3 rounded-xl font-bold transition flex flex-col items-center gap-1 ${formData.steps === opt.val ? 'bg-teal-100 text-teal-700 border-2 border-teal-500' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                                >
                                    <span className="text-xl">{opt.icon}</span>
                                    <span className="text-sm">{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Mood Input */}
                    <div>
                        <label className="block font-bold text-gray-700 mb-4 flex items-center gap-2">
                            <Smile size={18} className="text-yellow-500" /> Mood
                        </label>
                        <div className="flex justify-between bg-gray-50 p-2 rounded-2xl">
                            {['Happy', 'Neutral', 'Stressed', 'Sad'].map((m) => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => handleChange('mood', m)}
                                    className={`flex-1 py-2 rounded-xl text-sm font-bold transition ${formData.mood === m ? 'bg-white shadow-md text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 4. Save Action */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold shadow-xl hover:bg-gray-800 transition transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-lg"
                    >
                        {loading ? 'Updating Health Profile...' : (
                            <>
                                <CheckCircle size={20} /> Save & Update My Health
                            </>
                        )}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default LifestyleTracker;
