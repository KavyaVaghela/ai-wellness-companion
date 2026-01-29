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
                        <li className="flex items-start gap-3 p-3 bg-orange-50 text-orange-700 rounded-lg text-sm">
                            <div className="w-2 h-2 mt-1.5 rounded-full bg-orange-500"></div>
                            <span>Heatwave advisory for <strong>Delhi</strong>. Stay hydrated.</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Lifestyle Snapshot (Mock Data) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-700 mb-6">Community Lifestyle Snapshot</h3>
                <div className="grid grid-cols-3 gap-4 h-32 items-end justify-items-center">
                    <div className="w-16 bg-blue-100 rounded-t-xl relative group h-3/4 flex flex-col justify-end">
                        <div className="text-center mb-2 font-bold text-blue-800">7.2h</div>
                        <div className="text-xs text-center text-gray-500 -mb-6">Avg Sleep</div>
                    </div>
                    <div className="w-16 bg-teal-100 rounded-t-xl relative group h-2/3 flex flex-col justify-end">
                        <div className="text-center mb-2 font-bold text-teal-800">2.1L</div>
                        <div className="text-xs text-center text-gray-500 -mb-6">Avg Water</div>
                    </div>
                    <div className="w-16 bg-purple-100 rounded-t-xl relative group h-1/2 flex flex-col justify-end">
                        <div className="text-center mb-2 font-bold text-purple-800">45%</div>
                        <div className="text-xs text-center text-gray-500 -mb-6">Exercise</div>
                    </div>
                </div>
            </div>

            <div className="text-center pt-8 pb-4 text-xs text-gray-400">
                <p>🛡️ Privacy First: All trend data is aggregated and completely anonymized.</p>
                <p>We do not share individual health records with any third party.</p>
            </div>
        </div>
    );
};

export default Trends;
