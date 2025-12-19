import React, { useState, useEffect, useRef } from 'react';
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead, deleteNotification } from '../../services/notificationService';
import { useNavigate } from 'react-router-dom';

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
        <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
            {/* Notification Bell Icon */}
            <button
                onClick={handleBellClick}
                style={{
                    position: 'relative',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.5rem',
                    padding: '10px',
                    borderRadius: '50%',
                    transition: 'all 0.3s',
                    color: '#0a4f70'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 168, 204, 0.1)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                }}
            >
                🔔
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        border: '2px solid white',
                        animation: 'pulse 2s infinite'
                    }}>
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {showDropdown && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '10px',
                    width: '400px',
                    maxHeight: '500px',
                    backgroundColor: 'white',
                    borderRadius: '15px',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
                    zIndex: 1000,
                    overflow: 'hidden',
                    border: '1px solid rgba(0, 168, 204, 0.2)'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '20px',
                        backgroundColor: 'linear-gradient(135deg, #0a4f70, #00a8cc)',
                        background: 'linear-gradient(135deg, #0a4f70, #00a8cc)',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <h3 style={{ margin: 0, fontSize: '1.2rem' }}>🔔 Notifications</h3>
                        {notifications.length > 0 && unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                style={{
                                    padding: '6px 12px',
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '15px',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                    transition: 'background-color 0.3s'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.3)'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {loading ? (
                            <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                                <div>Loading notifications...</div>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🔕</div>
                                <div>No notifications yet</div>
                                <div style={{ fontSize: '0.85rem', marginTop: '5px' }}>You're all caught up!</div>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    onClick={() => handleNotificationClick(notification)}
                                    style={{
                                        padding: '15px 20px',
                                        borderBottom: '1px solid #f0f0f0',
                                        cursor: 'pointer',
                                        backgroundColor: notification.isRead ? 'white' : '#e8f5ff',
                                        transition: 'background-color 0.3s',
                                        position: 'relative'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = notification.isRead ? 'white' : '#e8f5ff'}
                                >
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                                        {/* Icon */}
                                        <div style={{
                                            fontSize: '1.5rem',
                                            flexShrink: 0,
                                            width: '40px',
                                            height: '40px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: notification.priority === 'high' ? '#ffe0e0' : '#e8f5ff',
                                            borderRadius: '50%'
                                        }}>
                                            {getNotificationIcon(notification.type)}
                                        </div>

                                        {/* Content */}
                                        <div style={{ flex: 1 }}>
                                            <div style={{
                                                fontWeight: notification.isRead ? 'normal' : 'bold',
                                                color: '#0a4f70',
                                                marginBottom: '4px',
                                                fontSize: '0.95rem'
                                            }}>
                                                {notification.title}
                                            </div>
                                            <div style={{
                                                color: '#666',
                                                fontSize: '0.85rem',
                                                marginBottom: '6px',
                                                lineHeight: '1.4'
                                            }}>
                                                {notification.message}
                                            </div>
                                            <div style={{
                                                color: '#999',
                                                fontSize: '0.75rem'
                                            }}>
                                                {getTimeAgo(notification.createdAt)}
                                            </div>
                                        </div>

                                        {/* Delete Button */}
                                        <button
                                            onClick={(e) => handleDelete(e, notification._id)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: '#ccc',
                                                fontSize: '1.2rem',
                                                padding: '5px',
                                                transition: 'color 0.3s'
                                            }}
                                            onMouseEnter={(e) => e.target.style.color = '#e74c3c'}
                                            onMouseLeave={(e) => e.target.style.color = '#ccc'}
                                        >
                                            ×
                                        </button>
                                    </div>

                                    {/* Unread indicator */}
                                    {!notification.isRead && (
                                        <div style={{
                                            position: 'absolute',
                                            left: '8px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            width: '8px',
                                            height: '8px',
                                            backgroundColor: '#00a8cc',
                                            borderRadius: '50%'
                                        }} />
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* CSS Animation */}
            <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>
        </div>
    );
}

export default NotificationBell;
