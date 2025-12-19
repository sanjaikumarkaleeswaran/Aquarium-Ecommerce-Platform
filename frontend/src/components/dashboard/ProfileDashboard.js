import React, { useState, useEffect } from 'react';
import { getOrders } from '../../services/orderService';
import { useToast } from '../shared/ToastProvider';
import { useNavigate } from 'react-router-dom';

function ProfileDashboard() {
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Load User Profile
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) {
      if (sessionStorage.getItem('userRole') === 'retailer') navigate('/login/retailer');
      else navigate('/login/customer');
      return;
    }
    const user = JSON.parse(storedUser);
    setProfile(user);

    // 2. Load Order History
    const fetchHistory = async () => {
      try {
        const data = await getOrders();
        // Check if data has orders property (API often returns { success: true, orders: [...] })
        setOrders(data.orders || (Array.isArray(data) ? data : []));
      } catch (err) {
        console.error("Failed to load orders", err);
        // Do not block UI, just show empty orders or error toast
        // toast.error("Could not load order history."); 
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [navigate]);



  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Profile...</div>;
  if (!profile) return null;

  return (
    <div style={{
      padding: '20px',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      color: 'var(--text-main)',
      maxWidth: '1200px',
      margin: '20px auto',
      border: '1px solid rgba(255, 255, 255, 0.18)'
    }}>
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
            100% { transform: translateY(0px); }
          }
          .profile-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15) !important;
          }
          .order-card {
            transition: all 0.3s ease;
          }
          .order-card:hover {
            transform: scale(1.02);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          }
        `}
      </style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>
        <h2 style={{ color: 'var(--ocean-blue)', margin: 0 }}>👤 My Profile</h2>
        <button
          onClick={() => {
            sessionStorage.clear();
            navigate('/');
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>

        {/* LEFT COLUMN: Profile Info */}
        <div>
          <div className="profile-card" style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 100%)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            padding: '30px',
            borderRadius: '20px',
            textAlign: 'center',
            marginBottom: '25px',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)'
          }}>
            <div style={{
              width: '120px', height: '120px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--aqua-blue), var(--ocean-blue))',
              color: 'white',
              fontSize: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 15px',
              border: '4px solid var(--card-bg)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}>
              {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '1.5rem', color: 'var(--ocean-blue)' }}>{profile.name}</h3>
            <span style={{
              display: 'inline-block',
              padding: '5px 15px',
              borderRadius: '20px',
              backgroundColor: 'rgba(0, 168, 204, 0.1)',
              color: 'var(--aqua-blue)',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: '0.8rem',
              border: '1px solid var(--aqua-blue)'
            }}>
              {profile.role}
            </span>
          </div>

          <div className="profile-card" style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 100%)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            padding: '30px',
            borderRadius: '20px',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h4 style={{ margin: 0, color: 'var(--ocean-blue)' }}>Details</h4>
              <button
                onClick={() => {
                  if (profile.role === 'retailer') navigate('/retailer/profile/edit');
                  else navigate('/customer/profile/edit');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--aqua-blue)',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}
              >
                <span>✏️</span> Edit
              </button>
            </div>

            <div style={{ fontSize: '0.95rem', lineHeight: '2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.2rem' }}>📧</span>
                <div>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Email</span>
                  <strong>{profile.email}</strong>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px' }}>
                <span style={{ fontSize: '1.2rem' }}>📱</span>
                <div>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Phone</span>
                  <strong>{profile.phone || 'Not set'}</strong>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px' }}>
                <span style={{ fontSize: '1.2rem' }}>📅</span>
                <div>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Member Since</span>
                  <strong>{new Date().getFullYear()}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Order History */}
        <div>
          <h3 style={{ color: 'var(--ocean-blue)', marginTop: 0, marginBottom: '20px' }}>📦 Order History</h3>

          {orders.length === 0 ? (
            <div style={{
              padding: '60px',
              textAlign: 'center',
              backgroundColor: 'var(--input-bg)',
              borderRadius: '20px',
              color: 'var(--text-secondary)',
              border: '2px dashed var(--border-color)'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '15px', opacity: 0.5 }}>📦</div>
              <h3 style={{ margin: '0 0 10px 0', color: 'var(--text-main)' }}>No orders yet</h3>
              <p style={{ fontSize: '1rem', marginBottom: '25px' }}>It looks like you haven't placed any orders. Discover our exotic collection!</p>
              <button
                onClick={() => {
                  if (profile.role === 'retailer') navigate('/retailer/wholesaler-products');
                  else navigate('/customer/products');
                }}
                style={{
                  padding: '12px 30px',
                  backgroundColor: 'var(--ocean-blue)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  boxShadow: '0 4px 15px rgba(0, 168, 204, 0.4)',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {orders.map(order => (
                <div key={order._id} className="order-card" style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  padding: '25px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <span style={{
                        fontWeight: '800',
                        fontSize: '1.2rem',
                        color: 'var(--ocean-blue)',
                        letterSpacing: '0.5px'
                      }}>
                        #{order._id.slice(-6).toUpperCase()}
                      </span>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span>📅</span> {new Date(order.createdAt).toLocaleDateString()}
                        <span style={{ margin: '0 5px' }}>•</span>
                        <span>🕒</span> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
                      {(() => {
                        const getStatusStyles = (s) => {
                          switch (s) {
                            case 'Delivered': return { bg: 'rgba(76, 175, 80, 0.2)', color: '#2e7d32', border: '#2e7d32' };
                            case 'Shipped': return { bg: 'rgba(33, 150, 243, 0.2)', color: '#1565c0', border: '#1565c0' };
                            case 'Cancelled': return { bg: 'rgba(244, 67, 54, 0.2)', color: '#c62828', border: '#c62828' };
                            default: return { bg: 'rgba(255, 193, 7, 0.2)', color: '#e65100', border: '#ffb300' }; // Pending - Distinct Orange/Gold
                          }
                        };
                        const styles = getStatusStyles(order.status);
                        return (
                          <span style={{
                            padding: '6px 14px',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            backgroundColor: styles.bg,
                            color: styles.color,
                            border: `1px solid ${styles.border}`,
                            display: 'inline-block'
                          }}>
                            {order.status}
                          </span>
                        );
                      })()}
                      <div style={{ fontWeight: '800', fontSize: '1.4rem', color: 'var(--text-main)' }}>
                        ₹{order.totalAmount?.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px', backgroundColor: 'var(--background-color)', padding: '15px', borderRadius: '10px' }}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.95rem',
                        marginBottom: idx !== order.items.length - 1 ? '10px' : '0',
                        paddingBottom: idx !== order.items.length - 1 ? '10px' : '0',
                        borderBottom: idx !== order.items.length - 1 ? '1px dashed var(--border-color)' : 'none'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '30px', height: '30px',
                            backgroundColor: 'var(--card-bg)',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.8rem',
                            border: '1px solid var(--border-color)'
                          }}>
                            🐟
                          </div>
                          <div>
                            <span style={{ fontWeight: 'bold', marginRight: '5px', color: 'var(--ocean-blue)' }}>{item.quantity}x</span>
                            {item.product?.name || item.name || 'Product'}
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                              Sold by: {item.product?.seller?.businessName || 'Seller'}
                            </div>
                          </div>
                        </div>
                        <span style={{ fontWeight: '600' }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    {/* Placeholder for Track Order logic if needed */}
                    {order.status === 'Pending' || order.status === 'Shipped' ? (
                      <button style={{
                        padding: '8px 15px', backgroundColor: 'var(--aqua-blue)', color: 'white',
                        border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.9rem'
                      }}>
                        Track Shipment
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileDashboard;