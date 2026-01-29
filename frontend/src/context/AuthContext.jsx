import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            console.log(`Attempting login to: ${API_URL}/api/auth/login`);
            const { data } = await axios.post(`${API_URL}/api/auth/login`, {
                email,
                password,
            });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true, isOnboardingComplete: data.isOnboardingComplete };
        } catch (error) {
            console.error("Login Debug Error:", error);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (userData) => {
        try {
            console.log(`Attempting register to: ${API_URL}/api/auth/register`);
            const { data } = await axios.post(`${API_URL}/api/auth/register`, userData);
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            console.error("Register Debug Error:", error);
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const updateProfile = async (profileData) => {
        try {
            const { data } = await axios.put(`${API_URL}/api/auth/profile`, profileData);
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            console.error("Update Profile Error:", error);
            return {
                success: false,
                message: error.response?.data?.message || 'Update failed'
            };
        }
    };

    const googleLogin = async (credentialResponse) => {
        try {
            // In a real app, verify token with backend:
            // const { data } = await axios.post(`${API_URL}/api/auth/google`, { token: credentialResponse.credential });

            // SIMULATION for now since we don't have a verified Google Console Setup:
            // We decoded the token on frontend normally, but here I'll simulate a successful login/signup 
            // with a dummy structure usually returned by Google.
            console.log("Google Credential Response:", credentialResponse);

            // Decoded JWT typically contains: name, email, picture, sub (googleId)
            // Implementation: We will just MOCK a login success for the UI flow demonstration 
            // unless the user provided a real backend implementation.
            // Since I added `POST /google` to plan but didn't implement logic yet (it's complex), 
            // I'll stick to a placeholder that *looks* like it works if the button is clicked.

            // Wait, for this to actually work, I need to send the token to backend. 
            // I'll implement a basic backend handler later. 
            // For now, assume backend returns user data.

            // Simple mock for "demo" purposes if backend not ready:
            alert("Google Login requires a valid Client ID and Backend verification. \n\nCheck console for token.");
            return { success: false, message: "Google Login not fully configured yet." };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, googleLogin }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
