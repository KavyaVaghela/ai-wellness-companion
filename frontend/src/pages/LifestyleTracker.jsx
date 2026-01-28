import { useState } from 'react';
import axios from 'axios';
import API_URL from '../config';
import { Send, CheckCircle } from 'lucide-react';

const LifestyleTracker = () => {
    const [formData, setFormData] = useState({
        sleepHours: '',
        waterIntake: '',
        steps: '',
        mood: 'Happy',
    });
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.post(`${API_URL}/api/lifestyle`, formData, config);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            setFormData({ sleepHours: '', waterIntake: '', steps: '', mood: 'Happy' });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Daily Lifestyle Tracker</h1>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                {success && (
                    <div className="bg-green-100 text-green-700 p-3 rounded-lg flex items-center gap-2 mb-4">
                        <CheckCircle size={18} /> Logged successfully!
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Sleep (Hours)</label>
                            <input
                                type="number"
                                name="sleepHours"
                                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                                value={formData.sleepHours}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Water Intake (Liters)</label>
                            <input
                                type="number"
                                step="0.1"
                                name="waterIntake"
                                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                                value={formData.waterIntake}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Steps Count</label>
                            <input
                                type="number"
                                name="steps"
                                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                                value={formData.steps}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Mood</label>
                            <select
                                name="mood"
                                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition bg-white"
                                value={formData.mood}
                                onChange={handleChange}
                            >
                                <option value="Happy">Happy</option>
                                <option value="Neutral">Neutral</option>
                                <option value="Stressed">Stressed</option>
                                <option value="Sad">Sad</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold shadow-lg hover:bg-gray-800 transition flex items-center justify-center gap-2"
                    >
                        Save Log <Send size={16} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LifestyleTracker;
