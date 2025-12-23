import api from './authService';

const API_URL = '/api/notifications';

export const getNotifications = async () => {
    try {
        const response = await api.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
    }
};

export const getUnreadCount = async () => {
    try {
        const response = await api.get(`${API_URL}/unread-count`);
        return response.data;
    } catch (error) {
        console.error('Error fetching unread count:', error);
        throw error;
    }
};

export const markAsRead = async (notificationId) => {
    try {
        const response = await api.put(`${API_URL}/${notificationId}/read`, {});
        return response.data;
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
    }
};

export const markAllAsRead = async () => {
    try {
        const response = await api.put(`${API_URL}/mark-all-read`, {});
        return response.data;
    } catch (error) {
        console.error('Error marking all as read:', error);
        throw error;
    }
};

export const deleteNotification = async (notificationId) => {
    try {
        const response = await api.delete(`${API_URL}/${notificationId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting notification:', error);
        throw error;
    }
};

export const clearReadNotifications = async () => {
    try {
        const response = await api.delete(`${API_URL}/clear-read`);
        return response.data;
    } catch (error) {
        console.error('Error clearing read notifications:', error);
        throw error;
    }
};
