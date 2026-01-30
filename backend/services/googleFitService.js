const axios = require('axios');
const querystring = require('querystring');

const getAuthURL = (userId) => {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
        redirect_uri: process.env.GOOGLE_FIT_CALLBACK_URL,
        client_id: process.env.GOOGLE_FIT_CLIENT_ID,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        state: userId, // Pass User ID to persist session across redirect
        scope: [
            "https://www.googleapis.com/auth/fitness.activity.read",
            "https://www.googleapis.com/auth/fitness.body.read",
            "https://www.googleapis.com/auth/fitness.sleep.read",
            "https://www.googleapis.com/auth/fitness.heart_rate.read"
        ].join(" ")
    };
    return `${rootUrl}?${querystring.stringify(options)}`;
};

const getTokens = async (code) => {
    const url = "https://oauth2.googleapis.com/token";
    const values = {
        code,
        client_id: process.env.GOOGLE_FIT_CLIENT_ID,
        client_secret: process.env.GOOGLE_FIT_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_FIT_CALLBACK_URL,
        grant_type: "authorization_code",
    };

    try {
        const res = await axios.post(url, querystring.stringify(values), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        return res.data;
    } catch (error) {
        console.error("Failed to fetch tokens", error.response?.data || error.message);
        throw new Error(error.message);
    }
};

const refreshAccessToken = async (refreshToken) => {
    const url = "https://oauth2.googleapis.com/token";
    const values = {
        client_id: process.env.GOOGLE_FIT_CLIENT_ID,
        client_secret: process.env.GOOGLE_FIT_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
    };

    try {
        const res = await axios.post(url, querystring.stringify(values), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        return res.data.access_token;
    } catch (error) {
        console.error("Failed to refresh token", error.response?.data || error.message);
        throw new Error("Could not refresh access token");
    }
}

const fetchFitnessData = async (accessToken) => {
    // 1. Get Data Sources (Start & End Time for today)
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0)).getTime() * 1000000; // Nanoseconds
    const endOfDay = new Date(now.setHours(23, 59, 59, 999)).getTime() * 1000000;

    const datasetId = `${startOfDay}-${endOfDay}`;

    try {
        const headers = { Authorization: `Bearer ${accessToken}` };

        // Fetch Steps
        // Note: Real Google Fit API requires aggregating data sources. 
        // For hackathon simplicity, we might hit the aggregate endpoint.

        const aggregateUrl = "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate";
        const body = {
            aggregateBy: [
                { dataTypeName: "com.google.step_count.delta" },
                { dataTypeName: "com.google.calories.expended" },
                { dataTypeName: "com.google.heart_rate.bpm" }
            ],
            bucketByTime: { durationMillis: 86400000 }, // Daily bucket
            startTimeMillis: new Date().setHours(0, 0, 0, 0),
            endTimeMillis: new Date().getTime()
        };

        const res = await axios.post(aggregateUrl, body, { headers });

        const bucket = res.data.bucket[0];

        let steps = 0;
        let calories = 0;
        let heartRate = 0;

        if (bucket && bucket.dataset) {
            // Steps
            if (bucket.dataset[0].point.length > 0) {
                steps = bucket.dataset[0].point[0].value[0].intVal || 0;
            }
            // Calories
            if (bucket.dataset[1].point.length > 0) {
                calories = Math.round(bucket.dataset[1].point[0].value[0].fpVal || 0);
            }
            // Heart Rate (Average)
            if (bucket.dataset[2].point.length > 0) {
                heartRate = Math.round(bucket.dataset[2].point[0].value[0].fpVal || 0);
            }
        }

        // Mocking Sleep (Google Fit Sleep API is complex, use heuristic or mock if empty)
        const sleepHours = 7.5;

        return { steps, calories, heartRate, sleepHours };

    } catch (error) {
        console.error("Error fetching fitness data:", error.response?.data || error.message);
        throw new Error("Failed to fetch fitness data");
    }
};

module.exports = { getAuthURL, getTokens, refreshAccessToken, fetchFitnessData };
