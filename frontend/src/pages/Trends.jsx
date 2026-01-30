import { TrendingUp, Users, MapPin, Activity, Droplets, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../config';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const Trends = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrends = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
                const { data } = await axios.get(`${API_URL}/api/trends/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(data);
            } catch (error) {
                console.error("Error fetching trends");
            } finally {
                setLoading(false);
            }
        };
        fetchTrends();
    }, []);

    const colors = ['#F87171', '#FB923C', '#60A5FA', '#A78BFA', '#34D399'];

    if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading community insights...</div>;

    const symptomsData = data?.symptoms || [];

    return (
        <div className="space-y-8 animate-fadeIn">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <TrendingUp className="text-teal-600" size={32} />
                Community Health Pulse
            </h1>

            {/* Top Section: Charts & Alerts */}
            <div className="grid md:grid-cols-2 gap-8">

                {/* Symptom Chart */}
                <div className="bg-white p-6 rounded-3xl shadow-lg border border-teal-50 hover:shadow-xl transition relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-full -mr-8 -mt-8 opacity-50 pointer-events-none"></div>
                    <h3 className="font-bold text-xl text-gray-700 mb-6 flex items-center gap-2">
                        <Users className="text-teal-500" /> Common Symptoms (Last 7 Days)
                    </h3>

                    <div className="h-64 w-full">
                        {symptomsData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={symptomsData} layout="vertical" margin={{ left: 10, right: 30 }}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12, fontWeight: 'bold', fill: '#4B5563' }} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={24}>
                                        {symptomsData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 italic">No symptoms reported yet.</div>
                        )}
                    </div>
                </div>

                {/* Alerts & Insights */}
                <div className="bg-white p-6 rounded-3xl shadow-lg border border-red-50 hover:shadow-xl transition flex flex-col">
                    <h3 className="font-bold text-xl text-gray-700 mb-6 flex items-center gap-2">
                        <MapPin className="text-red-500" /> Regional Health Alerts
                    </h3>

                    {data?.alerts && data.alerts.length > 0 ? (
                        <div className="space-y-4 flex-1">
                            {data.alerts.map((alert, idx) => (
                                <div key={idx} className={`p-4 rounded-2xl flex items-start gap-3 border ${alert.type === 'High' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-orange-50 border-orange-100 text-orange-700'
                                    }`}>
                                    <div className={`w-3 h-3 mt-1.5 rounded-full shrink-0 ${alert.type === 'High' ? 'bg-red-500 animate-pulse' : 'bg-orange-500'
                                        }`}></div>
                                    <div>
                                        <p className="font-bold text-sm">{alert.location}</p>
                                        <p className="text-sm opacity-90">{alert.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-green-600 bg-green-50 rounded-2xl border border-green-100">
                            <p className="font-medium">No active health alerts in your area. Stay safe!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Lifestyle Stats Row */}
            <div className="bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-3xl p-8 shadow-2xl text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                <h3 className="text-2xl font-bold mb-8 relative z-10 text-center">Community Lifestyle Snapshot</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                    <div className="text-center group">
                        <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition backdrop-blur-sm">
                            <Moon size={32} className="text-indigo-100" />
                        </div>
                        <div className="text-5xl font-black mb-1">{data?.lifestyle?.sleep || '0'}h</div>
                        <div className="text-indigo-200 font-medium">Avg Sleep</div>
                    </div>

                    <div className="text-center group">
                        <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition backdrop-blur-sm">
                            <Droplets size={32} className="text-blue-100" />
                        </div>
                        <div className="text-5xl font-black mb-1">{data?.lifestyle?.water || '0'}L</div>
                        <div className="text-blue-200 font-medium">Avg Water</div>
                    </div>

                    <div className="text-center group">
                        <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition backdrop-blur-sm">
                            <Activity size={32} className="text-emerald-100" />
                        </div>
                        <div className="text-5xl font-black mb-1">{data?.lifestyle?.steps?.toLocaleString() || '0'}</div>
                        <div className="text-emerald-200 font-medium">Avg Steps</div>
                    </div>
                </div>

                <div className="mt-8 text-center bg-white/10 py-3 rounded-full backdrop-blur-md border border-white/10 max-w-md mx-auto">
                    <p className="text-sm font-medium">Dominant Community Mood: <span className="text-yellow-300 font-bold text-lg">{data?.lifestyle?.dominantMood}</span></p>
                </div>
            </div>

            <div className="text-center pt-2 pb-4 text-xs text-gray-400">
                <p>🛡️ Privacy First: All trend data is aggregated and completely anonymized.</p>
            </div>
        </div>
    );
};

export default Trends;
