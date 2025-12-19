import axios from 'axios';

const API_URL = "http://localhost:5000/api/admin";

// Get auth token from sessionStorage (per-tab storage)
const getAuthHeader = () => {
    const token = sessionStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
};

// Get pending approvals (retailers and wholesalers waiting for approval)
export const getPendingApprovals = async () => {
    const res = await axios.get(`${API_URL}/approvals/pending`, {
        headers: getAuthHeader()
    });
    return res.data;
};

// Approve a user
export const approveUser = async (userId, comments = "") => {
    const res = await axios.post(`${API_URL}/approvals/${userId}/approve`,
        { comments },
        { headers: getAuthHeader() }
    );
    return res.data;
};

// Reject a user
export const rejectUser = async (userId, reason) => {
    const res = await axios.post(`${API_URL}/approvals/${userId}/reject`,
        { reason },
        { headers: getAuthHeader() }
    );
    return res.data;
};

// Get all users
export const getAllUsers = async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const res = await axios.get(`${API_URL}/users?${params}`, {
        headers: getAuthHeader()
    });
    return res.data;
};

// Get dashboard stats
export const getDashboardStats = async () => {
    const res = await axios.get(`${API_URL}/dashboard/stats`, {
        headers: getAuthHeader()
    });
    return res.data;
};

// Deactivate user
export const deactivateUser = async (userId) => {
    const res = await axios.put(`${API_URL}/users/${userId}/deactivate`, {}, {
        headers: getAuthHeader()
    });
    return res.data;
};

// Activate user
export const activateUser = async (userId) => {
    const res = await axios.put(`${API_URL}/users/${userId}/activate`, {}, {
        headers: getAuthHeader()
    });
    return res.data;
};

// Delete user
export const deleteUser = async (userId) => {
    const res = await axios.delete(`${API_URL}/users/${userId}`, {
        headers: getAuthHeader()
    });
    return res.data;
};

// Update user
export const updateUser = async (userId, userData) => {
    const res = await axios.put(`${API_URL}/users/${userId}`, userData, {
        headers: getAuthHeader()
    });
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
