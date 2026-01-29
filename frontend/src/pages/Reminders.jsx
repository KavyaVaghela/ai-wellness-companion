import { useState } from 'react';
import { Bell, Plus, Trash2, Clock } from 'lucide-react';

const Reminders = () => {
    const [reminders, setReminders] = useState([
        { id: 1, type: 'Water', label: 'Drink Water', time: '09:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
        { id: 2, type: 'Rest', label: 'Take a break', time: '14:00', days: ['Mon', 'Fri'] }
    ]);
    const [showForm, setShowForm] = useState(false);
    const [newReminder, setNewReminder] = useState({ type: 'Water', label: '', time: '', days: [] });

    const handleDelete = (id) => {
        setReminders(reminders.filter(r => r.id !== id));
    };

    const handleAdd = (e) => {
        e.preventDefault();
        setReminders([...reminders, { ...newReminder, id: Date.now(), days: ['Everyday'] }]); // Simplified days logic
        setShowForm(false);
        setNewReminder({ type: 'Water', label: '', time: '', days: [] });
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
                    <div key={reminder.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
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
                        <button onClick={() => handleDelete(reminder.id)} className="text-gray-400 hover:text-red-500 transition">
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
