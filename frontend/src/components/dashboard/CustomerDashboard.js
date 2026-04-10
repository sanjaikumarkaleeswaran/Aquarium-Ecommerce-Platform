import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../shared/Header';
import { getAllRetailerProducts } from '../../services/retailerService';
import { getOrders } from '../../services/orderService';
import { getPersonalizedRecommendations, recordUserInteraction } from '../../services/recommendationService';
import { getDisplayPrice } from '../../utils/userUtils';
import ProductCard from '../shared/ProductCard';
import './CustomerDashboard.css';

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
      <div className="dashboard-loading">
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Header
        title="Customer Dashboard"
        subtitle={`Welcome back, ${user?.name || 'Customer'}! 🐠`}
      />

      <div className="action-bar animate-fade-in" style={{ marginTop: '20px' }}>
        <div className="action-buttons">
          <button
            onClick={() => navigate('/customer/cart')}
            className="btn-cart action-btn"
          >
            🛒 Cart ({cart.length})
          </button>

          <button
            onClick={() => navigate('/customer/orders')}
            className="btn-orders action-btn"
          >
            📦 Orders ({myOrders.length})
          </button>

          <button
            onClick={() => navigate('/customer/products')}
            className="btn-browse action-btn"
          >
            Browse All
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="card stat-card" onClick={() => navigate('/customer/cart')}>
          <h3>🛒 Your Cart</h3>
          <p className="stat-value" style={{ color: '#00a8cc' }}>{cart.length}</p>
          <span className="text-secondary">active items</span>
        </div>

        <div className="card stat-card" onClick={() => navigate('/customer/products')}>
          <h3>🐠 Inventory</h3>
          <p className="stat-value" style={{ color: '#4ecdc4' }}>{totalProductsCount}</p>
          <span className="text-secondary">available now</span>
        </div>

        <div className="card stat-card">
          <h3>🏆 Rewards</h3>
          <p className="stat-value" style={{ color: '#1dd1a1' }}>1250</p>
          <span className="text-secondary">points earned</span>
        </div>

        <div className="card stat-card" onClick={() => navigate('/customer/orders')}>
          <h3>📦 Purchases</h3>
          <p className="stat-value" style={{ color: '#f368e0' }}>{myOrders.length}</p>
          <span className="text-secondary">orders placed</span>
        </div>
      </div>

      {/* My Recent Orders Section */}
      <div className="section-container animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <h2 className="ocean-blue" style={{ marginBottom: '20px', fontSize: '1.5rem' }}>
          📦 Recent Orders
        </h2>

        {myOrders.length === 0 ? (
          <div className="card text-center" style={{ padding: '30px' }}>
            <p className="text-secondary">No orders yet. Discover our collection!</p>
            <button
              onClick={() => navigate('/customer/products')}
              className="btn-primary"
              style={{ marginTop: '15px' }}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="orders-grid">
            {myOrders.slice(0, 3).map(order => (
              <div
                key={order._id || order.id}
                className="card order-card-item"
                onClick={() => navigate('/customer/orders')}
                style={{ padding: '20px' }}
              >
                <div className="flex justify-between items-start" style={{ marginBottom: '15px' }}>
                  <div>
                    <span className="font-bold ocean-blue">#{order.orderNumber?.slice(-6) || (order._id && order._id.slice(-6))}</span>
                    <div className="text-secondary" style={{ fontSize: '0.8rem', marginTop: '3px' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span
                    className="order-status-badge"
                    style={{
                      backgroundColor: order.status === 'delivered' ? '#2ecc71' :
                        order.status === 'shipped' ? '#3498db' : '#f39c12',
                      fontSize: '0.75rem',
                      padding: '4px 10px',
                      borderRadius: '15px',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  >
                    {order.status.toUpperCase()}
                  </span>
                </div>

                <div className="flex justify-between items-center" style={{ marginBottom: '10px', fontSize: '0.9rem' }}>
                  <span className="text-secondary">{order.items.length} item(s)</span>
                  <span className="font-bold text-success">₹{order.totalAmount}</span>
                </div>

                <div className="text-secondary" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', fontSize: '0.85rem' }}>
                  Store: <strong>{order.sellerName}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Products Section */}
      <div className="section-container animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: '20px' }}>
          <h2 className="ocean-blue" style={{ margin: 0, fontSize: '1.5rem' }}>🔥 Just for You</h2>
          <button 
            className="btn-sm" 
            onClick={() => navigate('/customer/products?tab=recommended')}
            style={{ padding: '6px 15px', cursor: 'pointer' }}
          >
            View More
          </button>
        </div>
        <div className="responsive-grid">
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
    </div>
  );
}

export default CustomerDashboard;
ort default CustomerDashboard;