import api from './authService';

const API_URL = "/api/admin";

// Get pending approvals (retailers and wholesalers waiting for approval)
export const getPendingApprovals = async () => {
    const res = await api.get(`${API_URL}/approvals/pending`);
    return res.data;
};

// Approve a user
export const approveUser = async (userId, comments = "") => {
    const res = await api.post(`${API_URL}/approvals/${userId}/approve`,
        { comments }
    );
    return res.data;
};

// Reject a user
export const rejectUser = async (userId, reason) => {
    const res = await api.post(`${API_URL}/approvals/${userId}/reject`,
        { reason }
    );
    return res.data;
};

// Get all users
export const getAllUsers = async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const res = await api.get(`${API_URL}/users?${params}`);
    return res.data;
};

// Get dashboard stats
export const getDashboardStats = async () => {
    const res = await api.get(`${API_URL}/dashboard/stats`);
    return res.data;
};

// Deactivate user
export const deactivateUser = async (userId) => {
    const res = await api.put(`${API_URL}/users/${userId}/deactivate`, {});
    return res.data;
};

// Activate user
export const activateUser = async (userId) => {
    const res = await api.put(`${API_URL}/users/${userId}/activate`, {});
    return res.data;
};

// Delete user
export const deleteUser = async (userId) => {
    const res = await api.delete(`${API_URL}/users/${userId}`);
    return res.data;
};

// Update user
export const updateUser = async (userId, userData) => {
    const res = await api.put(`${API_URL}/users/${userId}`, userData);
    return res.data;
};

export default {
    getPendingApprovals,
    approveUser,
    rejectUser,
    getAllUsers,
    getDashboardStats,
    deactivateUser,
    activateUser,
    deleteUser,
    updateUser
};
