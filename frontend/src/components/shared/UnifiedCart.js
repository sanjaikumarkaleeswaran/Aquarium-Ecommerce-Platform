import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getDisplayPrice } from '../../utils/userUtils';
import './UnifiedCart.css';

/**
 * Unified Cart Component for all user roles (Customer, Retailer, Wholesaler)
 * Provides consistent UI/UX across the platform
 */
function UnifiedCart({
    cart = [],
    onUpdateQuantity,
    onRemoveItem,
    onCheckout,
    processing = false,
    userRole = 'customer',
    showQuantityControls = true
}) {
    const navigate = useNavigate();

    const getProductImage = (product) => {
        if (!product) return null;
        if (product.images && Array.isArray(product.images) && product.images.length > 0) {
            if (product.images[0].startsWith('data:image') || product.images[0].startsWith('http')) {
                return product.images[0];
            }
        }
        return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiM0ZmEyY2MiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIyMCIgZmlsbD0iIzNmOGFkYSIvPjxjaXJjbGUgY3g9IjcwIiBjeT0iMzAiIHI9IjgiIGZpbGw9IiNmZmZmMDAiLz48L3N2Zz4=';
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            const product = item.product || {};
            const price = getDisplayPrice(product);
            const quantity = item.quantity || 1;
            return total + (price * quantity);
        }, 0);
    };

    if (cart.length === 0) {
        return (
            <div className="cart-empty-container">
                <div className="cart-empty-icon">🛒</div>
                <h2 className="cart-empty-title">Your cart is empty</h2>
                <p className="cart-empty-text">Add some products to get started!</p>
                <button
                    onClick={() => navigate(
                        userRole === 'customer' ? '/customer/products' :
                            userRole === 'retailer' ? '/retailer/wholesaler-products' :
                                '/products'
                    )}
                    className="btn-continue-shopping"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="cart-layout">
            {/* Cart Items */}
            <div className="cart-items-column">
                <div className="cart-items-container">
                    <div className="cart-header">
                        <h3 style={{ margin: 0, fontSize: '1.3rem' }}>🛒 Cart Items</h3>
                        <span className="cart-count-badge">
                            {cart.length} {cart.length === 1 ? 'item' : 'items'}
                        </span>
                    </div>

                    {cart.map((item, index) => {
                        const product = item.product || {};
                        return (
                            <div key={index} className="cart-item">
                                {/* Item Image */}
                                <div className="cart-item-image">
                                    <img
                                        src={getProductImage(product)}
                                        alt={product.name || 'Product'}
                                    />
                                </div>

                                {/* Item Details */}
                                <div className="cart-item-details">
                                    <h3 className="item-name">
                                        {product.name || product.productName || 'Unknown Product'}
                                    </h3>
                                    {product.category && (
                                        <p className="item-category">
                                            Category: {product.category}
                                        </p>
                                    )}
                                    <p className="item-price">
                                        ₹{getDisplayPrice(product)} each
                                    </p>
                                </div>

                                {/* Quantity Controls */}
                                {showQuantityControls && onUpdateQuantity ? (
                                    <div className="quantity-controls">
                                        <button
                                            onClick={() => onUpdateQuantity(index, -1)}
                                            className="qty-btn"
                                        >
                                            −
                                        </button>
                                        <span className="qty-display">
                                            {item.quantity || 1}
                                        </span>
                                        <button
                                            onClick={() => onUpdateQuantity(index, 1)}
                                            className="qty-btn"
                                        >
                                            +
                                        </button>
                                    </div>
                                ) : (
                                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text-main)' }}>
                                        Qty: {item.quantity || 1}
                                    </span>
                                )}

                                {/* Total & Remove */}
                                <div className="cart-item-total-section">
                                    <p className="item-total-price">
                                        ₹{(getDisplayPrice(product) * (item.quantity || 1)).toFixed(2)}
                                    </p>
                                    <button
                                        onClick={() => onRemoveItem(index)}
                                        className="btn-remove"
                                    >
                                        🗑️ Remove
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Order Summary */}
            <div className="cart-summary-column">
                <div className="order-summary-card">
                    <h3 className="summary-title">
                        💳 Order Summary
                    </h3>

                    <div className="summary-row">
                        <span style={{ color: 'var(--text-secondary)' }}>Subtotal ({cart.length} items)</span>
                        <span style={{ fontWeight: 'bold', color: 'var(--ocean-blue)' }}>₹{calculateTotal().toFixed(2)}</span>
                    </div>

                    <div className="summary-row" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
                        <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>Free</span>
                    </div>

                    <div className="summary-row total">
                        <span style={{ fontWeight: 'bold', color: 'var(--ocean-blue)' }}>Total</span>
                        <span style={{ fontWeight: 'bold', color: 'var(--ocean-blue)' }}>₹{calculateTotal().toFixed(2)}</span>
                    </div>

                    <button
                        onClick={onCheckout}
                        disabled={processing}
                        className="btn-checkout"
                        style={{
                            backgroundColor: processing ? '#95a5a6' : '#2ecc71',
                            cursor: processing ? 'not-allowed' : 'pointer',
                            boxShadow: processing ? 'none' : '0 6px 20px rgba(46, 204, 113, 0.4)',
                        }}
                    >
                        {processing ? '⏳ Processing...' : '🛍️ Proceed to Checkout'}
                    </button>

                    <div className="secure-checkout-badge">
                        <p style={{ margin: 0 }}>✓ Secure checkout</p>
                        <p style={{ margin: '5px 0 0 0' }}>✓ 100% satisfaction guaranteed</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UnifiedCart;
