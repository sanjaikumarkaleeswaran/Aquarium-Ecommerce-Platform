import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../shared/Header';
import { getOrders, updateOrderStatus } from '../../services/orderService';
import { getMyInventory, purchaseFromWholesaler } from '../../services/retailerService';

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

      // Get user info from sessionStorage
      const userData = JSON.parse(sessionStorage.getItem('user'));
      setUser(userData);

      // Fetch retailer's own products (from inventory)
      const productsData = await getMyInventory();
      setMyProducts(productsData.retailerProducts || productsData.products || []);

      // Fetch orders (both orders placed by retailer and orders from customers)
      const ordersRes = await getOrders();
      const ordersData = ordersRes.orders || [];

      // Separate orders: retailer's purchases vs customer orders
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

  return (
    <div style={{
      padding: '20px',
      background: 'var(--background-gradient)',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      overflowY: 'auto'
    }}>
      <Header
        title="Retailer Dashboard"
        subtitle={`Welcome, ${user?.name || 'Retailer'}! Manage your products and orders`}
      />

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '30px',
        marginTop: '20px'
      }}>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/retailer/products')}
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
            📦 Manage My Products
          </button>

          <button
            onClick={() => navigate('/retailer/wholesaler-products')}
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
            🛒 Browse Wholesaler Products
          </button>

          <button
            onClick={() => navigate('/retailer/orders')}
            style={{
              padding: '12px 25px',
              backgroundColor: '#f39c12',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 4px 10px rgba(243, 156, 18, 0.3)',
              transition: 'all 0.3s ease',
              fontSize: '1rem'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 6px 15px rgba(243, 156, 18, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 10px rgba(243, 156, 18, 0.3)';
            }}
          >
            🚚 Track My Orders
          </button>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          backgroundColor: 'var(--card-bg)',
          padding: '20px',
          borderRadius: '15px',
          boxShadow: '0 6px 15px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(46, 204, 113, 0.2)',
          textAlign: 'center',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          cursor: 'pointer'
        }}
          onClick={() => navigate('/retailer/products')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.08)';
          }}
        >
          <h3 style={{ color: '#2ecc71', fontSize: '1rem', margin: '0 0 10px 0' }}>
            📦 My Products
          </h3>
          <p style={{ color: '#2ecc71', fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
            {myProducts.length}
          </p>
          <p style={{ color: 'var(--text-secondary)', margin: '5px 0 0 0', fontSize: '0.9rem' }}>active items</p>
        </div>

        <div style={{
          backgroundColor: 'var(--card-bg)',
          padding: '20px',
          borderRadius: '15px',
          boxShadow: '0 6px 15px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 168, 204, 0.2)',
          textAlign: 'center',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          cursor: 'pointer'
        }}
          onClick={() => navigate('/retailer/orders')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.08)';
          }}
        >
          <h3 style={{ color: '#00a8cc', fontSize: '1rem', margin: '0 0 10px 0' }}>
            🛒 Incoming Orders
          </h3>
          <p style={{ color: '#00a8cc', fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
            {myOrders.length}
          </p>
          <p style={{ color: 'var(--text-secondary)', margin: '5px 0 0 0', fontSize: '0.9rem' }}>from wholesalers</p>
        </div>

        <div style={{
          backgroundColor: 'var(--card-bg)',
          padding: '20px',
          borderRadius: '15px',
          boxShadow: '0 6px 15px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(243, 156, 18, 0.2)',
          textAlign: 'center',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          cursor: 'pointer'
        }}
          // onClick={() => navigate('/retailer/customer-orders')} // If such page existed
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.08)';
          }}
        >
          <h3 style={{ color: '#f39c12', fontSize: '1rem', margin: '0 0 10px 0' }}>
            👥 Customer Orders
          </h3>
          <p style={{ color: '#f39c12', fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
            {customerOrders.length}
          </p>
          <p style={{ color: 'var(--text-secondary)', margin: '5px 0 0 0', fontSize: '0.9rem' }}>sales made</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap' }}>
        {/* My Products Section */}
        <div style={{
          flex: 1,
          minWidth: '300px',
          backgroundColor: 'var(--card-bg)',
          padding: '25px',
          borderRadius: '15px',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(46, 204, 113, 0.2)',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2 style={{
              color: 'var(--ocean-blue)',
              fontSize: '1.8rem',
              margin: 0
            }}>
              My Products
            </h2>
            <button
              onClick={() => navigate('/retailer/products')}
              style={{
                padding: '8px 15px',
                backgroundColor: '#2ecc71',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}
            >
              + Add New
            </button>
          </div>

          {loading ? (
            <p style={{ color: 'var(--text-main)' }}>Loading products...</p>
          ) : myProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
              <p>No products yet. Add your first product!</p>
              <button
                onClick={() => navigate('/retailer/products')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#2ecc71',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  marginTop: '15px',
                  fontWeight: 'bold'
                }}
              >
                Add Product
              </button>
            </div>
          ) : (
            <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '5px' }}>
              {myProducts.slice(0, 5).map(product => (
                <div
                  key={product._id}
                  style={{
                    border: '1px solid var(--border-color)',
                    marginBottom: '10px',
                    padding: '15px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px'
                  }}
                  onClick={() => navigate('/retailer/products')}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
                >
                  <h4 style={{ margin: 0, color: 'var(--ocean-blue)', fontSize: '1.1rem' }}>
                    {product.name}
                  </h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)' }}>
                      {product.category}
                    </span>
                    <span style={{
                      fontSize: '0.85rem',
                      color: (product.quantity || product.stock || 0) < 5 ? '#e74c3c' : '#2ecc71',
                      fontWeight: 'bold'
                    }}>
                      {(product.quantity || product.stock || 0) > 0 ? `${product.quantity || product.stock} in stock` : 'Out of Stock'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      Price:
                    </span>
                    <span style={{ fontWeight: 'bold', color: 'var(--text-main)', fontSize: '1.1rem' }}>
                      ₹{product.priceCustomer || product.price || 0}
                    </span>
                  </div>
                </div>
              ))}
              {myProducts.length > 5 && (
                <button
                  onClick={() => navigate('/retailer/products')}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: 'var(--ocean-blue)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    marginTop: '15px',
                    fontWeight: 'bold',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.opacity = '0.9'}
                  onMouseOut={(e) => e.target.style.opacity = '1'}
                >
                  View All {myProducts.length} Products →
                </button>
              )}
            </div>
          )}
        </div>

        {/* My Purchases from Wholesalers */}
        <div style={{
          flex: 1,
          minWidth: '300px',
          backgroundColor: 'var(--card-bg)',
          padding: '25px',
          borderRadius: '15px',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 168, 204, 0.2)',
        }}>
          <h2 style={{
            color: 'var(--ocean-blue)',
            fontSize: '1.8rem',
            marginBottom: '20px'
          }}>
            Incoming Inventory
          </h2>

          {loading ? (
            <p style={{ color: 'var(--text-main)' }}>Loading...</p>
          ) : myOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
              <p>No orders placed yet.</p>
              <button
                onClick={() => navigate('/retailer/wholesaler-products')}
                style={{
                  marginTop: '10px',
                  padding: '8px 15px',
                  backgroundColor: '#00a8cc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer'
                }}
              >
                Browse Wholesalers
              </button>
            </div>
          ) : (
            <div>
              {myOrders.slice(0, 5).map(order => (
                <div
                  key={order._id}
                  style={{
                    border: '1px solid var(--border-color)',
                    margin: '15px 0',
                    padding: '20px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0, color: 'var(--ocean-blue)' }}>#{order.orderNumber?.slice(-6) || order._id.slice(-6)}</h3>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '15px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      color: 'white',
                      backgroundColor: order.status === 'delivered' ? '#2ecc71' :
                        order.status === 'shipped' ? '#3498db' : '#f39c12'
                    }}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                  <p style={{ margin: '5px 0', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    <strong>Seller:</strong> {order.sellerName}
                  </p>
                  <p style={{ margin: '5px 0', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    <strong>Items:</strong> {order.items.length} | <strong>Total:</strong> ₹{order.totalAmount}
                  </p>

                  {order.status === 'delivered' && !order.isInventoryAdded && (
                    <button
                      onClick={() => handleReceiveInventory(order._id)}
                      style={{
                        width: '100%',
                        marginTop: '10px',
                        padding: '8px',
                        backgroundColor: '#2ecc71',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      📥 Receive & Add to Inventory
                    </button>
                  )}
                  {order.isInventoryAdded && (
                    <div style={{
                      marginTop: '10px',
                      padding: '8px',
                      backgroundColor: 'var(--input-bg)',
                      color: '#2e7d32',
                      textAlign: 'center',
                      borderRadius: '5px',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      border: '1px solid #2e7d32'
                    }}>
                      ✅ Added to Inventory
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Customer Orders Management Section */}
      <div style={{
        marginTop: '30px',
        backgroundColor: 'var(--card-bg)',
        padding: '25px',
        borderRadius: '15px',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(243, 156, 18, 0.2)',
      }}>
        <h2 style={{
          color: 'var(--ocean-blue)',
          fontSize: '1.8rem',
          marginBottom: '20px'
        }}>
          Customer Orders Management
        </h2>

        {loading ? (
          <p style={{ color: 'var(--text-main)' }}>Loading orders...</p>
        ) : customerOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
            <p>No customer orders to manage yet.</p>
            <p style={{ fontSize: '0.9rem' }}>
              When customers buy your products, their orders will appear here.
            </p>
          </div>
        ) : (
          <div>
            {customerOrders.map(order => (
              <div
                key={order._id}
                style={{
                  border: '1px solid var(--border-color)',
                  margin: '15px 0',
                  padding: '20px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '15px',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <h3 style={{
                      margin: 0,
                      color: 'var(--ocean-blue)'
                    }}>
                      Order #{order.orderNumber?.slice(-6) || order._id.slice(-6)}
                    </h3>
                    <span style={{
                      padding: '4px 10px',
                      backgroundColor: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '5px',
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)'
                    }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ fontWeight: 'bold', color: 'var(--text-secondary)' }}>Status:</label>
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                      style={{
                        padding: '8px 15px',
                        borderRadius: '20px',
                        border: 'none',
                        backgroundColor: order.status === 'delivered' ? '#2ecc71' :
                          order.status === 'shipped' ? '#3498db' :
                            order.status === 'cancelled' ? '#e74c3c' : '#f39c12',
                        color: 'white',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        outline: 'none',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                      }}
                    >
                      <option value="pending" style={{ color: 'black' }}>Pending</option>
                      <option value="confirmed" style={{ color: 'black' }}>Confirmed</option>
                      <option value="processing" style={{ color: 'black' }}>Processing</option>
                      <option value="shipped" style={{ color: 'black' }}>Shipped</option>
                      <option value="delivered" style={{ color: 'black' }}>Delivered</option>
                      <option value="cancelled" style={{ color: 'black' }}>Cancelled</option>
                    </select>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '15px',
                  paddingTop: '15px',
                  borderTop: '1px solid var(--border-color)'
                }}>
                  <div>
                    <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Customer</p>
                    <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--text-main)' }}>{order.buyerName}</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{order.buyerEmail}</p>
                  </div>

                  <div>
                    <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Items</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', color: 'var(--text-main)' }}>
                      {order.items.map((item, idx) => (
                        <div key={idx} style={{ fontSize: '0.9rem' }}>
                          <span style={{ fontWeight: 'bold' }}>{item.quantity}x</span> {item.name}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Amount</p>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#2ecc71', fontSize: '1.2rem' }}>
                      ₹{order.totalAmount}
                    </p>
                  </div>

                  <div>
                    <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Shipping</p>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                      {order.shippingAddress?.city}, {order.shippingAddress?.state}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Business Model Info */}
      <div style={{
        marginTop: '30px',
        backgroundColor: 'var(--card-bg)',
        padding: '25px',
        borderRadius: '15px',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
      }}>
        <h2 style={{ color: 'var(--ocean-blue)', marginBottom: '15px' }}>
          💡 Retailer Business Model
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div>
            <h4 style={{ color: '#2ecc71', marginBottom: '10px' }}>📦 Sell Your Products</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Add your own products and sell directly to customers at retail prices.
            </p>
          </div>
          <div>
            <h4 style={{ color: '#00a8cc', marginBottom: '10px' }}>🛒 Buy from Wholesalers</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Purchase products from wholesalers at wholesale prices and resell to customers.
            </p>
          </div>
          <div>
            <h4 style={{ color: '#f39c12', marginBottom: '10px' }}>💰 Dual Revenue Stream</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Earn from both your own products and reselling wholesaler products.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RetailerDashboard;