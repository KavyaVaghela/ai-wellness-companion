const SYMPTOM_DATABASE = {
    "Headache": {
        causes: ["Dehydration", "Stress/Tension", "Lack of Sleep", "Eye Strain", "Sinus Congestion"],
        remedies: ["Drink water and rest in a dark room", "Apply a cold or warm compress", "Practice deep breathing or meditation", "Limit screen time"],
        doctor_triggers: ["Severe pain", "Vision loss", "Slurred speech", "Head injury"]
    },
    "Fever": {
        causes: ["Viral Infection (Flu, Cold)", "Bacterial Infection", "Heat Exhaustion", "Inflammation"],
        remedies: ["Stay hydrated with water/ORS", "Rest (complete bed rest)", "Tepid sponge bath", "Wear light clothing"],
        doctor_triggers: ["High grade (>103°F)", "Seizures", "Rash", "Difficulty breathing"]
    },
    "Cough": {
        causes: ["Common Cold", "Flu", "Allergies", "Pollution/Dust", "Acid Reflux"],
        remedies: ["Warm water with honey & ginger", "Steam inhalation", "Saltwater gargle", "Avoid cold foods"],
        doctor_triggers: ["Coughing blood", "Chest pain", "Shortness of breath", "Lasts > 3 weeks"]
    },
    "Cold": {
        causes: ["Viral Infection", "Allergies", "Weather Change"],
        remedies: ["Steam inhalation", "Warm soups and fluids", "Humidifier use", "Rest"],
        doctor_triggers: ["High fever", "Ear pain", "Sinus pain"]
    },
    "Fatigue": {
        causes: ["Lack of Sleep", "Poor Diet", "Stress", "Anemia", "Dehydration"],
        remedies: ["Prioritize 7-8 hours sleep", "Eat balanced meals", "Light exercise/walking", "Stay hydrated"],
        doctor_triggers: ["Unexplained weight loss", "Sudden confusion", "Chest pain"]
    },
    "Body Pain": {
        causes: ["Physical Exertion", "Viral Flu", "Stress", "Poor Posture"],
        remedies: ["Warm bath with Epsom salt", "Gentle stretching", "Rest the affected area", "Massage"],
        doctor_triggers: ["Severe swelling", "Redness", "Inability to move", "Fever"]
    },
    "Nausea": {
        causes: ["Food Poisoning", "Indigestion", "Motion Sickness", "Migraine"],
        remedies: ["Ginger tea or chews", "Bland foods (toast, rice)", "Hydrate with small sips", "Avoid strong smells"],
        doctor_triggers: ["Blood in vomit", "Severe abdominal pain", "Dehydration signs"]
    },
    "Shortness of Breath": {
        causes: ["Asthma", "Anxiety/Panic", "Allergies", "Respiratory Infection"],
        remedies: ["Sit upright and lean forward", "Pursed-lip breathing", "Stay calm", "Fresh air"],
        doctor_triggers: ["Chest pain", "Fainting", "Blue lips/nails", "Rapid worsening"]
    },
    "Breathing discomfort": { // Alternative name
        causes: ["Asthma", "Anxiety/Panic", "Allergies", "Respiratory Infection"],
        remedies: ["Sit upright and lean forward", "Pursed-lip breathing", "Stay calm", "Fresh air"],
        doctor_triggers: ["Chest pain", "Fainting", "Blue lips/nails", "Rapid worsening"]
    }
};

const getRuleBasedAnalysis = (symptoms) => {
    let causes = new Set();
    let remedies = new Set();
    let triggers = new Set();

    symptoms.forEach(sym => {
        // Simple fuzzy match or direct lookup
        const entry = SYMPTOM_DATABASE[sym] || SYMPTOM_DATABASE[sym.charAt(0).toUpperCase() + sym.slice(1)];
        if (entry) {
            entry.causes.forEach(c => causes.add(c));
            entry.remedies.forEach(r => remedies.add(`${sym}: ${r}`));
            entry.doctor_triggers.forEach(t => triggers.add(t));
        }
    });

    // Fallback if no exact match
    if (causes.size === 0) {
        causes.add("General fatigue or stress");
        remedies.add("General: Rest and hydration are usually helpful");
        triggers.add("Symptoms worsen rapidly");
    }

    return {
        aiAdvice: `Based on your symptoms (${symptoms.join(', ')}), here is what we found.`, // Placeholder for AI summary
        possibleCauses: Array.from(causes).slice(0, 5), // Top 5
        homeRemedies: Array.from(remedies).slice(0, 5), // Top 5
        whenToSeeDoctor: Array.from(triggers).slice(0, 4) // Top 4
    };
};

module.exports = { getRuleBasedAnalysis };
