import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../shared/Header';
import { getOrders, updateOrderStatus } from '../../services/orderService';
import { getMyInventory, purchaseFromWholesaler } from '../../services/retailerService';
import './RetailerDashboard.css';

function RetailerDashboard() {
  const [myProducts, setMyProducts] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(sessionStorage.getItem('user'));
      setUser(userData);

      const productsData = await getMyInventory();
      setMyProducts(productsData.retailerProducts || productsData.products || []);

      const ordersRes = await getOrders();
      const ordersData = ordersRes.orders || [];

      const userId = userData?._id || userData?.id;
      const retailerOrders = ordersData.filter(order => {
        const buyerId = order.buyer?._id || order.buyer;
        return buyerId === userId;
      });
      const custOrders = ordersData.filter(order => {
        const sellerId = order.seller?._id || order.seller;
        return sellerId === userId;
      });

      setMyOrders(retailerOrders);
      setCustomerOrders(custOrders);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReceiveInventory = async (orderId) => {
    try {
      if (!window.confirm("Add items from this order to your inventory?")) return;
      setLoading(true);
      await purchaseFromWholesaler(orderId);
      alert("Inventory updated successfully!");
      fetchDashboardData();
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to add inventory");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      fetchDashboardData();
      alert(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  if (loading) {
     return (
       <div className="dashboard-loading text-center flex items-center justify-center">
         <h2 className="animate-fade-in">Loading Retailer Panel...</h2>
       </div>
     );
  }

  return (
    <div className="retailer-dashboard">
      <Header
        title="Retailer Dashboard"
        subtitle={`Welcome back, ${user?.name || 'Retailer'}! 🐠`}
      />

      <div className="retailer-actions animate-fade-in" style={{ marginTop: '20px' }}>
        <div className="button-group">
          <button onClick={() => navigate('/retailer/products')} style={{ backgroundColor: '#2ecc71' }}>
            📦 My Inventory
          </button>
          <button onClick={() => navigate('/retailer/wholesaler-products')} style={{ backgroundColor: '#00a8cc' }}>
            🛒 Buy Wholesale
          </button>
          <button onClick={() => navigate('/retailer/orders')} style={{ backgroundColor: '#f39c12' }}>
            🚚 Track Purchases
          </button>
        </div>
      </div>

      <div className="retailer-stats-grid animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="card retailer-stat-card" onClick={() => navigate('/retailer/products')}>
          <h3 style={{ color: '#2ecc71' }}>📦 Inventory</h3>
          <p className="stat-value" style={{ color: '#2ecc71' }}>{myProducts.length}</p>
          <span className="text-secondary">active items</span>
        </div>
        <div className="card retailer-stat-card" onClick={() => navigate('/retailer/orders')}>
          <h3 style={{ color: '#00a8cc' }}>🛒 Purchases</h3>
          <p className="stat-value" style={{ color: '#00a8cc' }}>{myOrders.length}</p>
          <span className="text-secondary">from wholesalers</span>
        </div>
        <div className="card retailer-stat-card">
          <h3 style={{ color: '#f39c12' }}>👥 Sales</h3>
          <p className="stat-value" style={{ color: '#f39c12' }}>{customerOrders.length}</p>
          <span className="text-secondary">customer orders</span>
        </div>
      </div>

      <div className="dashboard-sections-row animate-fade-in" style={{ animationDelay: '0.2s' }}>
        {/* Products Section */}
        <div className="card dashboard-section-card">
          <div className="flex justify-between items-center" style={{ marginBottom: '20px' }}>
            <h2 className="ocean-blue" style={{ margin: 0, fontSize: '1.5rem' }}>Top Products</h2>
            <button
              onClick={() => navigate('/retailer/products')}
              className="btn-sm"
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            >
              Manage
            </button>
          </div>

          <div className="products-scroll-area">
            {myProducts.length === 0 ? (
              <div className="text-center" style={{ padding: '20px' }}>
                <p className="text-secondary">No products in inventory.</p>
              </div>
            ) : myProducts.slice(0, 6).map(product => (
              <div key={product._id} className="mini-product-item" onClick={() => navigate('/retailer/products')}>
                <div className="flex justify-between items-center">
                  <h4 style={{ margin: 0 }}>{product.name}</h4>
                  <span className="font-bold">₹{product.priceCustomer || product.price || 0}</span>
                </div>
                <div className="flex justify-between items-center" style={{ marginTop: '8px' }}>
                  <span className="text-secondary" style={{ fontSize: '0.8rem' }}>{product.category}</span>
                  <span style={{
                    fontSize: '0.8rem',
                    color: (product.quantity || 0) < 5 ? '#e74c3c' : '#2ecc71',
                    fontWeight: 'bold'
                  }}>
                    Stk: {product.quantity || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Purchases Section */}
        <div className="card dashboard-section-card">
          <h2 className="ocean-blue" style={{ margin: '0 0 20px 0', fontSize: '1.5rem' }}>Recent Purchases</h2>
          <div className="products-scroll-area">
            {myOrders.length === 0 ? (
              <div className="text-center" style={{ padding: '20px' }}>
                <p className="text-secondary">No wholesale orders yet.</p>
              </div>
            ) : myOrders.slice(0, 4).map(order => (
              <div key={order._id} className="mini-product-item" style={{ cursor: 'default' }}>
                <div className="flex justify-between items-center">
                  <span className="font-bold">#{order.orderNumber?.slice(-6) || order._id.slice(-6)}</span>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '0.75rem',
                    color: 'white',
                    backgroundColor: order.status === 'delivered' ? '#2ecc71' : '#f39c12'
                  }}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-secondary" style={{ margin: '8px 0 0 0', fontSize: '0.85rem' }}>
                  From: <strong>{order.sellerName}</strong> | Total: <strong>₹{order.totalAmount}</strong>
                </p>
                {order.status === 'delivered' && !order.isInventoryAdded && (
                    <button
                      onClick={() => handleReceiveInventory(order._id)}
                      className="btn-success"
                      style={{ width: '100%', marginTop: '10px', padding: '6px', fontSize: '0.8rem' }}
                    >
                      Add to Inventory
                    </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Orders Section */}
      <div className="card customer-orders-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <h2 className="ocean-blue" style={{ margin: '0 0 20px 0', fontSize: '1.5rem' }}>Manage Sales</h2>
        {customerOrders.length === 0 ? (
          <div className="text-center text-secondary" style={{ padding: '2rem' }}>
            No customer orders to manage yet.
          </div>
        ) : (
          <div className="orders-list">
            {customerOrders.map(order => (
              <div key={order._id} className="customer-order-item">
                <div className="flex justify-between items-center order-header" style={{ marginBottom: '15px' }}>
                  <div className="flex items-center" style={{ gap: '10px' }}>
                    <h3 style={{ margin: 0 }}>#{order.orderNumber?.slice(-6) || order._id.slice(-6)}</h3>
                    <span className="text-secondary" style={{ fontSize: '0.8rem' }}>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center" style={{ gap: '10px' }}>
                    <span className="hidden-mobile">Status:</span>
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        backgroundColor: order.status === 'delivered' ? '#2ecc71' :
                          order.status === 'shipped' ? '#3498db' :
                            order.status === 'cancelled' ? '#e74c3c' : '#f39c12',
                        color: 'white',
                        fontWeight: 'bold',
                        width: 'auto',
                        minWidth: '110px'
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="order-details-grid">
                  <div>
                    <span className="text-secondary" style={{ fontSize: '0.8rem' }}>Customer</span>
                    <p style={{ margin: '5px 0 0 0', fontWeight: 'bold' }}>{order.buyerName}</p>
                  </div>
                  <div>
                    <span className="text-secondary" style={{ fontSize: '0.8rem' }}>Items</span>
                    <p style={{ margin: '5px 0 0 0' }}>{order.items.length} product(s)</p>
                  </div>
                  <div>
                    <span className="text-secondary" style={{ fontSize: '0.8rem' }}>Total</span>
                    <p style={{ margin: '5px 0 0 0', color: '#2ecc71', fontWeight: 'bold' }}>₹{order.totalAmount}</p>
                  </div>
                  <div>
                    <span className="text-secondary" style={{ fontSize: '0.8rem' }}>Location</span>
                    <p style={{ margin: '5px 0 0 0' }}>{order.shippingAddress?.city || 'N/A'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RetailerDashboard;
 );
}

export default RetailerDashboard;