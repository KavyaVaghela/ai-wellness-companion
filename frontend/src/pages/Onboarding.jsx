import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { User, Activity, HeartPulse, ShieldAlert, ArrowRight, Check } from 'lucide-react';

// Define step components OUTSIDE the main component to prevent re-renders losing focus
const Step1Profile = ({ formData, handleInputChange, handleFileChange, nextStep }) => (
    <div className="space-y-6 animate-fadeIn">
        <h2 className="text-2xl font-bold text-gray-800">Tell us about yourself</h2>
        <p className="text-gray-500">Help us personalize your experience.</p>

        <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 relative group hover:border-teal-500 transition cursor-pointer">
                {formData.profilePic ? (
                    <img src={formData.profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <User className="text-gray-400 group-hover:text-teal-500" size={32} />
                )}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                />
            </div>
            <p className="sr-only">Upload Profile Picture</p>
        </div>
        <p className="text-center text-xs text-gray-500 -mt-4">Tap to upload photo</p>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Birthdate</label>
                <input
                    name="birthdate"
                    type="date"
                    value={formData.birthdate ? new Date(formData.birthdate).toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                        const date = e.target.value;
                        const age = new Date().getFullYear() - new Date(date).getFullYear();
                        handleInputChange({ target: { name: 'birthdate', value: date } });
                        handleInputChange({ target: { name: 'age', value: age } });
                    }}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-teal-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile No</label>
                <input name="mobile" type="tel" value={formData.mobile} onChange={handleInputChange} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-teal-500" placeholder="+91 98765..." />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age (Auto)</label>
                <input name="age" type="number" value={formData.age} readOnly className="w-full p-3 border rounded-xl bg-gray-100 text-gray-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-teal-500 bg-white">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                </select>
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
            <input name="profession" type="text" value={formData.profession} onChange={handleInputChange} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-teal-500" placeholder="Software Engineer" />
        </div>

        <button onClick={nextStep} className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-teal-700 transition flex justify-center items-center gap-2">
            Continue <ArrowRight size={20} />
        </button>
    </div>
);

