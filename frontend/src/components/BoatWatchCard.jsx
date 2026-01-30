import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';
import { Watch, RefreshCw, CheckCircle, Flame, Footprints, Moon, Heart } from 'lucide-react';

const BoatWatchCard = () => {
    const [connected, setConnected] = useState(false);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showHelp, setShowHelp] = useState(false);

    useEffect(() => {
        const checkConnection = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
                const config = { headers: { Authorization: `Bearer ${token}` } };

                // Check if we have data (implies connection)
                const { data } = await axios.get(`${API_URL}/api/googlefit/data`, config);
                if (data && data.lastSyncedAt) {
                    setConnected(true);
                    setStats(data);
                }
            } catch (error) {
                setConnected(false);
            }
        };

        // Handle Success Redirect
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('connected') === 'true') {
            setConnected(true);
            window.history.replaceState({}, document.title, "/dashboard");
            // Trigger an immediate sync to fetch initial data
            handleSync();
        } else {
            checkConnection();
        }
    }, []);

    const handleConnect = async () => {
        setLoading(true);
        try {
            const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            // Get Backend Auth URL containing State (User ID)
            const { data } = await axios.get(`${API_URL}/api/googlefit/auth`, config);
            // Redirect User to Google
            window.location.href = data.url;
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleSync = async () => {
        setLoading(true);
        try {
            const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.post(`${API_URL}/api/googlefit/sync`, {}, config);
            setStats(data);
            if (!connected) setConnected(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-3xl p-6 shadow-lg relative overflow-hidden transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
                <h3 className="flex items-center gap-2 font-bold text-lg">
                    <Watch className="text-red-500" /> boAt Watch Integration
                </h3>
                <div className="flex items-center gap-2">
                    <button onClick={() => setShowHelp(!showHelp)} className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-full transition">
                        {showHelp ? 'Hide Guide' : 'How to Sync?'}
                    </button>
                    {connected && (
                        <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle size={12} /> Connected
                        </span>
                    )}
                </div>
            </div>

            {showHelp && (
                <div className="bg-gray-800/80 p-4 rounded-2xl mb-6 text-sm text-gray-300 space-y-2 border border-gray-700 animate-fadeIn">
                    <p className="font-bold text-white mb-2">⚡ How to get Real-Time Data:</p>
                    <ol className="list-decimal pl-5 space-y-1">
                        <li>Open <strong>boAt Crest App</strong> on your phone.</li>
                        <li>Go to <strong>Settings</strong> {'>'} <strong>Link with Google Fit</strong>.</li>
                        <li>Enable all data permissions.</li>
                        <li>Come back here and click <strong>"Sync Now"</strong>.</li>
                    </ol>
                    <p className="text-xs text-gray-500 mt-2 italic">Note: Real-time speed depends on how often the boAt app syncs to Google.</p>
                </div>
            )}

            {!connected ? (
                <div className="text-center py-4">
                    <p className="text-gray-400 text-sm mb-4">Connect your boAt app via Google Fit to sync vitals.</p>
                    <button
                        onClick={handleConnect}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-bold text-sm transition shadow-lg"
                    >
                        {loading ? 'Connecting...' : 'Connect boAt Watch'}
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 p-3 rounded-xl flex flex-col items-center">
                        <Heart className="text-red-400 mb-1" size={20} />
                        <span className="text-2xl font-bold">{stats?.heartRate || '--'}</span>
                        <span className="text-xs text-gray-400">BPM</span>
                    </div>
                    <div className="bg-white/10 p-3 rounded-xl flex flex-col items-center">
                        <Footprints className="text-blue-400 mb-1" size={20} />
                        <span className="text-2xl font-bold">{stats?.steps || 0}</span>
                        <span className="text-xs text-gray-400">Steps</span>
                    </div>
                    <div className="bg-white/10 p-3 rounded-xl flex flex-col items-center">
                        <Flame className="text-orange-400 mb-1" size={20} />
                        <span className="text-2xl font-bold">{stats?.calories || 0}</span>
                        <span className="text-xs text-gray-400">Kcal</span>
                    </div>
                    <div className="bg-white/10 p-3 rounded-xl flex flex-col items-center">
                        <Moon className="text-indigo-400 mb-1" size={20} />
                        <span className="text-2xl font-bold">{stats?.sleepHours || 0}h</span>
                        <span className="text-xs text-gray-400">Sleep</span>
                    </div>

                    <button
                        onClick={handleSync}
                        disabled={loading}
                        className="col-span-2 mt-2 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 py-2 rounded-xl text-sm font-medium transition"
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> {loading ? 'Syncing...' : 'Sync Now'}
                    </button>
                    <p className="col-span-2 text-center text-xs text-gray-500 mt-1">
                        Last synced: {stats?.lastSyncedAt ? new Date(stats.lastSyncedAt).toLocaleTimeString() : 'Never'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default BoatWatchCard;
