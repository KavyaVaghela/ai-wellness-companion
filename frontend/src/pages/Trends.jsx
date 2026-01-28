import { TrendingUp, Users, MapPin } from 'lucide-react';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import API_URL from '../config';

const Trends = () => {
    const [stats, setStats] = useState([]);

    useEffect(() => {
        const fetchTrends = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
                const { data } = await axios.get(`${API_URL}/api/symptoms/trends`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(data);
            } catch (error) {
                console.error("Error fetching trends");
            }
        };
        fetchTrends();
    }, []);

    // Color map for demo
    const colors = ['bg-red-400', 'bg-orange-400', 'bg-blue-400', 'bg-purple-400', 'bg-teal-400'];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <TrendingUp className="text-teal-600" /> Community Health Trends
            </h1>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <Users size={18} /> Common Symptoms (This Week)
                    </h3>
                    <div className="space-y-3">
                        {stats.length > 0 ? (
                            stats.map((item, idx) => (
                                <div key={idx} className="w-full bg-gray-100 rounded-full h-8 relative overflow-hidden">
                                    <div className={`${colors[idx % colors.length]} h-full flex items-center px-3 text-xs text-white font-bold transition-all duration-1000`} style={{ width: `${item.percentage}%` }}>
                                        {item.name} ({item.percentage}%)
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">No data available yet.</p>
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <MapPin size={18} /> Regional Alerts
                    </h3>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                            <div className="w-2 h-2 mt-1.5 rounded-full bg-red-500"></div>
                            <span>High Flu cases reported in <strong>Mumbai</strong> region.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Trends;
