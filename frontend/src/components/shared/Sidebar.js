import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../MainLayout.css'; // Import the CSS

const Sidebar = ({ activeSection, onSectionChange, isOpen, onClose }) => {
  const navigate = useNavigate();

  const dashboardItems = [
    { id: 'home', label: 'HomeAsquaticHub', icon: '🏠' },
    { id: 'about', label: 'About Us', icon: '📘' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'contact', label: 'Contact Us', icon: '📞' },
    { id: 'products', label: 'Products', icon: '🛍️' },
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'inventory', label: 'Inventory', icon: '📊' }
  ];

  return (
    <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
      <div style={{
        padding: '0 20px 20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{
            color: '#00a8cc',
            fontSize: '1.5rem',
            margin: '0 0 10px 0'
          }}>
            Aquarium Commerce
          </h2>
          <p style={{
            color: '#aaa',
            fontSize: '0.9rem',
            margin: 0
          }}>
            Admin Dashboard
          </p>
        </div>
        {/* Close button for mobile */}
        <button
          className="mobile-close-btn"
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer',
            display: window.innerWidth <= 768 ? 'block' : 'none'
          }}
        >
          ×
        </button>
      </div>

      <nav>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0
        }}>
          {dashboardItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => {
                  onSectionChange(item.id);
                  if (window.innerWidth <= 768 && onClose) onClose(); // Close sidebar on selection on mobile
                  // Navigate to appropriate route if needed
                  if (item.id === 'home') {
                    navigate('/');
                  }
                }}
                style={{
                  width: '100%',
                  padding: '15px 20px',
                  backgroundColor: activeSection === item.id
                    ? 'rgba(0, 168, 204, 0.3)'
                    : 'transparent',
                  color: activeSection === item.id ? '#00a8cc' : 'white',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = 'rgba(0, 168, 204, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = activeSection === item.id
                    ? 'rgba(0, 168, 204, 0.3)'
                    : 'transparent';
                }}
              >
                <span style={{
                  fontSize: '1.2rem',
                  marginRight: '10px'
                }}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;