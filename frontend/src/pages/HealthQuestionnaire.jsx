import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import API_URL from '../config';
import { Clipboard, ArrowRight, CheckCircle } from 'lucide-react';

const HealthQuestionnaire = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        tirednessFrequency: 'Rarely',
        headacheDiscomfort: 'No',
        sleepDuration: '6-8 hours',
        physicalActivity: 'Moderate',
        screenTime: '2-4 hours',
        stressLevel: 'Low',
        discomfortSituations: '',
        emergencyPreference: 'Call Family',
        doctorConsultationStatus: 'No',
        wellnessSelfAssessment: 'Good'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.post(`${API_URL}/api/questionnaire`, formData, config);

            alert("Health Profile Updated!");
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            alert("Failed to submit questionnaire.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <Clipboard className="text-teal-600" /> Wellness Questionnaire
            </h1>
            <p className="text-gray-500 mb-8">Please answer these 10 questions to help us personalize your health insights.</p>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">1. Frequency of tiredness?</label>
                        <select name="tirednessFrequency" value={formData.tirednessFrequency} onChange={handleChange} className="w-full p-3 border rounded-xl">
                            <option>Rarely</option>
                            <option>Sometimes</option>
                            <option>Often</option>
                            <option>Always</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">2. Any headache or body discomfort?</label>
                        <select name="headacheDiscomfort" value={formData.headacheDiscomfort} onChange={handleChange} className="w-full p-3 border rounded-xl">
                            <option>No</option>
                            <option>Mild</option>
                            <option>Moderate</option>
                            <option>Severe</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">3. Sleep duration?</label>
                        <select name="sleepDuration" value={formData.sleepDuration} onChange={handleChange} className="w-full p-3 border rounded-xl">
                            <option>&lt; 6 hours</option>
                            <option>6-8 hours</option>
                            <option>&gt; 8 hours</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">4. Physical activity level?</label>
                        <select name="physicalActivity" value={formData.physicalActivity} onChange={handleChange} className="w-full p-3 border rounded-xl">
                            <option>Sedentary</option>
                            <option>Light</option>
                            <option>Moderate</option>
                            <option>Active</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">5. Daily Screen Time?</label>
                        <select name="screenTime" value={formData.screenTime} onChange={handleChange} className="w-full p-3 border rounded-xl">
                            <option>&lt; 2 hours</option>
                            <option>2-4 hours</option>
                            <option>4-8 hours</option>
                            <option>&gt; 8 hours</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">6. Current Stress Level?</label>
                        <select name="stressLevel" value={formData.stressLevel} onChange={handleChange} className="w-full p-3 border rounded-xl">
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-gray-700 font-medium mb-2">7. When does discomfort increase? (Optional)</label>
                        <input type="text" name="discomfortSituations" value={formData.discomfortSituations} onChange={handleChange} placeholder="e.g. After meals, at night" className="w-full p-3 border rounded-xl" />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">8. Emergency Alert Preference?</label>
                        <select name="emergencyPreference" value={formData.emergencyPreference} onChange={handleChange} className="w-full p-3 border rounded-xl">
                            <option>Call Family</option>
                            <option>Call Ambulance</option>
                            <option>Do Nothing</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">9. Recent Doctor Consultation?</label>
                        <select name="doctorConsultationStatus" value={formData.doctorConsultationStatus} onChange={handleChange} className="w-full p-3 border rounded-xl">
                            <option>Yes</option>
                            <option>No</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-gray-700 font-medium mb-2">10. Overall Wellness Self-Assessment?</label>
                        <select name="wellnessSelfAssessment" value={formData.wellnessSelfAssessment} onChange={handleChange} className="w-full p-3 border rounded-xl">
                            <option>Excellent</option>
                            <option>Good</option>
                            <option>Fair</option>
                            <option>Poor</option>
                        </select>
                    </div>
                </div>

                <div className="pt-6">
                    <button type="submit" disabled={loading} className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-teal-700 transition flex items-center justify-center gap-2">
                        {loading ? 'Saving...' : 'Submit Health Profile'} <CheckCircle />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default HealthQuestionnaire;
