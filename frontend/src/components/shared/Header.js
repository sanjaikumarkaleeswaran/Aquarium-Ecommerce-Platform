import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from './NotificationBell';
import './Header.css';

const Header = ({ title, subtitle }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user: authUser, logout } = useAuth(); // Use context

  const handleLogout = () => {
    logout(); // Use context logout which clears storage and state
    navigate('/');
  };

  // Fallback to storage if context is loading or empty (though context handles this mostly)
  // But context is best source of truth
  const user = authUser || JSON.parse(sessionStorage.getItem('user') || '{}');
  const userName = user.name || 'Guest';
  const userRole = user.role || 'guest';

  // Role display names and colors
  const roleConfig = {
    admin: { label: 'Admin', color: '#9c27b0', bgColor: 'rgba(156, 39, 176, 0.1)' },
    wholesaler: { label: 'Wholesaler', color: '#ff9800', bgColor: 'rgba(255, 152, 0, 0.1)' },
    retailer: { label: 'Retailer', color: '#2196f3', bgColor: 'rgba(33, 150, 243, 0.1)' },
    customer: { label: 'Customer', color: '#4caf50', bgColor: 'rgba(76, 175, 80, 0.1)' },
    guest: { label: 'Guest', color: '#9e9e9e', bgColor: 'rgba(158, 158, 158, 0.1)' }
  };

  const currentRole = roleConfig[userRole] || roleConfig.guest;

  return (
    <div className="header-container">
      <div className="header-left">
        <h1 className="header-title">
          {title}
        </h1>
        {subtitle && (
          <p className="header-subtitle">
            {subtitle}
          </p>
        )}
      </div>
      <div className="header-right">
        <div className="user-info">
          <div className="user-details">
            <span
              onClick={() => {
                if (userRole === 'customer') navigate('/customer/profile');
                else if (userRole === 'retailer') navigate('/retailer/profile');
                // Add other roles if they have profiles
              }}
              className="user-name"
              title="Go to Profile"
            >
              {userName}
            </span>
            <span
              className="user-role-badge"
              style={{
                backgroundColor: currentRole.bgColor,
                color: currentRole.color,
                border: `1px solid ${currentRole.color}`
              }}
            >
              {currentRole.label}
            </span>
          </div>
        </div>
        <NotificationBell />
        <button
          onClick={toggleTheme}
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          className="theme-toggle-btn"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <button
          onClick={handleLogout}
          className="logout-btn"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;