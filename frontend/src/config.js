// In production (Vercel), the backend is served at /api
// This allows it to work dynamically on any Vercel domain
let apiUrl = import.meta.env.VITE_API_URL;

if (import.meta.env.PROD) {
    // If no explicit env var, or if it was localhost, use relative path
    if (!apiUrl || apiUrl.includes('localhost')) {
        apiUrl = '/api';
    }
} else {
    // Local development fallback
    apiUrl = apiUrl || 'http://localhost:5000';
}

const API_URL = apiUrl.replace(/\/$/, '');

console.log("Current API_URL:", API_URL);

export default API_URL;