const Step2Questions = ({ questionnaire, handleQuestionSelect, nextStep, prevStep }) => {
    const options = {
        sleep: ['< 5 hours', '5-7 hours', '7-9 hours', '> 9 hours'],
        stress: ['Low', 'Moderate', 'High', 'Extreme'],
        mood: ['Happy', 'Calm', 'Anxious', 'Sad'], // New Emotional
        energy: ['Low', 'Medium', 'High', 'Fluctuating'], // New Physical
        activity: ['Sedentary', 'Lightly Active', 'Active', 'Very Active'],
        diet: ['Fast Food', 'Balanced', 'Vegetarian', 'Strict Plan']
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800">Health Check-in</h2>
            <p className="text-gray-500">Select what matches your lifestyle best.</p>

            {Object.entries(options).map(([category, choices]) => (
                <div key={category} className="space-y-2">
                    <label className="capitalize font-semibold text-gray-700">{category} Levels</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {choices.map((choice) => (
                            <button
                                key={choice}
                                onClick={() => handleQuestionSelect(category, choice)}
                                className={`p-2 rounded-lg text-sm border transition ${questionnaire[category] === choice
                                    ? 'bg-teal-100 border-teal-500 text-teal-800 font-bold'
                                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {choice}
                            </button>
                        ))}
                    </div>
                </div>
            ))}

            <div className="flex gap-4 pt-4">
                <button onClick={prevStep} className="flex-1 py-3 text-gray-600 font-semibold hover:underline">Back</button>
                <button onClick={nextStep} className="flex-1 bg-teal-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-teal-700 transition">Next</button>
            </div>
        </div>
    );
};

const Step3Emergency = ({ formData, handleInputChange, handleSubmit, loading, prevStep }) => (
    <div className="space-y-6 animate-fadeIn">
        <h2 className="text-2xl font-bold text-gray-800">Emergency Safety Net</h2>
        <p className="text-gray-500">We'll alert these contacts if you trigger SOS.</p>

        <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-start gap-3">
            <ShieldAlert className="text-red-500 shrink-0" size={24} />
            <p className="text-sm text-red-700">Your specific location and health data will be shared with this contact in an emergency.</p>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
            <input name="emergencyName" type="text" value={formData.emergencyName} onChange={handleInputChange} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-teal-500" placeholder="Jane Doe" />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input name="emergencyPhone" type="tel" value={formData.emergencyPhone} onChange={handleInputChange} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-teal-500" placeholder="+1 234..." />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
                <input name="emergencyEmail" type="email" value={formData.emergencyEmail} onChange={handleInputChange} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-teal-500" placeholder="mom@example.com" />
            </div>
            <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                <input name="emergencyRelation" type="text" value={formData.emergencyRelation} onChange={handleInputChange} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-teal-500" placeholder="Mother" />
            </div>
        </div>

        <div className="flex gap-4 pt-4">
            <button onClick={prevStep} className="flex-1 py-3 text-gray-600 font-semibold hover:underline">Back</button>
            <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-teal-600 to-green-500 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition flex justify-center items-center gap-2"
            >
                {loading ? 'Saving...' : 'Finish Setup'} <Check size={20} />
            </button>
        </div>
    </div>
);

const Onboarding = () => {
    const { user, updateProfile } = useContext(AuthContext);
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Auto-redirect if already onboarded
    useEffect(() => {
        if (user && user.isOnboardingComplete) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    // Form States
    const [formData, setFormData] = useState({
        age: user?.age || '',
        birthdate: user?.birthdate || '', // New
        mobile: user?.mobile || '', // New
        gender: user?.gender || 'Male',
        profession: user?.profession || '',
        profilePic: '',
        bio: '',
        emergencyName: user?.emergencyContact?.name || '',
        emergencyPhone: user?.emergencyContact?.phone || '',
        emergencyEmail: user?.emergencyContact?.email || '', // New
        emergencyRelation: user?.emergencyContact?.relationship || ''
    });

    const [questionnaire, setQuestionnaire] = useState({
        sleep: '',
        diet: '',
        stress: '',
        activity: ''
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5000000) { // 5MB limit
                alert("File is too large. Please upload an image under 5MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, profilePic: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleQuestionSelect = (category, value) => {
        setQuestionnaire({ ...questionnaire, [category]: value });
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = async () => {
        setLoading(true);
        const payload = {
            _id: user._id,
            ...formData,
            emergencyContact: {
                name: formData.emergencyName,
                phone: formData.emergencyPhone,
                email: formData.emergencyEmail, // New
                relationship: formData.emergencyRelation
            },
            questionnaireAnswers: questionnaire,
            isOnboardingComplete: true
        };

        const res = await updateProfile(payload);
        if (res.success) {
            navigate('/dashboard');
        } else {
            alert(`Failed to save profile: ${res.message || 'Unknown Error'}. Please try again.`);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
                {/* Sidebar / Progress */}
                <div className="bg-teal-900 text-white p-8 md:w-1/3 flex flex-col justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Welcome</h1>
                        <p className="text-teal-200 text-sm">Let's set up your personal AI wellness profile.</p>
                    </div>

                    <div className="space-y-6 my-8">
                        <div className={`flex items-center gap-3 ${step >= 1 ? 'text-white' : 'text-teal-700'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'bg-white text-teal-900 border-white' : 'border-teal-700'}`}>1</div>
                            <span className="font-medium">Profile</span>
                        </div>
                        <div className={`flex items-center gap-3 ${step >= 2 ? 'text-white' : 'text-teal-700'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'bg-white text-teal-900 border-white' : 'border-teal-700'}`}>2</div>
                            <span className="font-medium">Assessment</span>
                        </div>
                        <div className={`flex items-center gap-3 ${step >= 3 ? 'text-white' : 'text-teal-700'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'bg-white text-teal-900 border-white' : 'border-teal-700'}`}>3</div>
                            <span className="font-medium">Emergency</span>
                        </div>
                    </div>

                    <div className="text-xs text-teal-400">
                        Step {step} of 3
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 md:w-2/3 flex flex-col justify-center">
                    {step === 1 && <Step1Profile
                        formData={formData}
                        handleInputChange={handleInputChange}
                        handleFileChange={handleFileChange}
                        nextStep={nextStep}
                    />}
                    {step === 2 && <Step2Questions
                        questionnaire={questionnaire}
                        handleQuestionSelect={handleQuestionSelect}
                        nextStep={nextStep}
                        prevStep={prevStep}
                    />}
                    {step === 3 && <Step3Emergency
                        formData={formData}
                        handleInputChange={handleInputChange}
                        handleSubmit={handleSubmit}
                        loading={loading}
                        prevStep={prevStep}
                    />}
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
