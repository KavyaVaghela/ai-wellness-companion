import { useState, useContext, useEffect } from 'react';
import { Phone, MapPin, AlertCircle, Edit2, Save, User as UserIcon, Mail, PhoneCall } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Emergency = () => {
    const { user, updateProfile } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [contact, setContact] = useState({
        name: '',
        phone: '',
        relationship: '',
        email: ''
    });

    useEffect(() => {
        if (user && user.emergencyContact) {
            setContact({
                name: user.emergencyContact.name || '',
                phone: user.emergencyContact.phone || '',
                relationship: user.emergencyContact.relationship || '',
                email: user.emergencyContact.email || ''
            });
        }
    }, [user]);

    const handleSave = async () => {
        if (!contact.name || !contact.phone) {
            alert("Name and Phone are required.");
            return;
        }

        const result = await updateProfile({
            _id: user._id,
            emergencyContact: contact
        });

        if (result.success) {
            setIsEditing(false);
            alert("Emergency contact updated successfully.");
        } else {
            alert("Failed to update contact.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 py-8 px-4 animate-fadeIn">
            <div className="text-center space-y-4">
                <div className="inline-block p-4 bg-red-100 text-red-600 rounded-full animate-pulse">
                    <AlertCircle size={48} />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Emergency Help Center</h1>
                <p className="text-gray-600">
                    Quick access to help when you need it most.
                </p>
            </div>

            {/* 1. My Emergency Contact Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-red-100 overflow-hidden relative">
                <div className="bg-red-50 p-4 border-b border-red-100 flex justify-between items-center">
                    <h3 className="font-bold text-red-800 flex items-center gap-2">
                        <UserIcon size={20} /> My Primary SOS Contact
                    </h3>
                    <button
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition ${isEditing ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    >
                        {isEditing ? <><Save size={14} /> Save</> : <><Edit2 size={14} /> Edit</>}
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {isEditing ? (
                        <div className="grid gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Contact Name</label>
                                <input
                                    type="text"
                                    value={contact.name}
                                    onChange={(e) => setContact({ ...contact, name: e.target.value })}
                                    placeholder="e.g. Mom, John Doe"
                                    className="w-full p-3 rounded-xl bg-gray-50 border-gray-200 focus:ring-2 focus:ring-red-200 outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                                <input
                                    type="tel"
                                    value={contact.phone}
                                    onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                                    placeholder="+91 9876543210"
                                    className="w-full p-3 rounded-xl bg-gray-50 border-gray-200 focus:ring-2 focus:ring-red-200 outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Relationship</label>
                                    <input
                                        type="text"
                                        value={contact.relationship}
                                        onChange={(e) => setContact({ ...contact, relationship: e.target.value })}
                                        placeholder="e.g. Parent, Spouse"
                                        className="w-full p-3 rounded-xl bg-gray-50 border-gray-200 focus:ring-2 focus:ring-red-200 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Email (Optional)</label>
                                    <input
                                        type="email"
                                        value={contact.email}
                                        onChange={(e) => setContact({ ...contact, email: e.target.value })}
                                        placeholder="email@example.com"
                                        className="w-full p-3 rounded-xl bg-gray-50 border-gray-200 focus:ring-2 focus:ring-red-200 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-6">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${contact.name ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
                                {contact.name ? contact.name.charAt(0) : '?'}
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-900">{contact.name || 'No Contact Set'}</h4>
                                <p className="text-gray-500 flex items-center gap-2 mt-1">
                                    <PhoneCall size={14} /> {contact.phone || 'Add phone number'}
                                </p>
                                {contact.relationship && (
                                    <span className="inline-block mt-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">
                                        {contact.relationship}
                                    </span>
                                )}
                                {!contact.name && (
                                    <p className="text-xs text-red-500 mt-2 font-medium">Please add a contact to enable SOS alerts.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* General Helplines */}
            <div className="grid gap-4">
                <a href="tel:102" className="flex items-center justify-between p-6 bg-red-600 text-white rounded-2xl shadow-lg hover:bg-red-700 transition transform hover:scale-[1.02]">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-full">
                            <Phone size={24} />
                        </div>
                        <div className="text-left">
                            <p className="text-sm opacity-90">Ambulance</p>
                            <p className="text-2xl font-bold">102</p>
                        </div>
                    </div>
                    <span className="font-semibold bg-white/20 px-4 py-2 rounded-xl">Call</span>
                </a>

                <a href="tel:112" className="flex items-center justify-between p-6 bg-blue-600 text-white rounded-2xl shadow-lg hover:bg-blue-700 transition transform hover:scale-[1.02]">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-full">
                            <Phone size={24} />
                        </div>
                        <div className="text-left">
                            <p className="text-sm opacity-90">General Emergency</p>
                            <p className="text-2xl font-bold">112</p>
                        </div>
                    </div>
                    <span className="font-semibold bg-white/20 px-4 py-2 rounded-xl">Call</span>
                </a>
            </div>

            {/* Nearby Places Demo */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-left">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <MapPin size={18} /> Nearby Hospitals (Demo)
                </h3>
                <ul className="space-y-4">
                    <li className="pb-4 border-b border-gray-100 last:border-0 last:pb-0 flex justify-between items-center">
                        <div>
                            <p className="font-bold text-gray-800">City General Hospital</p>
                            <p className="text-sm text-gray-500">1.2 km away • Open 24/7</p>
                        </div>
                        <p className="text-sm text-blue-600 font-bold cursor-pointer hover:underline">Navigate</p>
                    </li>
                    <li className="pb-4 border-b border-gray-100 last:border-0 last:pb-0 flex justify-between items-center">
                        <div>
                            <p className="font-bold text-gray-800">Apollo Clinic</p>
                            <p className="text-sm text-gray-500">2.5 km away • Open until 10 PM</p>
                        </div>
                        <p className="text-sm text-blue-600 font-bold cursor-pointer hover:underline">Navigate</p>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Emergency;
