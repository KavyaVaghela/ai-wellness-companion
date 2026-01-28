import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { HeartPulse, Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center gap-2 text-teal-600 font-bold text-xl">
                        <HeartPulse size={28} />
                        <span>AI Wellness</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        {user ? (
                            <>
                                <Link to="/dashboard" className="text-gray-600 hover:text-teal-600 transition">Dashboard</Link>
                                <Link to="/symptom-checker" className="text-gray-600 hover:text-teal-600 transition">Symptoms</Link>
                                <Link to="/tracker" className="text-gray-600 hover:text-teal-600 transition">Tracker</Link>
                                <Link to="/trends" className="text-gray-600 hover:text-teal-600 transition">Trends</Link>

                                <div className="flex items-center gap-4 ml-4">
                                    <span className="flex items-center gap-1 text-teal-700 font-medium">
                                        <UserIcon size={18} />
                                        {user.name}
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-1 text-red-500 hover:text-red-700 transition"
                                    >
                                        <LogOut size={18} />
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-teal-600 font-medium">Login</Link>
                                <Link to="/signup" className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isOpen && (
                    <div className="md:hidden pb-4">
                        <div className="flex flex-col gap-4 mt-2">
                            {user ? (
                                <>
                                    <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block py-2 text-gray-600">Dashboard</Link>
                                    <Link to="/symptom-checker" onClick={() => setIsOpen(false)} className="block py-2 text-gray-600">Symptoms</Link>
                                    <Link to="/tracker" onClick={() => setIsOpen(false)} className="block py-2 text-gray-600">Tracker</Link>
                                    <button onClick={handleLogout} className="text-left text-red-500 py-2">Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setIsOpen(false)} className="block py-2 text-gray-600">Login</Link>
                                    <Link to="/signup" onClick={() => setIsOpen(false)} className="block py-2 text-teal-600 font-medium">Get Started</Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
