import { useState } from 'react';
import { MessageSquare, X, Send, Minimize2, Sparkles } from 'lucide-react';
import axios from 'axios';
import API_URL from '../config';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! I am your AI Health Assistant. How can I help you today?", isBot: true }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false); // New state for typing indicator

    const handleSend = async (e) => { // Make handleSend async
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { text: input, isBot: false };
        // Add user message
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput(''); // Clear input immediately
        setIsOpen(true); // Ensure chatbot is open
        setIsTyping(true); // Show typing indicator

        try {
            const token = JSON.parse(localStorage.getItem('userInfo'))?.token;

            // Prepare history for context, mapping to 'role' and 'parts' for the API
            const history = newMessages.slice(-6).map(m => ({
                role: m.isBot ? 'model' : 'user', // Map isBot to 'model' or 'user'
                parts: [{ text: m.text }]
            }));

            const { data } = await axios.post(`${API_URL}/api/chat`, {
                message: userMsg.text, // Send the user's message text
                history
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const botMessage = {
                text: data.reply, // Assuming API returns { reply: "..." }
                isBot: true
            };
            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error("Chat Error:", error);
            const errorMessage = {
                text: "I'm having trouble connecting to the server. Please try again.",
                isBot: true
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false); // Hide typing indicator
        }
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
                            <div key={idx} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'} `}>
                                <div className={`max - w - [80 %] p - 3 rounded - 2xl text - sm ${msg.isBot ? 'bg-white border border-gray-200 text-gray-700 rounded-tl-none' : 'bg-teal-600 text-white rounded-tr-none'} `}>
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
