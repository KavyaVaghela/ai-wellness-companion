import { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import API_URL from '../config';
import { Share2, AlertTriangle, CheckCircle, Activity, Thermometer, Clock, Info, HeartPulse, Stethoscope, Home } from 'lucide-react';

const COMMON_SYMPTOMS = [
    "Headache", "Fever", "Cough", "Cold", "Fatigue",
    "Body Pain", "Nausea", "Shortness of Breath"
];

const SymptomChecker = () => {
    const { user } = useContext(AuthContext);
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [manualInput, setManualInput] = useState('');
    const [severity, setSeverity] = useState('Mild');
    const [duration, setDuration] = useState('Today');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const toggleSymptom = (symptom) => {
        if (selectedSymptoms.includes(symptom)) {
            setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
        } else {
            setSelectedSymptoms([...selectedSymptoms, symptom]);
        }
    };

    const handleCheck = async (e) => {
        e.preventDefault();
        const allSymptoms = [...selectedSymptoms];
        if (manualInput.trim()) {
            manualInput.split(',').forEach(s => {
                const trimmed = s.trim();
                if (trimmed && !allSymptoms.includes(trimmed)) {
                    allSymptoms.push(trimmed);
                }
            });
        }

        if (allSymptoms.length === 0) return;

        setLoading(true);
        try {
            const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const { data } = await axios.post(`${API_URL}/api/symptoms`, {
                symptoms: allSymptoms,
                severity,
                duration
            }, config);

            setResult(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-gray-800">
                    🤒 How are you feeling today?
                </h1>
                <p className="text-gray-500">
                    Tell us your symptoms. We’ll guide you safely and calmly.
                </p>
                <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">
                    No diagnosis. Just guidance.
                </span>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-teal-50">
                <form onSubmit={handleCheck} className="space-y-8">

                    {/* Symptom Chips */}
                    <div className="space-y-3">
                        <label className="block text-gray-700 font-semibold">Select Symptoms</label>
                        <div className="flex flex-wrap gap-3">
                            {COMMON_SYMPTOMS.map((sym) => (
                                <button
                                    key={sym}
                                    type="button"
                                    onClick={() => toggleSymptom(sym)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedSymptoms.includes(sym)
                                            ? 'bg-teal-600 text-white shadow-md transform scale-105'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {sym}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Manual Input */}
                    <div className="space-y-2">
                        <label className="block text-gray-700 font-semibold">Other Symptoms?</label>
                        <input
                            type="text"
                            className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50"
                            placeholder="e.g., dizzy, shivering (optional)"
                            value={manualInput}
                            onChange={(e) => setManualInput(e.target.value)}
                        />
                        <p className="text-xs text-gray-400">You can select above or type in your own words.</p>
                    </div>

                    {/* Severity & Duration Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Severity */}
                        <div className="space-y-3">
                            <label className="block text-gray-700 font-semibold flex items-center gap-2">
                                <Activity size={18} className="text-teal-500" /> Severity
                            </label>
                            <div className="flex bg-gray-100 p-1 rounded-xl">
                                {['Mild', 'Moderate', 'Severe'].map((level) => (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => setSeverity(level)}
                                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${severity === level
                                                ? 'bg-white text-teal-700 shadow-sm border border-gray-200'
                                                : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Duration */}
                        <div className="space-y-3">
                            <label className="block text-gray-700 font-semibold flex items-center gap-2">
                                <Clock size={18} className="text-teal-500" /> Duration
                            </label>
                            <select
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                            >
                                <option value="Today">Today</option>
                                <option value="1-3 days">1–3 days</option>
                                <option value="More than 3 days">More than 3 days</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || (selectedSymptoms.length === 0 && !manualInput.trim())}
                        className="w-full bg-gradient-to-r from-teal-500 to-teal-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:from-teal-600 hover:to-teal-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? 'Analyzing...' : <>🔍 Get Health Guidance</>}
                    </button>
                </form>
            </div>

            {/* Hybrid Results Display - 4 Cards */}
            {result && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">

                    {/* Card 1: AI Understanding */}
                    <div className="bg-blue-50 p-6 rounded-2xl shadow-sm border border-blue-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-blue-100 p-2 rounded-full">
                                <HeartPulse className="text-blue-600" size={24} />
                            </div>
                            <h3 className="font-bold text-blue-900 text-lg">Your Symptoms Summary</h3>
                        </div>
                        <p className="text-blue-800 leading-relaxed text-sm">
                            {result.aiAdvice || `You are reporting symptoms of ${result.symptoms.join(', ')}. Below is some guidance.`}
                        </p>
                    </div>

                    {/* Card 2: Possible Reasons */}
                    <div className="bg-yellow-50 p-6 rounded-2xl shadow-sm border border-yellow-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-yellow-100 p-2 rounded-full">
                                <Info className="text-yellow-600" size={24} />
                            </div>
                            <h3 className="font-bold text-yellow-900 text-lg">Possible Reasons</h3>
                        </div>
                        <ul className="list-disc pl-5 space-y-2 text-yellow-800 text-sm">
                            {(result.possibleCauses || ["Viral fatigue", "Dehydration", "Exhaustion"]).map((cause, i) => (
                                <li key={i}>{cause}</li>
                            ))}
                        </ul>
                        <p className="text-xs text-yellow-600 mt-4 italic">*Common possibilities, not a diagnosis.</p>
                    </div>

                    {/* Card 3: Home Remedies (Indian Context) */}
                    <div className="bg-green-50 p-6 rounded-2xl shadow-sm border border-green-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-green-100 p-2 rounded-full">
                                <Home className="text-green-600" size={24} />
                            </div>
                            <h3 className="font-bold text-green-900 text-lg">Home Care & Remedies</h3>
                        </div>
                        <ul className="space-y-2 text-green-800 text-sm">
                            {(result.homeRemedies || ["Drink warm water", "Rest properly"]).map((remedy, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="text-green-500 mt-1">🌿</span>
                                    {remedy}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Card 4: When to see a doctor */}
                    <div className="bg-red-50 p-6 rounded-2xl shadow-sm border border-red-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-red-100 p-2 rounded-full">
                                <Stethoscope className="text-red-600" size={24} />
                            </div>
                            <h3 className="font-bold text-red-900 text-lg">Get Medical Help If</h3>
                        </div>
                        <ul className="space-y-2 text-red-800 text-sm">
                            {(result.whenToSeeDoctor || ["Symptoms worsen rapidly", "High fever persists > 3 days"]).map((trigger, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="text-red-500 mt-1">🚨</span>
                                    {trigger}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Bottom Reassurance */}
                    <div className="md:col-span-2 text-center pt-6 pb-2">
                        <p className="text-teal-700 font-medium">
                            💙 You’re not alone. Take care and monitor your health calmly.
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                            This guidance is for awareness only and does not replace professional medical advice.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SymptomChecker;