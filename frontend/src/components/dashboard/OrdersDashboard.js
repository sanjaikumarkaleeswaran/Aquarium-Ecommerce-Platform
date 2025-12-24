import React, { useState, useEffect } from 'react';
import { getOrders } from '../../services/orderService';
import './OrdersDashboard.css';

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
      <div className="orders-loading-container">
        <h2>Loading orders data...</h2>
      </div>
    );
  }

  return (
    <div className="orders-dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            📦 Orders Management
          </h1>
          <p className="dashboard-subtitle">
            Track and manage customer orders
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards-grid">
        {/* Total Orders Card */}
        <div className="stats-card">
          <h3 className="stats-card-title">Total Orders</h3>
          <p className="stats-card-value blue">{ordersData.totalOrders}</p>
          <p className="stats-card-label">{ordersData.totalOrders === 0 ? 'No orders yet' : 'All time orders'}</p>
        </div>

        {/* Pending Card */}
        <div className="stats-card">
          <h3 className="stats-card-title">Pending</h3>
          <p className="stats-card-value orange">{ordersData.pending}</p>
          <p className="stats-card-label">Needs attention</p>
        </div>

        {/* Confirmed Card */}
        <div className="stats-card">
          <h3 className="stats-card-title">Confirmed</h3>
          <p className="stats-card-value light-blue">{ordersData.confirmed}</p>
          <p className="stats-card-label">In progress</p>
        </div>

        {/* Shipped Card */}
        <div className="stats-card">
          <h3 className="stats-card-title">Shipped</h3>
          <p className="stats-card-value teal">{ordersData.shipped}</p>
          <p className="stats-card-label">On the way</p>
        </div>

        {/* Delivered Card */}
        <div className="stats-card">
          <h3 className="stats-card-title">Delivered</h3>
          <p className="stats-card-value green">{ordersData.delivered}</p>
          <p className="stats-card-label">Completed</p>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="recent-orders-container">
        <h2 className="section-title">
          🕒 Recent Orders
        </h2>

        {ordersData.recentOrders.length === 0 ? (
          <div className="no-orders-placeholder">
            <div className="no-orders-icon">📦</div>
            <h3 style={{ color: '#0a4f70', marginBottom: '10px' }}>No Orders Yet</h3>
            <p>When customers place orders, they will appear here.</p>
            <p style={{ marginTop: '20px', fontStyle: 'italic' }}>Start selling products to receive orders!</p>
          </div>
        ) : (
          <div className="orders-list">
            {ordersData.recentOrders.map((order) => (
              <div
                key={order._id}
                className="order-item"
                style={{
                  borderLeftColor: getStatusColor(order.status),
                }}
              >
                <div className="order-header">
                  <h3 className="order-id">
                    Order #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                  </h3>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="order-details-grid">
                  <p className="order-detail-row">
                    <strong>🧑 Customer:</strong> {order.buyerName || order.buyer?.name || 'Unknown'}
                  </p>
                  <p className="order-detail-row">
                    <strong>📦 Items:</strong> {order.items?.length || 0} item(s)
                  </p>
                  <p className="order-detail-row">
                    <strong>📅 Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="order-detail-row total">
                    <strong>💰 Total:</strong> ₹{order.totalAmount?.toFixed(2) || '0.00'}
                  </p>
                </div>

                {order.buyerRole && (
                  <p className="customer-type">
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