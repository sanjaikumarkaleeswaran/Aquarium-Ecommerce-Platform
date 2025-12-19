import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { login as apiLogin, logout as apiLogout } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local/session storage on mount
        const storedUser = sessionStorage.getItem('user');
        const storedToken = sessionStorage.getItem('token');

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const data = await apiLogin(email, password);
            setUser(data.user);
            setToken(data.token);
            // apiLogin already sets sessionStorage
            return data;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        apiLogout(); // Clears sessionStorage
        setUser(null);
        setToken(null);
    };

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
