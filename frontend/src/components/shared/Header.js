import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from './NotificationBell';

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
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px',
      backgroundColor: 'var(--card-bg)', // Use theme variable
      borderRadius: '15px',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
      border: '1px solid var(--border-color)', // Use theme variable
      position: 'relative'
    }}>
      <style>
        {`
          @keyframes lightning {
            0% {
              text-shadow: 0 0 5px rgba(0, 168, 204, 0.5), 0 0 10px rgba(0, 168, 204, 0.3);
            }
            50% {
              text-shadow: 0 0 15px rgba(0, 168, 204, 0.8), 0 0 25px rgba(0, 168, 204, 0.6), 0 0 35px rgba(0, 168, 204, 0.4);
            }
            100% {
              text-shadow: 0 0 10px rgba(0, 168, 204, 0.7), 0 0 20px rgba(0, 168, 204, 0.5), 0 0 30px rgba(0, 168, 204, 0.3);
            }
          }
        `}
      </style>
      <div>
        <h1 style={{
          color: 'var(--ocean-blue)', // Use variable
          margin: 0,
          fontSize: '2.2rem',
          // Kept gradient but updated to use variables logic theoretically (using fallbacks or direct values if var not supported in gradient string easily without string interpolation)
          background: 'linear-gradient(90deg, var(--aqua-blue), var(--ocean-blue))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{
            color: '#00a8cc',
            margin: '5px 0 0 0',
            fontSize: '1rem',
            textShadow: '0 0 10px rgba(0, 168, 204, 0.7), 0 0 20px rgba(0, 168, 204, 0.5), 0 0 30px rgba(0, 168, 204, 0.3)',
            animation: 'lightning 2s infinite alternate'
          }}>
            {subtitle}
          </p>
        )}
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '5px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span
              onClick={() => {
                if (userRole === 'customer') navigate('/customer/profile');
                else if (userRole === 'retailer') navigate('/retailer/profile');
                // Add other roles if they have profiles
              }}
              style={{
                color: 'var(--ocean-blue)',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
              title="Go to Profile"
            >
              {userName}
            </span>
            <span style={{
              backgroundColor: currentRole.bgColor,
              color: currentRole.color,
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              border: `1px solid ${currentRole.color}`
            }}>
              {currentRole.label}
            </span>
          </div>
        </div>
        <NotificationBell />
        <button
          onClick={toggleTheme}
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          style={{
            padding: '8px',
            backgroundColor: 'transparent',
            color: 'var(--ocean-blue)',
            border: '1px solid var(--ocean-blue)',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.backgroundColor = 'rgba(0,0,0,0.05)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.backgroundColor = 'transparent';
          }}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <button
          onClick={handleLogout}
          style={{
            padding: '6px 15px',
            backgroundColor: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '15px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#ff5252';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#ff6b6b';
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;