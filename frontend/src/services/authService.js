import axios from 'axios';

const API_URL = "http://localhost:5000/api/auth";

export const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    // Use sessionStorage instead of localStorage for per-tab sessions
    sessionStorage.setItem("token", res.data.token);
    sessionStorage.setItem("user", JSON.stringify(res.data.user));

    // Set default header for future requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

    return res.data;
};

export const signup = async (name, email, password, role, businessName = null) => {
    const payload = { name, email, password, role };

    // Add businessName for wholesalers and retailers
    if (role === 'wholesaler' || role === 'retailer') {
        if (businessName) {
            payload.businessName = businessName;
        }
        // For retailers, also set storeName to businessName if not provided
        if (role === 'retailer' && businessName) {
            payload.storeName = businessName;
        }
    }

    const res = await axios.post(`${API_URL}/signup`, payload);
    return res.data;
};

export const logout = () => {
    // Clear sessionStorage instead of localStorage
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
};

export const updateProfile = async (userData) => {
    const token = sessionStorage.getItem("token");
    const res = await axios.put(`${API_URL}/me`, userData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    // Update local storage if successful
    if (res.data.success) {
        sessionStorage.setItem("user", JSON.stringify(res.data.user));
    }
    return res.data;
};
