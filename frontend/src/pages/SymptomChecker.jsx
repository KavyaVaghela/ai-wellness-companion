import { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import API_URL from '../config';
import { Share2, AlertTriangle, CheckCircle, Activity } from 'lucide-react';

const SymptomChecker = () => {
    const { user } = useContext(AuthContext);
    const [symptoms, setSymptoms] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleCheck = async (e) => {
        e.preventDefault();
        if (!symptoms.trim()) return;

        setLoading(true);
        // Mock API call to backend
        try {
            const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            // Converting comma separated string to array
            const symptomArray = symptoms.split(',').map(s => s.trim());

            const { data } = await axios.post(`${API_URL}/api/symptoms`, {
                symptoms: symptomArray,
                severity: 'Medium' // Defaulting for demo
            }, config);

            setResult(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Activity className="text-teal-600" /> AI Symptom Checker
            </h1>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <form onSubmit={handleCheck}>
                    <label className="block text-gray-700 font-medium mb-2">
                        Describe your symptoms (separated by commas)
                    </label>
                    <textarea
                        className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition h-32 resize-none"
                        placeholder="e.g., headache, fever, fatigue..."
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                    ></textarea>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-teal-700 transition w-full md:w-auto"
                    >
                        {loading ? 'Analyzing...' : 'Analyze Symptoms'}
                    </button>
                </form>
            </div>

            {result && (
                <div className="bg-white rounded-2xl shadow-lg border-l-4 border-teal-500 overflow-hidden animate-fade-in">
                    <div className="p-6 bg-teal-50 border-b border-teal-100 flex justify-between items-center">
                        <h3 className="font-bold text-teal-800 text-lg">AI Analysis Result</h3>
                        <span className="text-xs font-bold bg-teal-200 text-teal-800 px-2 py-1 rounded uppercase">
                            AI Generated
                        </span>
                    </div>
                    <div className="p-6">
                        <p className="text-gray-800 text-lg mb-4">{result.aiAdvice}</p>

                        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 flex gap-3">
                            <AlertTriangle className="text-yellow-600 flex-shrink-0" />
                            <p className="text-sm text-yellow-800">
                                <strong>Disclaimer:</strong> This is an AI-generated assessment and NOT a medical diagnosis. Please consult a qualified doctor for serious concerns.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SymptomChecker;
