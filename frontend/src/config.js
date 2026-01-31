// Fallback to Render URL in production if env var is missing or localhost
let envUrl = import.meta.env.VITE_API_URL;
if (import.meta.env.PROD && (!envUrl || envUrl.includes('localhost'))) {
    envUrl = 'https://ai-wellness-companion-wg4w.onrender.com';
}

const API_URL = (envUrl || 'http://localhost:5000').replace(/\/$/, '');

console.log("Current API_URL:", API_URL);
if (import.meta.env.PROD && API_URL.includes("localhost")) {
    console.warn("WARNING: Production build is using localhost API URL. Check your .env files!");
}


export default API_URL;
