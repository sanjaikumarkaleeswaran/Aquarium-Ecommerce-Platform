import React from 'react';

function HomeDashboard() {
  // Stats data - updated to reflect no orders yet
  const stats = [
    { title: 'Total Products', value: '27', change: '+15%', icon: '🛍️', color: '#00a8cc' },
    { title: 'Active Users', value: '0', change: '+0%', icon: '👥', color: '#4ecdc4' },
    { title: 'Monthly Revenue', value: '₹0', change: '+0%', icon: '💰', color: '#1dd1a1' },
    { title: 'Pending Orders', value: '0', change: '+0%', icon: '📦', color: '#ff6b6b' }
  ];

  // Recent activity data - updated to reflect actual platform activity
  const recentActivity = [
    { user: 'System', action: 'initialized platform', time: 'Just now', type: 'system' },
    { user: 'Admin', action: 'added 27 products to catalog', time: '5 minutes ago', type: 'product' },
    { user: 'System', action: 'configured database', time: '10 minutes ago', type: 'system' },
    { user: 'Admin', action: 'set up user roles', time: '15 minutes ago', type: 'system' }
  ];

  return (
    <div style={{
      padding: '20px',
      background: 'var(--background-gradient)',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <style>
        {`
          @keyframes lightning {
            0% {
              text-shadow: 0 0 5px rgba(10, 79, 112, 0.5), 0 0 10px rgba(10, 79, 112, 0.3);
            }
            50% {
              text-shadow: 0 0 15px rgba(10, 79, 112, 0.8), 0 0 25px rgba(10, 79, 112, 0.6), 0 0 35px rgba(10, 79, 112, 0.4);
            }
            100% {
              text-shadow: 0 0 10px rgba(10, 79, 112, 0.7), 0 0 20px rgba(10, 79, 112, 0.5), 0 0 30px rgba(10, 79, 112, 0.3);
            }
          }
        `}
      </style>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div>
          <h1 style={{
            color: '#0a4f70',
            margin: 0,
            fontSize: '2.5rem',
            background: 'linear-gradient(90deg, #00a8cc, #0a4f70)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Aquarium Commerce Dashboard
          </h1>
          <p style={{ color: '#0a4f70', fontSize: '1.1rem', marginTop: '5px', textShadow: '0 0 10px rgba(10, 79, 112, 0.7), 0 0 20px rgba(10, 79, 112, 0.5), 0 0 30px rgba(10, 79, 112, 0.3)', animation: 'lightning 2s infinite alternate' }}>
            Your Ultimate B2B & B2C Marketplace for All Things Aquatic! 🐠
          </p>
        </div>
        <div style={{
          backgroundColor: 'var(--card-bg)',
          padding: '15px 25px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{ margin: 0, color: 'var(--ocean-blue)', fontWeight: '500' }}>Last updated: Just now</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {stats.map((stat, index) => (
          <div key={index} style={{
            backgroundColor: 'var(--card-bg)',
            padding: '25px',
            borderRadius: '15px',
            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(0, 168, 204, 0.1)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer'
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.08)';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{
                  color: 'var(--ocean-blue)',
                  margin: '0 0 10px 0',
                  fontSize: '1.1rem'
                }}>
                  {stat.title}
                </h3>
                <p style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: stat.color,
                  margin: '0 0 5px 0'
                }}>
                  {stat.value}
                </p>
                <p style={{
                  color: stat.change.startsWith('+') && stat.change !== '+0%' ? '#1dd1a1' : 'var(--text-secondary)',
                  margin: 0,
                  fontSize: '0.9rem'
                }}>
                  {stat.change} from last month
                </p>
              </div>
              <div style={{
                fontSize: '2rem',
                opacity: 0.8
              }}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '20px'
      }}>
        {/* Platform Overview */}
        <div style={{
          backgroundColor: 'var(--card-bg)',
          padding: '30px',
          borderRadius: '15px',
          boxShadow: '0 6px 15px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 168, 204, 0.1)'
        }}>
          <h2 style={{
            color: 'var(--ocean-blue)',
            marginBottom: '20px',
            paddingBottom: '15px',
            borderBottom: '2px solid rgba(0, 168, 204, 0.2)'
          }}>
            🌊 Platform Overview
          </h2>
          <p style={{
            color: 'var(--text-secondary)',
            lineHeight: '1.8',
            fontSize: '1.1rem'
          }}>
            Aquarium Commerce is a comprehensive B2B and B2C e-commerce platform designed specifically for the aquarium industry.
            Whether you're a hobbyist looking for the perfect fish tank setup, a retailer expanding your product range,
            or a wholesaler managing bulk orders, our platform connects all stakeholders in the aquarium ecosystem.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            marginTop: '25px'
          }}>
            <div style={{
              textAlign: 'center',
              padding: '20px',
              backgroundColor: 'rgba(0, 168, 204, 0.05)',
              borderRadius: '10px'
            }}>
              <h3 style={{ color: '#00a8cc', margin: '0 0 10px 0' }}>B2B</h3>
              <p style={{ margin: 0, color: '#555' }}>Wholesale trading</p>
            </div>
            <div style={{
              textAlign: 'center',
              padding: '20px',
              backgroundColor: 'rgba(78, 205, 196, 0.05)',
              borderRadius: '10px'
            }}>
              <h3 style={{ color: '#4ecdc4', margin: '0 0 10px 0' }}>B2C</h3>
              <p style={{ margin: 0, color: '#555' }}>Retail customers</p>
            </div>
            <div style={{
              textAlign: 'center',
              padding: '20px',
              backgroundColor: 'rgba(29, 209, 161, 0.05)',
              borderRadius: '10px'
            }}>
              <h3 style={{ color: '#1dd1a1', margin: '0 0 10px 0' }}>Ecosystem</h3>
              <p style={{ margin: 0, color: '#555' }}>Full integration</p>
            </div>
          </div>

          {/* Getting Started Section */}
          <div style={{
            marginTop: '30px',
            padding: '20px',
            backgroundColor: 'rgba(0, 168, 204, 0.05)',
            borderRadius: '10px',
            border: '1px dashed #00a8cc'
          }}>
            <h3 style={{
              color: '#0a4f70',
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{ marginRight: '10px' }}>🚀</span>
              Getting Started
            </h3>
            <p style={{ margin: '10px 0', color: '#555' }}>
              <strong>1.</strong> Add more products to your catalog to start selling
            </p>
            <p style={{ margin: '10px 0', color: '#555' }}>
              <strong>2.</strong> Configure user accounts for retailers and wholesalers
            </p>
            <p style={{ margin: '10px 0', color: '#555' }}>
              <strong>3.</strong> Set up payment and shipping options
            </p>
            <p style={{ margin: '10px 0', color: '#555' }}>
              <strong>4.</strong> Promote your platform to attract customers
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{
          backgroundColor: 'var(--card-bg)',
          padding: '30px',
          borderRadius: '15px',
          boxShadow: '0 6px 15px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 168, 204, 0.1)'
        }}>
          <h2 style={{
            color: 'var(--ocean-blue)',
            marginBottom: '20px',
            paddingBottom: '15px',
            borderBottom: '2px solid rgba(0, 168, 204, 0.2)'
          }}>
            🕒 Recent Activity
          </h2>
          <div style={{
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            {recentActivity.map((activity, index) => (
              <div key={index} style={{
                display: 'flex',
                padding: '15px 0',
                borderBottom: index !== recentActivity.length - 1 ? '1px solid var(--border-color)' : 'none'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0, 168, 204, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px',
                  fontSize: '1.2rem'
                }}>
                  {activity.type === 'order' && '📦'}
                  {activity.type === 'product' && '🛍️'}
                  {activity.type === 'inventory' && '📊'}
                  {activity.type === 'payment' && '💳'}
                  {activity.type === 'system' && '⚙️'}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 5px 0', fontWeight: '500', color: 'var(--text-main)' }}>
                    <span style={{ color: '#00a8cc' }}>{activity.user}</span> {activity.action}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeDashboard;