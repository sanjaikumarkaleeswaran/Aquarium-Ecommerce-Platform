import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../shared/Header';
import { getAllRetailerProducts } from '../../services/retailerService';
import { getOrders } from '../../services/orderService';
import { getPersonalizedRecommendations, recordUserInteraction } from '../../services/recommendationService';
import { getDisplayPrice } from '../../utils/userUtils';
import ProductCard from '../shared/ProductCard';

function CustomerDashboard() {
  const [user, setUser] = useState({ name: 'John Doe' }); // Mock user data
  const [products, setProducts] = useState([]);
  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myOrders, setMyOrders] = useState([]);

  // Initialize cart from localStorage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('customerCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const navigate = useNavigate();

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('customerCart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data from sessionStorage
        const storedUser = JSON.parse(sessionStorage.getItem('user'));
        if (storedUser) {
          setUser(storedUser);
        }

        // Fetch real RETAILER products from the backend (not wholesaler)
        const productsData = await getAllRetailerProducts();

        let productList = [];
        if (productsData && productsData.products && Array.isArray(productsData.products)) {
          productList = productsData.products;
        } else if (Array.isArray(productsData)) {
          productList = productsData;
        }

        // Use real products for display
        setTotalProductsCount(productList.length);
        setProducts(productList.slice(0, 8)); // Limit to 8 products for display

        // Get AI Recommendations
        const userId = storedUser ? (storedUser._id || storedUser.id) : null;
        if (userId) {
          const recommendations = await getPersonalizedRecommendations(userId);
          setRecommendedProducts(recommendations);
        } else {
          // Fallback if no user
          setRecommendedProducts(productList.slice(0, 4));
        }

        // Fetch user orders
        try {
          const ordersData = await getOrders();
          const userData = JSON.parse(sessionStorage.getItem('user'));
          const userId = userData?._id || userData?.id;

          console.log('Fetching orders for customer:', userId);
          console.log('All orders:', ordersData.orders);

          // Filter orders where user is buyer
          const userOrders = ordersData.orders ? ordersData.orders.filter(o => {
            const buyerId = o.buyer?._id || o.buyer;
            return buyerId === userId;
          }) : [];

          console.log('Customer orders found:', userOrders);
          setMyOrders(userOrders);
        } catch (err) {
          console.error("Error fetching orders:", err);
          setMyOrders([]);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const addToCart = (product) => {
    const productId = product._id || product.id;
    if (!productId) {
      alert("Error: Product ID missing");
      return;
    }

    const existingItemIndex = cart.findIndex(item => {
      const itemProductId = item.product?._id || item.product?.id;
      return itemProductId && String(itemProductId) === String(productId);
    });

    let newCart;
    if (existingItemIndex > -1) {
      newCart = [...cart];
      newCart[existingItemIndex].quantity += 1;
    } else {
      newCart = [...cart, { product, quantity: 1 }];
    }
    setCart(newCart);
    alert(`${product.name} added to cart!`);
  };

  const handleProductView = (product) => {
    // Navigate to product detail page
    navigate(`/customer/product/${product._id || product.id}`);
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
      fontFamily: 'Arial, sans-serif'
    }}>
      <Header
        title="Customer Dashboard"
        subtitle={`Welcome back, ${user?.name || 'Customer'}! Here's what's new in your aquarium world`}
      />

      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '30px',
        marginTop: '20px'
      }}>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button
            onClick={() => navigate('/customer/cart')}
            style={{
              padding: '12px 25px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 4px 10px rgba(231, 76, 60, 0.3)',
              transition: 'all 0.3s ease',
              fontSize: '1rem'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 6px 15px rgba(231, 76, 60, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 10px rgba(231, 76, 60, 0.3)';
            }}
          >
            🛒 View Cart ({cart.length})
          </button>

          <button
            onClick={() => navigate('/customer/orders')}
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
            📦 My Orders ({myOrders.length})
          </button>

          <button
            onClick={() => navigate('/customer/products')}
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
            Browse All Products
          </button>
        </div>
      </div>

      {/* Stats Cards */}
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
          border: '1px solid var(--border-color)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          cursor: 'pointer'
        }}
          onClick={() => navigate('/customer/cart')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.08)';
          }}
        >
          <h3 style={{
            color: 'var(--ocean-blue)',
            margin: '0 0 10px 0',
            fontSize: '1rem'
          }}>
            🛒 Your Cart
          </h3>
          <p style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#00a8cc',
            margin: '0'
          }}>
            {cart.length}
          </p>
          <p style={{
            color: 'var(--text-secondary)',
            margin: '5px 0 0 0',
            fontSize: '0.9rem'
          }}>
            items
          </p>
        </div>

        <div style={{
          backgroundColor: 'var(--card-bg)',
          padding: '20px',
          borderRadius: '15px',
          boxShadow: '0 6px 15px rgba(0, 0, 0, 0.08)',
          border: '1px solid var(--border-color)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          cursor: 'pointer'
        }}
          onClick={() => navigate('/customer/products')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.08)';
          }}
        >
          <h3 style={{
            color: 'var(--ocean-blue)',
            margin: '0 0 10px 0',
            fontSize: '1rem'
          }}>
            🐠 Products
          </h3>
          <p style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#4ecdc4',
            margin: '0'
          }}>
            {totalProductsCount}
          </p>
          <p style={{
            color: 'var(--text-secondary)',
            margin: '5px 0 0 0',
            fontSize: '0.9rem'
          }}>
            available
          </p>
        </div>

        <div style={{
          backgroundColor: 'var(--card-bg)',
          padding: '20px',
          borderRadius: '15px',
          boxShadow: '0 6px 15px rgba(0, 0, 0, 0.08)',
          border: '1px solid var(--border-color)',
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
          <h3 style={{
            color: 'var(--ocean-blue)',
            margin: '0 0 10px 0',
            fontSize: '1rem'
          }}>
            🏆 Rewards
          </h3>
          <p style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#1dd1a1',
            margin: '0'
          }}>
            1250
          </p>
          <p style={{
            color: 'var(--text-secondary)',
            margin: '5px 0 0 0',
            fontSize: '0.9rem'
          }}>
            points
          </p>
        </div>

        <div style={{
          backgroundColor: 'var(--card-bg)',
          padding: '20px',
          borderRadius: '15px',
          boxShadow: '0 6px 15px rgba(0, 0, 0, 0.08)',
          border: '1px solid var(--border-color)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          cursor: 'pointer'
        }}
          onClick={() => navigate('/customer/orders')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.08)';
          }}
        >
          <h3 style={{
            color: 'var(--ocean-blue)',
            margin: '0 0 10px 0',
            fontSize: '1rem'
          }}>
            📦 Orders
          </h3>
          <p style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#f368e0',
            margin: '0'
          }}>
            {myOrders.length}
          </p>
          <p style={{
            color: 'var(--text-secondary)',
            margin: '5px 0 0 0',
            fontSize: '0.9rem'
          }}>
            this month
          </p>
        </div>
      </div>

      {/* My Recent Orders Section */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{
          color: 'var(--ocean-blue)',
          margin: '0 0 20px 0',
          fontSize: '1.8rem'
        }}>
          📦 My Recent Orders
        </h2>

        {myOrders.length === 0 ? (
          <div style={{
            backgroundColor: 'var(--card-bg)',
            padding: '40px',
            borderRadius: '15px',
            textAlign: 'center',
            color: 'var(--text-secondary)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
          }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '15px' }}>You haven't placed any orders yet.</p>
            <button
              onClick={() => navigate('/customer/products')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#00a8cc',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '25px'
          }}>
            {myOrders.slice(0, 3).map(order => (
              <div
                key={order._id || order.id}
                style={{
                  backgroundColor: 'var(--card-bg)',
                  padding: '20px',
                  borderRadius: '15px',
                  boxShadow: '0 6px 15px rgba(0, 0, 0, 0.08)',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onClick={() => navigate('/customer/orders')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <div>
                    <span style={{ fontWeight: 'bold', color: 'var(--ocean-blue)' }}>#{order.orderNumber?.slice(-6) || (order._id && order._id.slice(-6))}</span>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span style={{
                    padding: '5px 12px',
                    borderRadius: '20px',
                    backgroundColor: order.status === 'delivered' ? '#2ecc71' :
                      order.status === 'shipped' ? '#3498db' : '#f39c12',
                    color: 'white',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    height: 'fit-content'
                  }}>
                    {order.status.toUpperCase()}
                  </span>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <p style={{ margin: '5px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <strong>Items:</strong> {order.items.length}
                  </p>
                  <p style={{ margin: '5px 0', fontSize: '0.95rem', fontWeight: 'bold', color: '#2ecc71' }}>
                    <strong>Total:</strong> ₹{order.totalAmount}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Sold by: <strong>{order.sellerName}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Products Section */}
      <div style={{ marginBottom: '40px' }}>
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
            🔥 Recommended for You
          </h2>
          <a
            href="#"
            style={{
              color: '#00a8cc',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
            onClick={(e) => {
              e.preventDefault();
              navigate('/customer/products?tab=recommended');
            }}
          >
            View All →
          </a>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '25px'
        }}>
          {recommendedProducts.map(product => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              onAddToCart={addToCart}
              onViewDetails={handleProductView}
              onViewLocations={(product) => navigate(`/customer/product/${product._id || product.id}/locations`)}
              showRecommendedBadge={true}
            />
          ))}
        </div>
      </div>

      {/* All Products Section */}
      <div>
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
            All Products
          </h2>
          <a
            href="#"
            style={{
              color: '#00a8cc',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
            onClick={(e) => {
              e.preventDefault();
              navigate('/customer/products');
            }}
          >
            View All →
          </a>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '25px'
        }}>
          {products.map(product => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              onAddToCart={addToCart}
              onViewDetails={handleProductView}
              onViewLocations={(product) => navigate(`/customer/product/${product._id || product.id}/locations`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;