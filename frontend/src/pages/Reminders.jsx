import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import API_URL from '../config';
import { Bell, Plus, Trash2, Clock } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Reminders = () => {
    const { user } = useContext(AuthContext);
    const [reminders, setReminders] = useState([]);

    useEffect(() => {
        const fetchReminders = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
                const { data } = await axios.get(`${API_URL}/api/reminders`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setReminders(data);
            } catch (error) {
                console.error("Error fetching reminders", error);
            }
        };
        fetchReminders();
    }, []);
    const [showForm, setShowForm] = useState(false);
    const [newReminder, setNewReminder] = useState({ type: 'Water', label: '', time: '', days: [] });

    const handleDelete = async (id) => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
            await axios.delete(`${API_URL}/api/reminders/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReminders(reminders.filter(r => r._id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const { data } = await axios.post(`${API_URL}/api/reminders`, {
                ...newReminder,
                days: ['Everyday']
            }, config);

            setReminders([...reminders, data]);
            setShowForm(false);
            setNewReminder({ type: 'Water', label: '', time: '', days: [] });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <Bell className="text-orange-500" /> Reminders
                </h1>
                <button onClick={() => setShowForm(!showForm)} className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-700 transition">
                    <Plus size={18} /> Add New
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-6 animate-fade-in">
                    <h3 className="font-bold mb-4">Create Reminder</h3>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Type</label>
                            <select className="w-full p-2 border rounded-lg" value={newReminder.type} onChange={e => setNewReminder({ ...newReminder, type: e.target.value })}>
                                <option>Water</option>
                                <option>Rest</option>
                                <option>Exercise</option>
                                <option>Medication</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Label</label>
                            <input type="text" className="w-full p-2 border rounded-lg" placeholder="e.g. Drink 1 Glass" value={newReminder.label} onChange={e => setNewReminder({ ...newReminder, label: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Time</label>
                            <input type="time" className="w-full p-2 border rounded-lg" value={newReminder.time} onChange={e => setNewReminder({ ...newReminder, time: e.target.value })} required />
                        </div>
                        <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600">Save Reminder</button>
                    </form>
                </div>
            )}

            <div className="space-y-4">
                {reminders.map(reminder => (
                    <div key={reminder._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-full ${reminder.type === 'Water' ? 'bg-blue-100 text-blue-600' : reminder.type === 'Exercise' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'}`}>
                                <Clock size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">{reminder.label}</h3>
                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                    <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">{reminder.time}</span>
                                    • {reminder.type}
                                </p>
                            </div>
                        </div>
                        <button onClick={() => handleDelete(reminder._id)} className="text-gray-400 hover:text-red-500 transition">
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}

                {reminders.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                        <Bell className="mx-auto mb-2 opacity-20" size={48} />
                        No reminders set.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reminders;
