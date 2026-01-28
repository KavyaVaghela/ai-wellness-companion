import { Link } from 'react-router-dom';
import { HeartPulse, ShieldCheck, Activity, Users } from 'lucide-react';

const Landing = () => {
    return (
        <div className="bg-gradient-to-br from-slate-50 to-blue-50/50">
            {/* Hero Section */}
            <section className="py-20 text-center container mx-auto px-4">
                <div className="flex justify-center mb-6">
                    <div className="bg-white p-4 rounded-full shadow-md animate-bounce-slow">
                        <HeartPulse size={48} className="text-teal-600" />
                    </div>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
                    Your AI Wellness <span className="text-teal-600">Companion</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                    A smart healthcare assistant that tracks your symptoms, monitors your lifestyle,
                    and provides AI-powered health guidance 24/7.
                </p>
                <div className="flex justify-center gap-4">
                    <Link to="/signup" className="bg-teal-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-teal-700 hover:shadow-xl transition transform hover:-translate-y-1">
                        Get Started Free
                    </Link>
                    <Link to="/login" className="bg-white text-gray-700 px-8 py-3 rounded-full text-lg font-semibold shadow-sm border border-gray-200 hover:bg-gray-50 transition">
                        Login
                    </Link>
                </div>
            </section>

            {/* Features */}
            <section className="py-16 container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                        <div className="bg-teal-100 w-12 h-12 flex items-center justify-center rounded-xl text-teal-600 mb-4">
                            <Activity size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">AI Symptom Checker</h3>
                        <p className="text-gray-500">
                            Describe your symptoms and get instant, verified medical guidance and home care tips.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                        <div className="bg-blue-100 w-12 h-12 flex items-center justify-center rounded-xl text-blue-600 mb-4">
                            <ShieldCheck size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Lifestyle AI Tracker</h3>
                        <p className="text-gray-500">
                            Log your daily habits and receive personalized recommendations to improve your health score.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                        <div className="bg-purple-100 w-12 h-12 flex items-center justify-center rounded-xl text-purple-600 mb-4">
                            <Users size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Community Trends</h3>
                        <p className="text-gray-500">
                            Stay informed about local health trends and seasonal illness patterns in your area.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
