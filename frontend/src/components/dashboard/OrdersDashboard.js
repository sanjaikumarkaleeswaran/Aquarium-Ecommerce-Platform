import React, { useState, useEffect } from 'react';
import { getOrders } from '../../services/orderService';

function OrdersDashboard() {
  const [ordersData, setOrdersData] = useState({
    totalOrders: 0,
    pending: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  const fetchSellerOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrders({ role: 'seller' });

      if (response && response.orders) {
        const orders = response.orders;
        const userId = user._id || user.id;
        const sellerOrders = orders.filter(order =>
          order.seller && (order.seller._id === userId || order.seller === userId)
        );

        const stats = {
          totalOrders: sellerOrders.length,
          pending: sellerOrders.filter(o => o.status === 'pending').length,
          confirmed: sellerOrders.filter(o => o.status === 'confirmed').length,
          shipped: sellerOrders.filter(o => o.status === 'shipped').length,
          delivered: sellerOrders.filter(o => o.status === 'delivered').length,
          cancelled: sellerOrders.filter(o => o.status === 'cancelled').length,
          recentOrders: sellerOrders.slice(0, 10)
        };

        setOrdersData(stats);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching seller orders:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f39c12';
      case 'confirmed': return '#3498db';
      case 'processing': return '#9b59b6';
      case 'shipped': return '#e67e22';
      case 'delivered': return '#2ecc71';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  if (loading) {
    return (
      <div style={{
        padding: '20px',
        background: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h2>Loading orders data...</h2>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      background: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)',
      minHeight: '100vh'
    }}>
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
            📦 Orders Management
          </h1>
          <p style={{ color: '#0a4f70', fontSize: '1.1rem', marginTop: '5px' }}>
            Track and manage customer orders
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* Total Orders Card */}
        <div style={{
          backgroundColor: 'white',
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
          <h3 style={{ color: '#0a4f70', margin: '0 0 15px 0', fontSize: '1.1rem' }}>Total Orders</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#00a8cc', margin: '0 0 5px 0' }}>{ordersData.totalOrders}</p>
          <p style={{ color: '#888', margin: 0, fontSize: '0.9rem' }}>{ordersData.totalOrders === 0 ? 'No orders yet' : 'All time orders'}</p>
        </div>

        {/* Pending Card */}
        <div style={{
          backgroundColor: 'white',
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
          <h3 style={{ color: '#0a4f70', margin: '0 0 15px 0', fontSize: '1.1rem' }}>Pending</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ff6b6b', margin: '0 0 5px 0' }}>{ordersData.pending}</p>
          <p style={{ color: '#888', margin: 0, fontSize: '0.9rem' }}>Needs attention</p>
        </div>

        {/* Confirmed Card */}
        <div style={{
          backgroundColor: 'white',
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
          <h3 style={{ color: '#0a4f70', margin: '0 0 15px 0', fontSize: '1.1rem' }}>Confirmed</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#3498db', margin: '0 0 5px 0' }}>{ordersData.confirmed}</p>
          <p style={{ color: '#888', margin: 0, fontSize: '0.9rem' }}>In progress</p>
        </div>

        {/* Shipped Card */}
        <div style={{
          backgroundColor: 'white',
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
          <h3 style={{ color: '#0a4f70', margin: '0 0 15px 0', fontSize: '1.1rem' }}>Shipped</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#4ecdc4', margin: '0 0 5px 0' }}>{ordersData.shipped}</p>
          <p style={{ color: '#888', margin: 0, fontSize: '0.9rem' }}>On the way</p>
        </div>

        {/* Delivered Card */}
        <div style={{
          backgroundColor: 'white',
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
          <h3 style={{ color: '#0a4f70', margin: '0 0 15px 0', fontSize: '1.1rem' }}>Delivered</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1dd1a1', margin: '0 0 5px 0' }}>{ordersData.delivered}</p>
          <p style={{ color: '#888', margin: 0, fontSize: '0.9rem' }}>Completed</p>
        </div>
      </div>

      {/* Recent Orders List */}
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(0, 168, 204, 0.1)'
      }}>
        <h2 style={{
          color: '#0a4f70',
          margin: '0 0 20px 0',
          paddingBottom: '15px',
          borderBottom: '2px solid rgba(0, 168, 204, 0.2)'
        }}>
          🕒 Recent Orders
        </h2>

        {ordersData.recentOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📦</div>
            <h3 style={{ color: '#0a4f70', marginBottom: '10px' }}>No Orders Yet</h3>
            <p>When customers place orders, they will appear here.</p>
            <p style={{ marginTop: '20px', fontStyle: 'italic' }}>Start selling products to receive orders!</p>
          </div>
        ) : (
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {ordersData.recentOrders.map((order) => (
              <div
                key={order._id}
                style={{
                  padding: '20px',
                  borderBottom: '1px solid #eee',
                  transition: 'background-color 0.3s',
                  borderLeft: `5px solid ${getStatusColor(order.status)}`,
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ margin: 0, color: '#0a4f70', fontSize: '1.2rem' }}>
                    Order #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                  </h3>
                  <span style={{
                    padding: '6px 15px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    color: 'white',
                    backgroundColor: getStatusColor(order.status),
                    textTransform: 'uppercase'
                  }}>
                    {order.status}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <p style={{ margin: '5px 0', fontSize: '0.95rem', color: '#666' }}>
                    <strong>🧑 Customer:</strong> {order.buyerName || order.buyer?.name || 'Unknown'}
                  </p>
                  <p style={{ margin: '5px 0', fontSize: '0.95rem', color: '#666' }}>
                    <strong>📦 Items:</strong> {order.items?.length || 0} item(s)
                  </p>
                  <p style={{ margin: '5px 0', fontSize: '0.95rem', color: '#666' }}>
                    <strong>📅 Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p style={{ margin: '5px 0', fontSize: '0.95rem', color: '#0a4f70', fontWeight: 'bold' }}>
                    <strong>💰 Total:</strong> ₹{order.totalAmount?.toFixed(2) || '0.00'}
                  </p>
                </div>

                {order.buyerRole && (
                  <p style={{ margin: '5px 0', fontSize: '0.85rem', color: '#888', fontStyle: 'italic' }}>
                    Customer Type: {order.buyerRole}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersDashboard;