import axios from 'axios';

const API_URL = '/api/notifications';

export const getNotifications = async () => {
    try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get(API_URL, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
    }
};

export const getUnreadCount = async () => {
    try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get(`${API_URL}/unread-count`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching unread count:', error);
        throw error;
    }
};

export const markAsRead = async (notificationId) => {
    try {
        const token = sessionStorage.getItem('token');
        const response = await axios.put(`${API_URL}/${notificationId}/read`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
    }
};

export const markAllAsRead = async () => {
    try {
        const token = sessionStorage.getItem('token');
        const response = await axios.put(`${API_URL}/mark-all-read`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error marking all as read:', error);
        throw error;
    }
};

export const deleteNotification = async (notificationId) => {
    try {
        const token = sessionStorage.getItem('token');
        const response = await axios.delete(`${API_URL}/${notificationId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting notification:', error);
        throw error;
    }
};

export const clearReadNotifications = async () => {
    try {
        const token = sessionStorage.getItem('token');
        const response = await axios.delete(`${API_URL}/clear-read`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error clearing read notifications:', error);
        throw error;
    }
};
