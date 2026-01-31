import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
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
                password,
            });

            // Validate response
            if (typeof data === 'string' || !data.token) {
                console.error("Invalid Login Response (likely HTML):", data);
                throw new Error("Invalid Server Response. Check API URL.");
            }

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
            return { success: true, isOnboardingComplete: data.isOnboardingComplete };
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
            const { data } = await axios.post(`${API_URL}/api/auth/google`, {
                token: credentialResponse.credential
            });


            console.log("Google Login/Signup Success:", data);

            // Validate response
            if (typeof data === 'string' || !data.token) {
                console.error("Invalid Google Login Response (likely HTML):", data);
                throw new Error("Invalid Server Response. Check API URL.");
            }

            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);
            return { success: true, isOnboardingComplete: data.isOnboardingComplete };
        } catch (error) {
            console.error("Google Login Error Detailed:", error);

            let errorMessage = 'Google Login failed';

            if (error.code === "ERR_NETWORK") {
                errorMessage = `Network Error: Unable to connect to server at ${API_URL}. Check your internet connection or if the server is down (CORS issue?).`;
            } else if (error.response) {
                // Server responded with a status code that falls out of the range of 2xx
                errorMessage = error.response.data?.message || `Server Error: ${error.response.status}`;
            }

            return {
                success: false,
                message: errorMessage
            };
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
