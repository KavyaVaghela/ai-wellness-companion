const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

console.log("Current API_URL:", API_URL);
if (import.meta.env.PROD && API_URL.includes("localhost")) {
    console.warn("WARNING: Production build is using localhost API URL. Check your .env files!");
}


export default API_URL;
