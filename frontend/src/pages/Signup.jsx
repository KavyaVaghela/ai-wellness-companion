import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // We removed the huge initial form fields because we moved them to Onboarding
    // The user flow is: Signup (Name, Email, Pass) -> Onboarding (Profile, Questions, Emergency)
    // However, the user said "then after sign in it will ask to set app profile". 
    // So I will simplify Signup to just basic auth, or keep it but I prefer simplifying it 
    // and letting Onboarding handle the details to avoid duplication. 
    // BUT the underlying API 'register' expects some fields maybe? 
    // checking authRoutes... no, it takes whatever is in body. 
    // I will simplify Signup to Name/Email/Password to make entry easier, 
    // then Onboarding handles the rest. This matches "modern" flow better.

    const [error, setError] = useState('');
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const { register, googleLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const res = await register({
            name, email, password
        });
        if (res.success) {
            // New users always go to onboarding
            navigate('/onboarding');
        } else {
            setError(res.message);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setIsGoogleLoading(true);
        setError('');
        try {
            const res = await googleLogin(credentialResponse);
            if (res.success) {
                console.log("Google Signup Success. Onboarding Status:", res.isOnboardingComplete);
                if (res.isOnboardingComplete === true) {
                    navigate('/dashboard');
                } else {
                    navigate('/onboarding');
                }
            } else {
                setError(res.message);
            }
        } catch (err) {
            setError("Unexpected error during Google Signup");
            console.error(err);
        } finally {
            setIsGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Create Account</h2>
                <p className="text-center text-gray-500 mb-8">Join our wellness community today</p>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <div className="mb-6 flex flex-col items-center justify-center">
                    {isGoogleLoading ? (
                        <div className="flex items-center gap-2 text-teal-600 font-medium mb-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-600"></div>
                            Signing up with Google...
                        </div>
                    ) : (
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError("Google Login Failed")}
                            theme="filled_blue"
                            shape="pill"
                            text="signup_with"
                            width="300"
                        />
                    )}
                </div>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or sign up with email</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="email"
                                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="password"
                                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Age/Gender/Profession/Emergency inputs removed - moved to Onboarding.jsx */}

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-teal-600 hover:to-teal-700 transition flex items-center justify-center gap-2 mt-4"
                    >
                        Sign Up <ArrowRight size={18} />
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?
                    <Link to="/login" className="text-teal-600 font-semibold hover:underline ml-1">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
