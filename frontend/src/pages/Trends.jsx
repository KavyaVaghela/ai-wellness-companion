import { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../config';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertTriangle, TrendingUp, Activity, Moon, Droplets, MapPin, Info, ShieldAlert, CheckCircle } from 'lucide-react';

const Trends = () => {
    const [realData, setRealData] = useState(null); // Rename state to realData
    const [displayData, setDisplayData] = useState(null); // Data to show
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('Global');

    useEffect(() => {
        const fetchTrends = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get(`${API_URL}/api/trends/stats`, config);
                setRealData(data);
                setDisplayData(data); // Default to real data
                setLoading(false);
            } catch (error) {
                console.error("Trends Error:", error);
                setLoading(false);
            }
        };
        fetchTrends();
    }, []);

    // Filter Logic (Simulation for Demo)
    useEffect(() => {
        if (!realData) return;

        if (filter === 'Global') {
            setDisplayData(realData);
        } else if (filter === 'City') {
            // Simulate Urban Data: High Stress, Low Steps
            setDisplayData({
                ...realData,
                aiSummary: "City analysis shows elevated stress levels and lower activity due to urban commute. Air quality is a concern.",
                riskLevel: 'Moderate',
                symptoms: realData.symptoms.map(s => ({ ...s, count: Math.round(s.count * 1.2) })), // More symptoms in city
                lifestyle: {
                    ...realData.lifestyle,
                    steps: Math.max(2000, realData.lifestyle.steps - 1500), // People drive more
                    sleep: 6.2
                },
                alerts: [
                    { type: 'Medium', message: 'Urban AQI is Poor. Wear masks.', location: 'City Center' },
                    ...realData.alerts
                ]
            });
        } else if (filter === 'Campus') {
            // Simulate Student Data: No Sleep, High Caffeine/Anxiety
            setDisplayData({
                ...realData,
                aiSummary: "Campus alert: Sleep deprivation is peaking due to exam season. Caffeine intake is unusually high.",
                riskLevel: 'High',
                symptoms: realData.symptoms.map(s => ({ ...s, count: s.name.includes('Headache') ? s.count * 2 : s.count })),
                lifestyle: {
                    ...realData.lifestyle,
                    sleep: 4.5, // Students don't sleep
                    water: 1.2,
                    mood: 'Stressed'
                },
                alerts: [
                    { type: 'High', message: 'Exam stress wave detected. Take breaks.', location: 'University Library' },
                    { type: 'Medium', message: 'Flu spreading in dorms.', location: 'North Campus' }
                ]
            });
        }
    }, [filter, realData]);

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="animate-spin text-teal-600"><Activity size={40} /></div>
        </div>
    );

    // Dynamic Colors based on risk
    const getRiskColor = (level) => {
        if (level === 'High') return 'bg-red-100 text-red-700 border-red-200';
        if (level === 'Moderate') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        return 'bg-green-100 text-green-700 border-green-200';
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-xl shadow-xl border border-gray-100 text-sm">
                    <p className="font-bold text-gray-800">{label}</p>
                    <p className="text-teal-600">Reported: {payload[0].value} times</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 animate-fadeIn space-y-8">

            {/* 1. Page Title & Context */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <TrendingUp className="text-teal-600" /> Community Health Insights
                    </h1>
                    <p className="text-gray-500 mt-2 text-lg">AI-powered trends and early warnings based on anonymized data.</p>
                </div>

                {/* 7. Scalability Filter */}
                <div className="bg-white p-1 rounded-lg border border-gray-200 flex items-center shadow-sm">
                    <MapPin size={16} className="ml-3 text-gray-400" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-transparent px-3 py-2 text-sm font-semibold text-gray-700 focus:outline-none cursor-pointer"
                    >
                        <option value="Global">Global View</option>
                        <option value="City">City Level (Demo)</option>
                        <option value="Campus">Campus Level (Demo)</option>
                    </select>
                </div>
            </div>

            {/* 2. AI Community Summary Card */}
            <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10"><Activity size={150} /></div>
                <div className="relative z-10 max-w-4xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                            <Activity size={24} className="text-indigo-100" />
                        </div>
                        <h2 className="text-xl font-bold text-indigo-100 tracking-wide uppercase text-sm">AI Community Intelligence</h2>
                    </div>
                    <p className="text-2xl md:text-3xl font-medium leading-relaxed font-light">
                        "{displayData?.aiSummary || "Analyzing community patterns..."}"
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Stats & Charts */}
                <div className="lg:col-span-2 space-y-8">

                    {/* 3. Community Risk Level */}
                    <div className={`p-6 rounded-2xl border-l-8 flex items-center justify-between shadow-sm ${getRiskColor(displayData?.riskLevel)}`}>
                        <div>
                            <h3 className="text-sm font-bold uppercase opacity-80 mb-1">Community Risk Level</h3>
                            <p className="text-4xl font-black tracking-tight">{displayData?.riskLevel || 'Calculating...'}</p>
                            <p className="text-sm mt-2 font-medium opacity-90 flex items-center gap-2">
                                <Info size={14} /> Calculated using symptom frequency & lifestyle trends.
                            </p>
                        </div>
                        <ShieldAlert size={64} className="opacity-20" />
                    </div>

                    {/* 4. Common Symptoms Trend */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            Most Reported Symptoms <span className="text-sm font-normal text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">Last 7 Days</span>
                        </h3>

                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={displayData?.symptoms || []} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="count" fill="#0d9488" radius={[0, 4, 4, 0]} barSize={32}>
                                        {displayData?.symptoms?.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 0 ? '#0f766e' : '#14b8a6'} /> // Darker for top result
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* 1-Line AI Interpretation */}
                        {displayData?.symptoms?.length > 0 && (
                            <div className="mt-6 p-4 bg-teal-50 rounded-xl flex gap-3 text-teal-800 text-sm font-medium">
                                <CheckCircle size={18} className="shrink-0 mt-0.5" />
                                <p>"{displayData.symptoms[0].name}" is the most commonly reported symptom this week. Preventive caution is advised.</p>
                            </div>
                        )}
                    </div>

                </div>

                {/* Right Column: Alerts & Lifestyle */}
                <div className="space-y-8">

                    {/* 5. Regional Alerts */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <AlertTriangle size={20} className="text-orange-500" /> Active Alerts
                        </h3>
                        <div className="space-y-3">
                            {displayData?.alerts?.length > 0 ? displayData.alerts.map((alert, idx) => (
                                <div key={idx} className={`p-4 rounded-xl border-l-4 ${alert.type === 'High' ? 'bg-red-50 border-red-500 text-red-800' : 'bg-yellow-50 border-yellow-500 text-yellow-800'}`}>
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-white/50">{alert.type} Alert</span>
                                        <span className="text-xs opacity-70 flex items-center gap-1"><MapPin size={10} /> {alert.location}</span>
                                    </div>
                                    <p className="font-semibold text-sm leading-snug">{alert.message}</p>
                                </div>
                            )) : (
                                <div className="p-4 bg-green-50 text-green-700 rounded-xl text-center text-sm font-medium">
                                    No active public health alerts.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 6. Community Lifestyle Snapshot */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-6">Community Lifestyle</h3>
                        <div className="space-y-6">

                            {/* Sleep */}
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-500 flex items-center gap-2"><Moon size={16} /> Sleep</span>
                                    <span className={`font-bold ${displayData?.lifestyle?.sleep < 6.5 ? 'text-red-500' : 'text-gray-700'}`}>
                                        {displayData?.lifestyle?.sleep < 6.5 ? 'Needs Attention' : 'Healthy'} ({displayData?.lifestyle?.sleep}h)
                                    </span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${displayData?.lifestyle?.sleep < 6.5 ? 'bg-red-400' : 'bg-indigo-400'}`} style={{ width: `${(displayData?.lifestyle?.sleep / 9) * 100}%` }}></div>
                                </div>
                            </div>

                            {/* Water */}
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-500 flex items-center gap-2"><Droplets size={16} /> Hydration</span>
                                    <span className={`font-bold ${displayData?.lifestyle?.water < 2 ? 'text-orange-500' : 'text-gray-700'}`}>
                                        {displayData?.lifestyle?.water < 2 ? 'Poor' : 'Good'} ({displayData?.lifestyle?.water}L)
                                    </span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${displayData?.lifestyle?.water < 2 ? 'bg-orange-400' : 'bg-blue-400'}`} style={{ width: `${(displayData?.lifestyle?.water / 4) * 100}%` }}></div>
                                </div>
                            </div>

                            {/* Steps */}
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-500 flex items-center gap-2"><Activity size={16} /> Activity</span>
                                    <span className={`font-bold ${displayData?.lifestyle?.steps < 5000 ? 'text-yellow-600' : 'text-gray-700'}`}>
                                        {displayData?.lifestyle?.steps < 5000 ? 'Low' : 'Active'} ({displayData?.lifestyle?.steps} avg)
                                    </span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${displayData?.lifestyle?.steps < 5000 ? 'bg-yellow-400' : 'bg-emerald-400'}`} style={{ width: `${(displayData?.lifestyle?.steps / 10000) * 100}%` }}></div>
                                </div>
                            </div>

                        </div>
                        <p className="text-xs text-gray-400 mt-6 text-center italic">
                            "Overall community lifestyle indicators suggest elevated stress levels."
                        </p>
                    </div>

                </div>
            </div>

            {/* 8. Disclaimer Footer */}
            <div className="text-center pt-8 pb-4 border-t border-gray-200">
                <p className="text-xs text-gray-400">
                    All insights are based on anonymized user data and are provided for awareness only. This is not medical advice.
                </p>
            </div>

        </div>
    );
};

export default Trends;
