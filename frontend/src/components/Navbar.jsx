import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { HeartPulse, Menu, X, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Public routes where we might want a different navbar or no navbar links
    const publicRoutes = ['/login', '/signup', '/'];
    const isPublicPage = publicRoutes.includes(location.pathname);

    // If on public page and not logged in, show minimal or no links?
    // User requested: "remove it from there and add only after login/sign up"
    // Meaning: on login/signup pages, don't show the main app links. 

    // If on public page, hide the navbar completely as requested
    if (isPublicPage) {
        return null; // Or return just a simple Logo header if desired, but user said "remove"
    }

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
                            // Use requested: Only show Login/Get Started if NOT already on those pages?
                            // Or just keep them. User said "Navbar containing dashboard... remove it".
                            // The current code already hides Dashboard if !user.
                            // BUT maybe they see empty space or Want to hide "Login/Signup" buttons if they are ON login page?
                            // Usually it's fine to keep Login/Signup buttons.
                            // However, if they want to hide the *entire* navbar content except logo on login page:
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
