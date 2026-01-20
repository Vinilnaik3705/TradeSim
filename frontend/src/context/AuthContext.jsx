import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const AuthContext = createContext(null);
const API_URL = API_BASE_URL;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for persisted user on mount
    useEffect(() => {
        const checkUserLoggedIn = async () => {
            const token = localStorage.getItem('tradeSimToken');
            if (token) {
                try {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    };
                    const res = await axios.get(`${API_URL}/me`, config);
                    setUser(res.data);
                } catch (error) {
                    console.error('Token verification failed:', error);
                    localStorage.removeItem('tradeSimToken');
                }
            }
            setLoading(false);
        };

        checkUserLoggedIn();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
            if (res.data.token) {
                localStorage.setItem('tradeSimToken', res.data.token);
                // We typically get the user object back too, or we can fetch it
                // Based on controller, we get { _id, name, email, role, token }
                setUser(res.data);
                return { success: true };
            }
        } catch (error) {
            console.error('Login error:', error.response?.data?.message || error.message);
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (name, email, password) => {
        try {
            const res = await axios.post(`${API_URL}/api/auth/register`, {name,email,password});
            if (res.data.token) {
                localStorage.setItem('tradeSimToken', res.data.token);
                setUser(res.data);
                return { success: true };
            }
        } catch (error) {
            console.error('Registration error:', error.response?.data?.message || error.message);
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('tradeSimToken');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
