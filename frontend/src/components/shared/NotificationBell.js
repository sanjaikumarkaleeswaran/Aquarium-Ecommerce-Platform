import React, { useState, useEffect, useRef } from 'react';
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead, deleteNotification } from '../../services/notificationService';
import { useNavigate } from 'react-router-dom';
import './NotificationBell.css';

function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUnreadCount();
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Close dropdown when clicking outside
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchUnreadCount = async () => {
        try {
            const data = await getUnreadCount();
            setUnreadCount(data.count || 0);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await getNotifications();
            setNotifications(data.notifications || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setLoading(false);
        }
    };

    const handleBellClick = () => {
        setShowDropdown(!showDropdown);
        if (!showDropdown) {
            fetchNotifications();
        }
    };

    const handleNotificationClick = async (notification) => {
        try {
            if (!notification.isRead) {
                await markAsRead(notification._id);
                setUnreadCount(prev => Math.max(0, prev - 1));
            }

            // Navigate to the link if provided
            if (notification.link) {
                navigate(notification.link);
            }

            setShowDropdown(false);
            fetchNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllAsRead();
            setUnreadCount(0);
            fetchNotifications();
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const handleDelete = async (e, notificationId) => {
        e.stopPropagation();
        try {
            await deleteNotification(notificationId);
            fetchNotifications();
            fetchUnreadCount();
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'order': return '📦';
            case 'payment': return '💰';
            case 'shipping': return '🚚';
            case 'product': return '🛍️';
            case 'account': return '👤';
            default: return '🔔';
        }
    };

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        return new Date(date).toLocaleDateString();
    };

    return (
        <div ref={dropdownRef} className="notification-container">
            {/* Notification Bell Icon */}
            <button
                onClick={handleBellClick}
                className="notification-bell-btn"
            >
                🔔
                {unreadCount > 0 && (
                    <span className="notification-badge">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {showDropdown && (
                <div className="notification-dropdown">
                    {/* Header */}
                    <div className="dropdown-header">
                        <h3 className="dropdown-title">🔔 Notifications</h3>
                        {notifications.length > 0 && unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="mark-all-btn"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="notifications-list">
                        {loading ? (
                            <div className="loading-state">
                                <div>Loading notifications...</div>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">🔕</div>
                                <div>No notifications yet</div>
                                <div className="empty-subtext">You're all caught up!</div>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
                                >
                                    <div className="notification-content-wrapper">
                                        {/* Icon */}
                                        <div className={`notification-icon-wrapper ${notification.priority === 'high' ? 'high-priority' : 'normal-priority'}`}>
                                            {getNotificationIcon(notification.type)}
                                        </div>

                                        {/* Content */}
                                        <div className="notification-text-content">
                                            <div className={`notification-title ${!notification.isRead ? 'bold' : ''}`}>
                                                {notification.title}
                                            </div>
                                            <div className="notification-message">
                                                {notification.message}
                                            </div>
                                            <div className="notification-time">
                                                {getTimeAgo(notification.createdAt)}
                                            </div>
                                        </div>

                                        {/* Delete Button */}
                                        <button
                                            onClick={(e) => handleDelete(e, notification._id)}
                                            className="delete-notification-btn"
                                        >
                                            ×
                                        </button>
                                    </div>

                                    {/* Unread indicator */}
                                    {!notification.isRead && (
                                        <div className="unread-indicator" />
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default NotificationBell;
