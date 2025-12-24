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
        subtitle={`Welcome back, ${user?.name || 'Customer'}! Here's what's new in your aquarium world`}
      />

      <div className="action-bar">
        <div className="action-buttons">
          <button
            onClick={() => navigate('/customer/cart')}
            className="action-btn btn-cart"
          >
            🛒 View Cart ({cart.length})
          </button>

          <button
            onClick={() => navigate('/customer/orders')}
            className="action-btn btn-orders"
          >
            📦 My Orders ({myOrders.length})
          </button>

          <button
            onClick={() => navigate('/customer/products')}
            className="action-btn btn-browse"
          >
            Browse All Products
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div
          className="stat-card"
          onClick={() => navigate('/customer/cart')}
        >
          <h3>🛒 Your Cart</h3>
          <p className="stat-value" style={{ color: '#00a8cc' }}>
            {cart.length}
          </p>
          <p className="stat-label">items</p>
        </div>

        <div
          className="stat-card"
          onClick={() => navigate('/customer/products')}
        >
          <h3>🐠 Products</h3>
          <p className="stat-value" style={{ color: '#4ecdc4' }}>
            {totalProductsCount}
          </p>
          <p className="stat-label">available</p>
        </div>

        <div className="stat-card">
          <h3>🏆 Rewards</h3>
          <p className="stat-value" style={{ color: '#1dd1a1' }}>
            1250
          </p>
          <p className="stat-label">points</p>
        </div>

        <div
          className="stat-card"
          onClick={() => navigate('/customer/orders')}
        >
          <h3>📦 Orders</h3>
          <p className="stat-value" style={{ color: '#f368e0' }}>
            {myOrders.length}
          </p>
          <p className="stat-label">this month</p>
        </div>
      </div>

      {/* My Recent Orders Section */}
      <div className="section-container">
        <h2 className="section-title" style={{ marginBottom: '20px' }}>
          📦 My Recent Orders
        </h2>

        {myOrders.length === 0 ? (
          <div className="empty-orders">
            <p style={{ fontSize: '1.1rem', marginBottom: '15px' }}>You haven't placed any orders yet.</p>
            <button
              onClick={() => navigate('/customer/products')}
              className="start-shopping-btn"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="orders-grid">
            {myOrders.slice(0, 3).map(order => (
              <div
                key={order._id || order.id}
                className="order-card-item"
                onClick={() => navigate('/customer/orders')}
              >
                <div className="order-card-header">
                  <div>
                    <span className="order-id">#{order.orderNumber?.slice(-6) || (order._id && order._id.slice(-6))}</span>
                    <div className="order-date">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span
                    className="order-status-badge"
                    style={{
                      backgroundColor: order.status === 'delivered' ? '#2ecc71' :
                        order.status === 'shipped' ? '#3498db' : '#f39c12',
                    }}
                  >
                    {order.status.toUpperCase()}
                  </span>
                </div>

                <div className="order-details" style={{ marginBottom: '15px' }}>
                  <p>
                    <strong>Items:</strong> {order.items.length}
                  </p>
                  <p className="order-total">
                    <strong>Total:</strong> ₹{order.totalAmount}
                  </p>
                </div>

                <div className="order-seller">
                  Sold by: <strong>{order.sellerName}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Products Section */}
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">
            🔥 Recommended for You
          </h2>
          <a
            href="#"
            className="view-all-link"
            onClick={(e) => {
              e.preventDefault();
              navigate('/customer/products?tab=recommended');
            }}
          >
            View All →
          </a>
        </div>
        <div className="products-grid">
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
        <div className="section-header">
          <h2 className="section-title">
            All Products
          </h2>
          <a
            href="#"
            className="view-all-link"
            onClick={(e) => {
              e.preventDefault();
              navigate('/customer/products');
            }}
          >
            View All →
          </a>
        </div>
        <div className="products-grid">
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