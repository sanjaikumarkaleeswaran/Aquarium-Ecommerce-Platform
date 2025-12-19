
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../shared/Header';
import WholesalerProductCard from '../wholesaler/WholesalerProductCard';
import { getProducts } from '../../services/productService';
import { getOrders, updateOrderStatus } from '../../services/orderService';

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

      // Get user info
      const userData = JSON.parse(sessionStorage.getItem('user'));

      // Handle products
      let productList = [];
      if (productsData && productsData.products && Array.isArray(productsData.products)) {
        productList = productsData.products;
      } else if (Array.isArray(productsData)) {
        productList = productsData;
      }
      setProducts(productList);

      // Handle orders - Filter for orders where wholesaler is the seller (orders from retailers)
      const allOrders = ordersData?.orders || [];
      const userId = userData?._id || userData?.id;

      const wholesalerOrders = allOrders.filter(order => {
        const sellerId = order.seller?._id || order.seller;
        return sellerId === userId;
      });

      console.log('Wholesaler orders:', wholesalerOrders);
      setOrders(wholesalerOrders);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };



  // Function to get the main image for a product
  const getProductImage = (product) => {
    // For mock products, check if images array exists and has items
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      // If it's a base64 image, use it directly
      if (product.images[0].startsWith('data:image')) {
        return product.images[0];
      }
      // If it's a URL, use it directly
      if (product.images[0].startsWith('http')) {
        return product.images[0];
      }
    }

    // Fallback to default image - using a direct data URL for a simple aquarium image
    return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiM0ZmEyY2MiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIyMCIgZmlsbD0iIzNmOGFkYSIvPjxjaXJjbGUgY3g9IjcwIiBjeT0iMzAiIHI9IjgiIGZpbGw9IiNmZmZmMDAiLz48L3N2Zz4=';
  };

  const handleEditProduct = (product) => {
    // Navigate to product edit page
    navigate(`/wholesaler/products/edit/${product._id || product.id}`);
  };

  const handleDeleteProduct = (product) => {
    if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
      // In a real implementation, this would call the delete API
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
      <div style={{
        padding: '20px',
        background: 'var(--background-gradient)',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif',
        color: 'var(--text-main)'
      }}>
        <h2 style={{ color: 'var(--ocean-blue)' }}>Loading dashboard...</h2>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      background: 'var(--background-gradient)',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      overflowY: 'auto'
    }}>
      <Header
        title="Wholesaler Dashboard"
        subtitle="Manage your products and retailer orders"
      />
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '30px',
        marginTop: '20px'
      }}>
        <button
          onClick={() => navigate('/wholesaler/products')}
          style={{
            padding: '12px 25px',
            backgroundColor: '#00a8cc',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 4px 10px rgba(0, 168, 204, 0.3)',
            transition: 'all 0.3s ease',
            fontSize: '1rem'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 6px 15px rgba(0, 168, 204, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 10px rgba(0, 168, 204, 0.3)';
          }}
        >
          📦 Manage Inventory
        </button>
      </div>

      <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap' }}>
        {/* Product Management Section */}
        {/* Product Management Section */}
        <div style={{
          flex: 1,
          minWidth: '300px',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          padding: '30px',
          borderRadius: '20px',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          transition: 'transform 0.3s ease',
          height: '100%'
        }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '15px' }}>
            <span style={{ fontSize: '2.5rem' }}>📊</span>
            <h2 style={{
              color: 'var(--ocean-blue)',
              fontSize: '1.8rem',
              margin: 0
            }}>
              Business Overview
            </h2>
          </div>
          <div>
            <p style={{
              color: 'var(--text-secondary)',
              lineHeight: '1.6',
              marginBottom: '20px'
            }}>
              Manage your wholesale operations efficiently.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ padding: '15px', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '15px', textAlign: 'center' }}>
                <h3 style={{ margin: '0', fontSize: '2rem', color: '#2ecc71' }}>{products.length}</h3>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Active Products</span>
              </div>
              <div style={{ padding: '15px', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '15px', textAlign: 'center' }}>
                <h3 style={{ margin: '0', fontSize: '2rem', color: '#00a8cc' }}>{orders.length}</h3>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Pending Orders</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Management Section */}
        {/* Order Management Section */}
        <div style={{
          flex: 1,
          minWidth: '300px',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          padding: '30px',
          borderRadius: '20px',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          transition: 'transform 0.3s ease',
          height: '100%',
          overflowY: 'auto',
          maxHeight: '600px'
        }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontSize: '2.5rem' }}>📦</span>
              <h2 style={{
                color: 'var(--ocean-blue)',
                fontSize: '1.8rem',
                margin: 0
              }}>
                Recent Orders
              </h2>
            </div>
            <span style={{
              padding: '5px 15px',
              backgroundColor: 'rgba(0, 168, 204, 0.1)',
              color: 'var(--ocean-blue)',
              borderRadius: '20px',
              fontWeight: 'bold'
            }}>
              {orders.length}
            </span>
          </div>

          <div>
            {orders.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <p style={{ fontSize: '3rem', margin: '0 0 10px 0' }}>📭</p>
                <p style={{ fontSize: '1.1rem' }}>No orders found yet.</p>
              </div>
            ) : orders.map(order => (
              <div
                key={order._id}
                style={{
                  border: '1px solid rgba(0,0,0,0.05)',
                  marginBottom: '15px',
                  padding: '20px',
                  borderRadius: '15px',
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '15px'
                }}>
                  <h3 style={{
                    margin: 0,
                    color: 'var(--ocean-blue)',
                    fontSize: '1.1rem'
                  }}>
                    #{order.orderNumber?.slice(-6) || order._id.slice(-6)}
                  </h3>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                      style={{
                        padding: '6px 30px 6px 15px',
                        borderRadius: '20px',
                        border: 'none',
                        backgroundColor: order.status === 'delivered' ? '#2ecc71' :
                          order.status === 'shipped' ? '#3498db' :
                            order.status === 'cancelled' ? '#e74c3c' : '#f39c12',
                        color: 'white',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        appearance: 'none',
                        fontSize: '0.85rem'
                      }}
                    >
                      <option value="pending" style={{ color: 'black' }}>Pending</option>
                      <option value="confirmed" style={{ color: 'black' }}>Confirmed</option>
                      <option value="shipped" style={{ color: 'black' }}>Shipped</option>
                      <option value="delivered" style={{ color: 'black' }}>Delivered</option>
                      <option value="cancelled" style={{ color: 'black' }}>Cancelled</option>
                    </select>
                    <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'white', fontSize: '0.7rem' }}>▼</span>
                  </div>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  marginBottom: '15px'
                }}>
                  <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                    <strong>Buyer:</strong> {order.buyerName}
                    <span style={{
                      marginLeft: '8px',
                      padding: '2px 8px',
                      backgroundColor: order.buyerRole === 'customer' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(33, 150, 243, 0.1)',
                      color: order.buyerRole === 'customer' ? '#2e7d32' : '#1565c0',
                      borderRadius: '10px',
                      fontSize: '0.7rem',
                      fontWeight: '800',
                      textTransform: 'uppercase',
                      border: `1px solid ${order.buyerRole === 'customer' ? '#2e7d32' : '#1565c0'}`
                    }}>
                      {order.buyerRole === 'customer' ? 'CUST' : 'RET'}
                    </span>
                  </p>
                  <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                    <strong>Items:</strong> {order.items.reduce((acc, item) => acc + item.quantity, 0)}
                  </p>
                  <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                    <strong>Total:</strong> <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>₹{order.totalAmount}</span>
                  </p>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div style={{ marginTop: '40px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{
            color: 'var(--ocean-blue)',
            margin: 0,
            fontSize: '1.8rem'
          }}>
            Your Products
          </h2>
          <button
            onClick={() => navigate('/wholesaler/products')}
            style={{
              padding: '12px 25px',
              backgroundColor: '#2ecc71',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 4px 10px rgba(46, 204, 113, 0.3)',
              transition: 'all 0.3s ease',
              fontSize: '1rem'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 6px 15px rgba(46, 204, 113, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 10px rgba(46, 204, 113, 0.3)';
            }}
          >
            Add New Product
          </button>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '25px'
        }}>
          {products.map(product => (
            <WholesalerProductCard
              key={product._id || product.id}
              product={product}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default WholesalerDashboard;