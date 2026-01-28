import { Phone, MapPin, AlertCircle } from 'lucide-react';

const Emergency = () => {
    return (
        <div className="max-w-2xl mx-auto text-center space-y-8 py-8">
            <div className="inline-block p-4 bg-red-100 text-red-600 rounded-full animate-pulse">
                <AlertCircle size={48} />
            </div>

            <h1 className="text-3xl font-bold text-gray-900">Emergency Help Center</h1>
            <p className="text-gray-600">
                If you are facing a medical emergency, please contact the numbers below immediately.
            </p>

            <div className="grid gap-4">
                <a href="tel:102" className="flex items-center justify-between p-6 bg-red-600 text-white rounded-2xl shadow-lg hover:bg-red-700 transition">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-full">
                            <Phone size={24} />
                        </div>
                        <div className="text-left">
                            <p className="text-sm opacity-90">Ambulance</p>
                            <p className="text-2xl font-bold">102</p>
                        </div>
                    </div>
                    <span className="font-semibold">Call Now</span>
                </a>

                <a href="tel:112" className="flex items-center justify-between p-6 bg-blue-600 text-white rounded-2xl shadow-lg hover:bg-blue-700 transition">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-full">
                            <Phone size={24} />
                        </div>
                        <div className="text-left">
                            <p className="text-sm opacity-90">General Emergency</p>
                            <p className="text-2xl font-bold">112</p>
                        </div>
                    </div>
                    <span className="font-semibold">Call Now</span>
                </a>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-left">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <MapPin size={18} /> Nearby Hospitals (Demo)
                </h3>
                <ul className="space-y-4">
                    <li className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <p className="font-bold text-gray-800">City General Hospital</p>
                        <p className="text-sm text-gray-500">1.2 km away • Open 24/7</p>
                        <p className="text-sm text-blue-600 mt-1">Navigate</p>
                    </li>
                    <li className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <p className="font-bold text-gray-800">Apollo Clinic</p>
                        <p className="text-sm text-gray-500">2.5 km away • Open until 10 PM</p>
                        <p className="text-sm text-blue-600 mt-1">Navigate</p>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Emergency;
