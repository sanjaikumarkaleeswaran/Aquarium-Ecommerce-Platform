import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { searchProducts } from '../../services/productService';
import { getAllRetailerProducts } from '../../services/retailerService';
import { placeOrder } from '../../services/orderService';
import { getPersonalizedRecommendations, getTrendingProducts, recordUserInteraction, getRelatedProducts, getProductsByCategory } from '../../services/recommendationService';
import Header from '../shared/Header';
import ProductCard from '../shared/ProductCard';
import UnifiedCart from '../shared/UnifiedCart';
import { getDisplayPrice } from '../../utils/userUtils';
import { useToast } from '../shared/ToastProvider';
import PaymentGateway from '../shared/PaymentGateway';

function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'recommended', 'trending'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  // Mock user ID for demonstration
  const userId = "user-123";

  useEffect(() => {
    // Check if user is authenticated
    const token = sessionStorage.getItem('token');
    const user = JSON.parse(sessionStorage.getItem('user'));

    if (token && user) {
      setIsAuthenticated(true);
      // Redirect to appropriate dashboard based on user role
      if (user.role === 'admin') {
        navigate('/dashboard/admin');
      } else if (user.role === 'wholesaler') {
        navigate('/dashboard/wholesaler');
      } else if (user.role === 'retailer') {
        navigate('/dashboard/retailer');
      } else {
        // Customer or default role, stay on product catalog
        fetchProducts();
        // Load recommendations
        setRecommendedProducts(getPersonalizedRecommendations(userId, 4));
        setTrendingProducts(getTrendingProducts(4));

        // Load cart from localStorage
        const savedCart = localStorage.getItem('customerCart');
        if (savedCart) {
          try {
            setCart(JSON.parse(savedCart));
          } catch (error) {
            console.error('Error loading cart:', error);
          }
        }
      }
    } else {
      // Redirect to login if not authenticated
      navigate('/');
    }
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      // Get retailer products (not wholesaler products)
      const data = await getAllRetailerProducts();
      console.log('Fetched products data:', data);

      // Handle backend response format: { count, products }
      let productList = [];
      if (data && data.products && Array.isArray(data.products)) {
        productList = data.products;
      } else if (Array.isArray(data)) {
        productList = data;
      }

      // If no products from backend, use mock products
      if (productList.length === 0) {
        // Use mock products from recommendation service
        const mockProducts = getPersonalizedRecommendations(userId, 20);
        setProducts(mockProducts);
      } else {
        setProducts(productList);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to mock products if backend fails
      const mockProducts = getPersonalizedRecommendations(userId, 20);
      setProducts(mockProducts);
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      const data = await searchProducts(searchQuery, selectedCategory);
      console.log('Search results:', data);

      // Handle backend response format: { count, products }
      let productList = [];
      if (data && data.products && Array.isArray(data.products)) {
        productList = data.products;
      } else if (Array.isArray(data)) {
        productList = data;
      }

      // If no products from backend, filter mock products
      if (productList.length === 0) {
        const mockProducts = getPersonalizedRecommendations(userId, 20);
        let filteredProducts = mockProducts;

        if (searchQuery) {
          filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        if (selectedCategory) {
          filteredProducts = filteredProducts.filter(product =>
            product.category === selectedCategory
          );
        }

        setProducts(filteredProducts);
      } else {
        setProducts(productList);
      }
      setActiveTab('all');
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const handleAddToCart = (product) => {
    const productId = product._id || product.id;
    if (!productId) {
      console.error('Product missing ID:', product);
      toast.error('Cannot add product: Missing ID');
      return;
    }

    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex(item => {
      const itemProductId = item.product?._id || item.product?.id;
      // Only match if both IDs are valid and equal
      return itemProductId && productId && String(itemProductId) === String(productId);
    });

    let newCart;
    if (existingItemIndex !== -1) {
      // Product exists, increment quantity
      newCart = cart.map((item, index) => {
        if (index === existingItemIndex) {
          return { ...item, quantity: (item.quantity || 1) + 1 };
        }
        return item;
      });
      toast.info(`Increased quantity for ${product.name}`);
    } else {
      // New product, add to cart
      newCart = [...cart, { product: product, quantity: 1 }];
      toast.success(`${product.name} added to cart!`);
    }

    setCart(newCart);
    localStorage.setItem('customerCart', JSON.stringify(newCart));
    recordUserInteraction(userId, productId, 'cart');
  };

  const handleRemoveFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    localStorage.setItem('customerCart', JSON.stringify(newCart));
  };

  const handleUpdateQuantity = (index, delta) => {
    const newCart = [...cart];
    newCart[index].quantity = (newCart[index].quantity || 1) + delta;
    if (newCart[index].quantity < 1) newCart[index].quantity = 1;
    setCart(newCart);
    localStorage.setItem('customerCart', JSON.stringify(newCart));
  };

  const handleCheckoutClick = () => {
    setShowCart(false);
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (paymentDetails) => {
    try {
      const user = JSON.parse(sessionStorage.getItem('user'));

      const orderData = {
        items: cart.map(item => ({
          product: item.product._id || item.product.id,
          quantity: item.quantity
        })),
        shippingAddress: {
          name: user?.name || paymentDetails.cardName || 'Valued Customer',
          phone: user?.phone || '9999999999',
          street: '123 Ocean View',
          city: 'Chennai',
          state: 'Tamil Nadu',
          zipCode: '600001',
          country: 'India'
        },
        paymentMethod: 'credit-card',
        paymentDetails: {
          last4: paymentDetails.cardNumber.slice(-4),
          brand: 'Visa' // Mock
        }
      };

      await placeOrder(orderData);
      setCart([]);
      localStorage.removeItem('customerCart');
      setShowPayment(false);
      toast.success('Order placed successfully! 🎉');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Error placing order: ' + (error.response?.data?.message || error.message));
      setShowPayment(false);
    }
  };

  const handleProductView = (product) => {
    recordUserInteraction(userId, product._id || product.id, 'view');
    // Navigate to product detail page
    navigate(`/customer/product/${product._id || product.id}`);
  };

  // Filter products based on active tab
  const getFilteredProducts = () => {
    switch (activeTab) {
      case 'recommended':
        return recommendedProducts;
      case 'trending':
        return trendingProducts;
      default:
        // If a category is selected, filter products by category
        if (selectedCategory) {
          // Try to get products from backend first
          const filteredProducts = products.filter(product => product.category === selectedCategory);
          if (filteredProducts.length > 0) {
            return filteredProducts;
          }
          // If no backend products, use mock products
          return getProductsByCategory(selectedCategory);
        }
        return products;
    }
  };

  const displayedProducts = getFilteredProducts();

  if (loading) {
    return (
      <div style={{
        padding: '20px',
        background: 'var(--background-gradient)',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h2>Loading products...</h2>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      background: 'var(--background-gradient)', // Use gradient variable
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      overflowY: 'auto',
      color: 'var(--text-main)' // Set default text color
    }}>
      <Header
        title="Product Catalog"
        subtitle="Browse our extensive collection of aquarium products"
      />
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '20px'
      }}>
        <button
          onClick={() => setShowCart(!showCart)}
          style={{
            padding: '12px 25px',
            backgroundColor: cart.length > 0 ? 'var(--aqua-blue)' : '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: cart.length > 0 ? '0 4px 10px rgba(0, 168, 204, 0.3)' : '0 4px 10px rgba(149, 165, 166, 0.3)',
            transition: 'all 0.3s ease',
            fontSize: '1rem',
            position: 'relative'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = cart.length > 0 ? '0 6px 15px rgba(0, 168, 204, 0.4)' : '0 6px 15px rgba(149, 165, 166, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = cart.length > 0 ? '0 4px 10px rgba(0, 168, 204, 0.3)' : '0 4px 10px rgba(149, 165, 166, 0.3)';
          }}
        >
          🛒 Cart {cart.length > 0 && `(${cart.length})`}
          {cart.length > 0 && (
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              backgroundColor: '#e74c3c',
              color: 'white',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              border: '2px solid white'
            }}>
              {cart.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab Navigation */}
      <div style={{
        backgroundColor: 'var(--card-bg)', // Use card background variable
        padding: '0 20px',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', gap: '5px' }}>
          <button
            onClick={() => setActiveTab('all')}
            style={{
              padding: '12px 20px',
              backgroundColor: activeTab === 'all' ? 'var(--ocean-blue)' : 'var(--light-bg)',
              color: activeTab === 'all' ? 'white' : 'var(--ocean-blue)',
              border: 'none',
              borderRadius: '5px 5px 0 0',
              cursor: 'pointer',
              fontWeight: activeTab === 'all' ? 'bold' : 'normal'
            }}
          >
            All Products
          </button>
          <button
            onClick={() => setActiveTab('recommended')}
            style={{
              padding: '12px 20px',
              backgroundColor: activeTab === 'recommended' ? 'var(--aqua-blue)' : 'var(--light-bg)',
              color: activeTab === 'recommended' ? 'white' : 'var(--aqua-blue)',
              border: 'none',
              borderRadius: '5px 5px 0 0',
              cursor: 'pointer',
              fontWeight: activeTab === 'recommended' ? 'bold' : 'normal'
            }}
          >
            Recommended for You
          </button>
          <button
            onClick={() => setActiveTab('trending')}
            style={{
              padding: '12px 20px',
              backgroundColor: activeTab === 'trending' ? 'var(--deep-ocean)' : 'var(--light-bg)', // Using deep-ocean for trending
              color: activeTab === 'trending' ? 'white' : 'var(--deep-ocean)',
              border: 'none',
              borderRadius: '5px 5px 0 0',
              cursor: 'pointer',
              fontWeight: activeTab === 'trending' ? 'bold' : 'normal'
            }}
          >
            Trending Now
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div style={{
        backgroundColor: 'var(--card-bg)',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        marginBottom: '30px'
      }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'var(--text-main)' }}>Search Products:</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or description"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--input-bg)',
                color: 'var(--text-main)'
              }}
            />
          </div>

          <div style={{ minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'var(--text-main)' }}>Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--input-bg)',
                color: 'var(--text-main)'
              }}
            >
              <option value="">All Categories</option>
              <option value="Marine Fish">Marine Fish</option>
              <option value="Fresh Water Fish">Fresh Water Fish</option>
              <option value="Tanks">Tanks</option>
              <option value="Pots">Pots</option>
              <option value="Medicines">Medicines</option>
              <option value="Foods">Foods</option>
              <option value="Decorative Items">Decorative Items</option>

            </select>
          </div>

          <button
            onClick={handleSearch}
            style={{
              padding: '12px 25px',
              backgroundColor: 'var(--ocean-blue)',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              height: 'fit-content'
            }}
          >
            Search
          </button>

          <button
            onClick={() => {
              setSelectedCategory('');
              setSearchQuery('');
              fetchProducts();
            }}
            style={{
              padding: '12px 25px',
              backgroundColor: '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              height: 'fit-content'
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Product Catalog */}
      <div>
        <h2 style={{ color: 'var(--ocean-blue)' }}>
          {activeTab === 'recommended' && 'Recommended for You'}
          {activeTab === 'trending' && 'Trending Products'}
          {activeTab === 'all' && selectedCategory && `Products in ${selectedCategory.replace('-', ' ')}`}
          {activeTab === 'all' && !selectedCategory && 'Available Products'}
        </h2>
        {displayedProducts.length === 0 ? (
          <p style={{
            textAlign: 'center',
            padding: '40px',
            backgroundColor: 'var(--card-bg)',
            borderRadius: '10px',
            color: 'var(--text-main)'
          }}>
            No products found. Try adjusting your search criteria.
          </p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '25px'
          }}>
            {displayedProducts.map(product => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onViewDetails={handleProductView}
                onViewLocations={(product) => {
                  // Navigate to product locations page
                  navigate(`/customer/product/${product._id || product.id}/locations`);
                }}
                showRecommendedBadge={activeTab === 'recommended'}
              />
            ))}
          </div>
        )}
      </div>

      {/* Shopping Cart Modal */}
      {showCart && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 2000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          overflowY: 'auto',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--light-bg)', // Use theme variable
            borderRadius: '20px',
            padding: '30px',
            maxWidth: '1200px',
            width: '100%',
            marginTop: '20px',
            marginBottom: '20px',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowCart(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '1.5rem',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 4px 10px rgba(231, 76, 60, 0.3)'
              }}
            >
              ×
            </button>

            <h2 style={{
              color: 'var(--ocean-blue)',
              marginBottom: '30px',
              fontSize: '2rem'
            }}>
              🛒 Your Shopping Cart
            </h2>

            <UnifiedCart
              cart={cart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveFromCart}
              onCheckout={handleCheckoutClick}
              processing={false}
              userRole="customer"
              showQuantityControls={true}
            />
          </div>
        </div>
      )}

      {/* Payment Gateway Modal */}
      <PaymentGateway
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        amount={cart.reduce((total, item) => total + (getDisplayPrice(item.product) * item.quantity), 0)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}

export default ProductCatalog;