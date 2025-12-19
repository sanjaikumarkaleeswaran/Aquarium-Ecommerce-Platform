import axios from 'axios';
const API_URL = "/api/users";

// Get current user profile
export const getCurrentUser = async () => {
    const token = sessionStorage.getItem("token");
    const res = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

// Update user profile
export const updateUserProfile = async (userData) => {
    const token = sessionStorage.getItem("token");
    const res = await axios.put(`${API_URL}/me`, userData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

// Get user's products (for wholesalers and retailers)
export const getUserProducts = async () => {
    const token = sessionStorage.getItem("token");
    const res = await axios.get(`/api/products/my/products`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

// Get user's orders
export const getUserOrders = async () => {
    const token = sessionStorage.getItem("token");
    const res = await axios.get(`${API_URL}/me/orders`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

// Admin: Get all users
export const getAllUsers = async () => {
    const token = sessionStorage.getItem("token");
    const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

// Admin: Get users by role
export const getUsersByRole = async (role) => {
    const token = sessionStorage.getItem("token");
    const res = await axios.get(`${API_URL}/role/${role}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

// Admin: Delete user
export const deleteUser = async (userId) => {
    const token = sessionStorage.getItem("token");
    const res = await axios.delete(`${API_URL}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};