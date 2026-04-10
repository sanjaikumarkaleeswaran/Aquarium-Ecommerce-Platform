import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../shared/Header';
import WholesalerProductCard from '../wholesaler/WholesalerProductCard';
import { getProducts } from '../../services/productService';
import { getOrders, updateOrderStatus } from '../../services/orderService';
import './WholesalerDashboard.css';

function WholesalerDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsData, ordersData] = await Promise.all([
        getProducts(),
        getOrders()
      ]);

      const userData = JSON.parse(sessionStorage.getItem('user'));

      let productList = [];
      if (productsData && productsData.products && Array.isArray(productsData.products)) {
        productList = productsData.products;
      } else if (Array.isArray(productsData)) {
        productList = productsData;
      }
      setProducts(productList);

      const allOrders = ordersData?.orders || [];
      const userId = userData?._id || userData?.id;

      const wholesalerOrders = allOrders.filter(order => {
        const sellerId = order.seller?._id || order.seller;
        return sellerId === userId;
      });

      setOrders(wholesalerOrders);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    navigate(`/wholesaler/products/edit/${product._id || product.id}`);
  };

  const handleDeleteProduct = (product) => {
    if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
      setProducts(products.filter(p => p._id !== product._id && p.id !== product.id));
      alert(`${product.name} has been deleted.`);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      fetchData();
      alert(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading text-center flex items-center justify-center">
        <h2 className="animate-fade-in">Loading dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="wholesaler-dashboard">
      <Header
        title="Wholesaler Dashboard"
        subtitle="Manage your products and retailer orders"
      />
      
      <div className="dashboard-header-actions">
        <button
          onClick={() => navigate('/wholesaler/products')}
          className="btn-primary"
        >
          📦 Manage Inventory
        </button>
      </div>

      <div className="dashboard-stats-container">
        {/* Business Overview Section */}
        <div className="card business-overview-card animate-fade-in">
          <div className="flex items-center" style={{ gap: '15px', marginBottom: '1rem' }}>
            <span style={{ fontSize: '2.5rem' }}>📊</span>
            <h2 style={{ margin: 0 }}>Business Overview</h2>
          </div>
          <div>
            <p className="text-secondary" style={{ marginBottom: '1.5rem' }}>
              Manage your wholesale operations efficiently.
            </p>
            <div className="stats-mini-grid">
              <div className="stat-box">
                <h3 style={{ color: '#2ecc71' }}>{products.length}</h3>
                <span className="text-secondary">Active Products</span>
              </div>
              <div className="stat-box">
                <h3 style={{ color: '#00a8cc' }}>{orders.length}</h3>
                <span className="text-secondary">Pending Orders</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Management Section */}
        <div className="card orders-management-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
            <div className="flex items-center" style={{ gap: '15px' }}>
              <span style={{ fontSize: '2.5rem' }}>📦</span>
              <h2 style={{ margin: 0 }}>Recent Orders</h2>
            </div>
            <span style={{
              padding: '4px 12px',
              backgroundColor: 'rgba(0, 168, 204, 0.1)',
              color: 'var(--ocean-blue)',
              borderRadius: '20px',
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}>
              {orders.length} ACTIVE
            </span>
          </div>

          <div className="orders-list">
            {orders.length === 0 ? (
              <div className="text-center" style={{ padding: '2rem' }}>
                <p style={{ fontSize: '3rem', margin: '0' }}>📭</p>
                <p className="text-secondary">No orders found yet.</p>
              </div>
            ) : orders.map(order => (
              <div key={order._id} className="order-item-card">
                <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
                    #{order.orderNumber?.slice(-6) || order._id.slice(-6)}
                  </h3>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                      style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        backgroundColor: order.status === 'delivered' ? '#2ecc71' :
                          order.status === 'shipped' ? '#3498db' :
                            order.status === 'cancelled' ? '#e74c3c' : '#f39c12',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                        width: 'auto',
                        minWidth: '100px'
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div className="responsive-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                  <p className="text-secondary" style={{ margin: 0, fontSize: '0.85rem' }}>
                    <strong>Buyer:</strong> {order.buyerName}
                  </p>
                  <p className="text-secondary" style={{ margin: 0, fontSize: '0.85rem' }}>
                    <strong>Items:</strong> {order.items.reduce((acc, item) => acc + item.quantity, 0)}
                  </p>
                  <p className="font-bold" style={{ margin: 0, color: '#2ecc71', fontSize: '1rem' }}>
                    ₹{order.totalAmount}
                  </p>
                  <p className="text-secondary" style={{ margin: 0, fontSize: '0.8rem' }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="products-section animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="products-section-header">
          <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Your Products</h2>
          <button
            onClick={() => navigate('/wholesaler/products')}
            style={{ backgroundColor: '#2ecc71' }}
          >
            ➕ Add New Product
          </button>
        </div>
        <div className="responsive-grid">
          {products.map(product => (
            <WholesalerProductCard
              key={product._id || product.id}
              product={product}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          ))}
          {products.length === 0 && (
             <div className="card text-center" style={{ padding: '3rem', width: '100%', gridColumn: '1 / -1' }}>
                <p style={{ fontSize: '3rem', margin: '0' }}>🐠</p>
                <p>No products found. Start by adding one!</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WholesalerDashboard;


export default WholesalerDashboard;