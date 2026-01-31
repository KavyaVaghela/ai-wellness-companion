const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.warn("⚠️ GEMINI_API_KEY is missing in environment variables.");
} else {
    console.log(`✅ Gemini API Initialized (Key starts with: ${apiKey.substring(0, 4)}...)`);
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const getChatResponse = async (history, message) => {
    try {
        console.log("------- GEMINI REQUEST -------");
        console.log("Message:", message);

        // Sanitize History for Gemini
        let formattedHistory = (history || []).map(msg => ({
            role: (msg.role === 'assistant' || msg.role === 'model') ? 'model' : 'user',
            parts: [{ text: typeof msg.content === 'string' ? msg.content : (msg.parts?.[0]?.text || "") }]
        })).filter(msg => msg.parts[0].text);

        // Gemini history MUST start with a user message.
        // If the first message is from the model, remove it.
        while (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
            formattedHistory.shift();
        }

        const chat = model.startChat({
            history: formattedHistory,
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Chat Error Details:", error);
        return "I'm experiencing a temporary connection issue. (" + error.message + ")";
    }
};

const analyzeSymptoms = async (symptoms, severity = 'Unknown', duration = 'Unknown') => {
    try {
        const prompt = `
        Act as a preliminary medical wellness assistant. The user is reporting the following symptoms: ${symptoms.join(', ')}.
        Severity: ${severity}
        Duration: ${duration}
        
        Provide a concise, empathetic response including:
        1. Potential causes (mentioning common benign issues first).
        2. Suggested home remedies or lifestyle adjustments.
        3. Clear guidance on when to see a doctor (red flags).
        
        IMPORTANT: Start with a disclaimer that you are an AI and this is not professional medical advice.
        Keep the tone calm, helpful, and reassuring.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Symptom Error:", error);
        return "I couldn't analyze those symptoms right now. Please consult a medical professional.";
    }
};

const analyzeTrends = async (stats) => {
    try {
        const prompt = `
        Analyze the following community health statistics and provide a short, engaging summary (max 3 sentences) for a wellness dashboard.
        Data: ${JSON.stringify(stats)}
        Focus on the positive trends or give a gentle nudge if stats are low. Use emojis.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        return "Community trends look interesting today! Stay active and hydrated!";
    }
}

const getDashboardInsight = async (userStats) => {
    try {
        const prompt = `
        The user has the following health stats today:
        Sleep: ${userStats.sleep || 'Unknown'} hours
        Water: ${userStats.water || 'Unknown'} Liters
        Steps: ${userStats.steps || 0}
        Mood: ${userStats.mood || 'Neutral'}
        
        Generate a ONE SENTENCE, friendly, human-like insight.
        Example: "Your sleep was low last night, try to get to bed early today."
        Example: "Great job on water intake, keep it up!"
        Do not sound robotic. Do not prescribe medical advice.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        return "Keep tracking your habits to see more insights!";
    }
};

module.exports = { getChatResponse, analyzeSymptoms, analyzeTrends, getDashboardInsight };
