import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getProducts, getWholesalerLocations } from '../../services/productService';
import { placeOrder } from '../../services/orderService';
import { addCatalogItem } from '../../services/retailerService';
import Header from '../shared/Header';
import UnifiedCart from '../shared/UnifiedCart';
import RetailerProductCard from './RetailerProductCard';
import { getDisplayPrice } from '../../utils/userUtils';
import { useToast } from '../shared/ToastProvider';
import PaymentGateway from '../shared/PaymentGateway';

function WholesalerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [locations, setLocations] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      let productList = [];
      if (data && data.products && Array.isArray(data.products)) {
        productList = data.products;
      } else if (Array.isArray(data)) {
        productList = data;
      }
      setProducts(productList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const fetchLocations = async (productId) => {
    try {
      const data = await getWholesalerLocations(productId);
      setLocations(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleViewLocations = async (product) => {
    setSelectedProduct(product);
    await fetchLocations(product._id);
  };

  const handleViewDetails = (product) => {
    alert(`Viewing details for ${product.name}`);
  };

  const handleAddToCart = (product) => {
    const productId = product._id || product.id;
    if (!productId) {
      toast.error("Error: Product ID missing");
      return;
    }

    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex(item => {
      const itemProductId = item.product?._id || item.product?.id;
      return itemProductId && String(itemProductId) === String(productId);
    });

    let newCart;
    if (existingItemIndex !== -1) {
      // Product exists, increment quantity
      newCart = cart.map((item, index) => {
        if (index === existingItemIndex) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
    } else {
      // New product, add to cart
      newCart = [...cart, { product, quantity: 1 }];
    }

    setCart(newCart);
    toast.success(`${product.name} added to cart!`);
  };

  const handleRemoveFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
  };

  const handleUpdateQuantity = (index, delta) => {
    const newCart = [...cart];
    newCart[index].quantity = (newCart[index].quantity || 1) + delta;
    if (newCart[index].quantity < 1) newCart[index].quantity = 1;
    setCart(newCart);
  };

  const handleCheckoutClick = () => {
    setShowCart(false);
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (paymentDetails) => {
    try {
      setProcessing(true);
      const orderData = {
        items: cart.map(item => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.priceWholesaler || item.product.priceCustomer
        })),
        totalPrice: cart.reduce((sum, item) => sum + ((item.product.priceWholesaler || item.product.priceCustomer) * item.quantity), 0),
        shippingAddress: {
          name: JSON.parse(sessionStorage.getItem('user'))?.name || paymentDetails.cardName || 'Retailer Business',
          phone: JSON.parse(sessionStorage.getItem('user'))?.phone || '9876543210',
          street: '123 Retailer Lane',
          city: 'Tech City',
          state: 'Innovation State',
          zipCode: '54321',
          country: 'India'
        },
        paymentMethod: 'credit-card',
        paymentDetails: {
          last4: paymentDetails.cardNumber.slice(-4),
          brand: 'Visa'
        }
      };

      await placeOrder(orderData);
      setCart([]);
      setShowPayment(false);
      toast.success('Order placed successfully! 🎉');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Error placing order: ' + (error.response?.data?.message || error.message));
      setShowPayment(false);
    } finally {
      setProcessing(false);
    }
  };

  const handleAddToStore = async (product) => {
    try {
      if (!window.confirm(`Add "${product.name}" to your store catalog?`)) return;
      setLoading(true);
      await addCatalogItem(product._id);
      toast.success('Product added to your store successfully!');
    } catch (error) {
      console.error('Error adding to store:', error);
      toast.error(error.message || 'Failed to add product to store');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        padding: '20px',
        background: 'linear-gradient(135deg, #e0f7fa, #b2ebf2)',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h2>Loading products...</h2>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      background: 'linear-gradient(135deg, #e0f7fa, #b2ebf2)',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <Header
        title="Wholesaler Products"
        subtitle="Browse products from wholesalers"
      />

      {/* Floating Cart Button */}
      {cart.length > 0 && !showCart && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          zIndex: 1000
        }}>
          <button
            onClick={() => setShowCart(true)}
            style={{
              padding: '15px 25px',
              backgroundColor: '#2ecc71',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 8px 20px rgba(46, 204, 113, 0.4)',
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            🛒 View Cart
            <span style={{
              backgroundColor: 'white',
              color: '#2ecc71',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>
              {cart.length}
            </span>
          </button>
        </div>
      )}

      {/* Cart Modal */}
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
            backgroundColor: '#e0f7fa',
            borderRadius: '20px',
            padding: '30px',
            maxWidth: '1200px',
            width: '100%',
            marginTop: '20px',
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
                fontWeight: 'bold'
              }}
            >
              ×
            </button>

            <h2 style={{ color: '#0a4f70', marginBottom: '30px' }}>🛒 Your Shopping Cart</h2>

            <UnifiedCart
              cart={cart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveFromCart}
              onCheckout={handleCheckoutClick}
              processing={false}
              userRole="retailer"
              showQuantityControls={true}
            />
          </div>
        </div>
      )}

      {/* Payment Gateway Modal */}
      <PaymentGateway
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        amount={cart.reduce((sum, item) => sum + ((item.product.priceWholesaler || item.product.priceCustomer) * item.quantity), 0)}
        onSuccess={handlePaymentSuccess}
      />

      {/* Products Grid */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#0a4f70' }}>Available Products from Wholesalers</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '25px'
        }}>
          {products.map(product => (
            <RetailerProductCard
              key={product._id}
              product={product}
              onAddToCart={handleAddToCart}
              onViewDetails={handleViewDetails}
              onViewLocations={handleViewLocations}
              onAddToStore={handleAddToStore}
            />
          ))}
        </div>
      </div>

      {/* Locations Display */}
      {selectedProduct && locations.length > 0 && (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '25px',
          borderRadius: '15px',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
          marginBottom: '30px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2 style={{ color: '#0a4f70', margin: 0 }}>
              Locations for {selectedProduct.name}
            </h2>
            <button
              onClick={() => {
                setSelectedProduct(null);
                setLocations([]);
              }}
              style={{
                padding: '12px 25px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '30px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Close
            </button>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '25px'
          }}>
            {locations.map(location => (
              <div key={location._id} style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '15px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)'
              }}>
                <h3 style={{ color: '#0a4f70', marginBottom: '15px' }}>
                  {location.wholesaler.businessName || location.wholesaler.name}
                </h3>
                <p style={{ margin: '0 0 10px 0', color: '#666' }}>
                  <strong>Address:</strong> {location.address}
                </p>
                <p style={{ margin: '0 0 15px 0', color: '#666' }}>
                  <strong>Coordinates:</strong> {location.latitude}, {location.longitude}
                </p>
                <button style={{
                  padding: '8px 15px',
                  backgroundColor: '#00a8cc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}>
                  Contact Wholesaler
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WholesalerProducts;