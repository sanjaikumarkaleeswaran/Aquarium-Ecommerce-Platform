import api from './authService';
const API_URL = "/api/users";

// Get current user profile
export const getCurrentUser = async () => {
    const res = await api.get(`${API_URL}/me`);
    return res.data;
};

// Update user profile
export const updateUserProfile = async (userData) => {
    const res = await api.put(`${API_URL}/me`, userData);
    return res.data;
};

// Get user's products (for wholesalers and retailers)
export const getUserProducts = async () => {
    const res = await api.get(`/api/products/my/products`);
    return res.data;
};

// Get user's orders
export const getUserOrders = async () => {
    const res = await api.get(`${API_URL}/me/orders`);
    return res.data;
};

// Admin: Get all users
export const getAllUsers = async () => {
    const res = await api.get(API_URL);
    return res.data;
};

// Admin: Get users by role
export const getUsersByRole = async (role) => {
    const res = await api.get(`${API_URL}/role/${role}`);
    return res.data;
};

// Admin: Delete user
export const deleteUser = async (userId) => {
    const res = await api.delete(`${API_URL}/${userId}`);
    return res.data;
};