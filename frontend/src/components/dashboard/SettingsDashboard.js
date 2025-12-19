import React, { useState } from 'react';

function SettingsDashboard() {
  const [settings, setSettings] = useState({
    siteName: 'Aquarium Commerce',
    emailNotifications: true,
    smsNotifications: false,
    currency: 'USD',
    timezone: 'UTC',
    theme: 'light'
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Settings saved successfully!');
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: 'var(--card-bg)',
      borderRadius: '10px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      color: 'var(--text-main)'
    }}>
      <h2 style={{
        color: 'var(--ocean-blue)',
        marginBottom: '20px'
      }}>
        ⚙️ System Settings
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))',
        gap: '20px'
      }}>
        <div style={{
          backgroundColor: 'var(--card-bg)',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
          color: 'var(--text-main)'
        }}>
          <h3>General Settings</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Site Name</label>
              <input
                type="text"
                name="siteName"
                value={settings.siteName}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--input-bg)',
                  color: 'var(--text-main)'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Currency</label>
              <select
                name="currency"
                value={settings.currency}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--input-bg)',
                  color: 'var(--text-main)'
                }}
              >
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="GBP">British Pound (GBP)</option>
                <option value="JPY">Japanese Yen (JPY)</option>
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Timezone</label>
              <select
                name="timezone"
                value={settings.timezone}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--input-bg)',
                  color: 'var(--text-main)'
                }}
              >
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time (EST)</option>
                <option value="PST">Pacific Time (PST)</option>
                <option value="GMT">Greenwich Mean Time (GMT)</option>
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Theme</label>
              <select
                name="theme"
                value={settings.theme}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--input-bg)',
                  color: 'var(--text-main)'
                }}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            <button type="submit" style={{
              padding: '10px 20px',
              backgroundColor: '#00a8cc',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}>
              Save Settings
            </button>
          </form>
        </div>

        <div style={{
          backgroundColor: 'var(--card-bg)',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
          color: 'var(--text-main)'
        }}>
          <h3>Notification Settings</h3>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                name="emailNotifications"
                checked={settings.emailNotifications}
                onChange={handleInputChange}
                style={{ marginRight: '10px' }}
              />
              Email Notifications
            </label>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                name="smsNotifications"
                checked={settings.smsNotifications}
                onChange={handleInputChange}
                style={{ marginRight: '10px' }}
              />
              SMS Notifications
            </label>
          </div>

          <h3 style={{ marginTop: '30px' }}>Security</h3>

          <div style={{ marginBottom: '15px' }}>
            <button style={{
              padding: '10px 20px',
              backgroundColor: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginRight: '10px'
            }}>
              Change Password
            </button>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <button style={{
              padding: '10px 20px',
              backgroundColor: '#ff9ff3',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}>
              Enable Two-Factor Authentication
            </button>
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: 'var(--card-bg)',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        marginTop: '20px',
        color: 'var(--text-main)'
      }}>
        <h3>System Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
          <div>
            <strong>Version:</strong> 1.2.4
          </div>
          <div>
            <strong>Last Update:</strong> Dec 5, 2023
          </div>
          <div>
            <strong>Status:</strong> <span style={{ color: '#1dd1a1' }}>Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsDashboard;