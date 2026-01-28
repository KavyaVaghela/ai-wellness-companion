import { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! I am your AI Health Assistant. How can I help you today?", isBot: true }
    ]);
    const [input, setInput] = useState('');

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { text: input, isBot: false };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Mock AI Response
        setTimeout(() => {
            let botText = "I see. It's important to stay hydrated and rest. Would you like to check your symptoms in detail?";
            if (input.toLowerCase().includes('headache')) botText = "Headaches can be caused by dehydration or stress. Try drinking water.";

            setMessages(prev => [...prev, { text: botText, isBot: true }]);
        }, 1000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-teal-600 text-white p-4 rounded-full shadow-lg hover:bg-teal-700 transition animate-bounce-slow"
                >
                    <MessageSquare size={28} />
                </button>
            )}

            {isOpen && (
                <div className="bg-white w-80 md:w-96 rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden max-h-[500px]">
                    {/* Header */}
                    <div className="bg-teal-600 text-white p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 p-1.5 rounded-full">
                                <MessageSquare size={18} />
                            </div>
                            <span className="font-semibold">Health Assistant</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-teal-700 p-1 rounded">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 p-4 overflow-y-auto h-80 bg-gray-50 flex flex-col gap-3">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.isBot ? 'bg-white border border-gray-200 text-gray-700 rounded-tl-none' : 'bg-teal-600 text-white rounded-tr-none'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                        <input
                            type="text"
                            className="flex-grow px-3 py-2 border rounded-full text-sm focus:outline-none focus:border-teal-500"
                            placeholder="Ask about health..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button type="submit" className="bg-teal-600 text-white p-2 rounded-full hover:bg-teal-700">
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
