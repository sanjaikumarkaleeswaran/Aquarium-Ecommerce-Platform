import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getDisplayPrice } from '../../utils/userUtils';

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
            <div style={{
                backgroundColor: 'var(--card-bg)',
                padding: '50px',
                borderRadius: '15px',
                textAlign: 'center',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🛒</div>
                <h2 style={{ color: 'var(--ocean-blue)', marginBottom: '15px' }}>Your cart is empty</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '25px' }}>Add some products to get started!</p>
                <button
                    onClick={() => navigate(
                        userRole === 'customer' ? '/customer/products' :
                            userRole === 'retailer' ? '/retailer/wholesaler-products' :
                                '/products'
                    )}
                    style={{
                        padding: '12px 30px',
                        backgroundColor: '#00a8cc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '30px',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 15px rgba(0, 168, 204, 0.3)'
                    }}
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
            {/* Cart Items */}
            <div style={{ flex: 2, minWidth: '300px' }}>
                <div style={{
                    backgroundColor: 'var(--card-bg)',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }}>
                    <div style={{
                        padding: '20px',
                        backgroundColor: 'var(--ocean-blue)',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <h3 style={{ margin: 0, fontSize: '1.3rem' }}>🛒 Cart Items</h3>
                        <span style={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            padding: '5px 12px',
                            borderRadius: '15px',
                            fontSize: '0.9rem',
                            fontWeight: 'bold'
                        }}>
                            {cart.length} {cart.length === 1 ? 'item' : 'items'}
                        </span>
                    </div>

                    {cart.map((item, index) => {
                        const product = item.product || {};
                        return (
                            <div key={index} style={{
                                padding: '20px',
                                borderBottom: index < cart.length - 1 ? '1px solid var(--border-color)' : 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '20px'
                            }}>
                                {/* Item Image */}
                                <div style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    backgroundColor: '#eee',
                                    flexShrink: 0,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}>
                                    <img
                                        src={getProductImage(product)}
                                        alt={product.name || 'Product'}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>

                                {/* Item Details */}
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: '0 0 8px 0', color: 'var(--ocean-blue)', fontSize: '1.1rem' }}>
                                        {product.name || product.productName || 'Unknown Product'}
                                    </h3>
                                    {product.category && (
                                        <p style={{ margin: '0 0 8px 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                            Category: {product.category}
                                        </p>
                                    )}
                                    <p style={{ margin: 0, color: 'var(--ocean-blue)', fontSize: '1.05rem', fontWeight: 'bold' }}>
                                        ₹{getDisplayPrice(product)} each
                                    </p>
                                </div>

                                {/* Quantity Controls */}
                                {showQuantityControls && onUpdateQuantity ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-main)' }}>
                                        <button
                                            onClick={() => onUpdateQuantity(index, -1)}
                                            style={{
                                                width: '35px',
                                                height: '35px',
                                                borderRadius: '50%',
                                                border: '2px solid var(--ocean-blue)',
                                                cursor: 'pointer',
                                                backgroundColor: 'var(--input-bg)',
                                                color: 'var(--ocean-blue)',
                                                fontWeight: 'bold',
                                                fontSize: '1.2rem'
                                            }}
                                        >
                                            −
                                        </button>
                                        <span style={{ fontWeight: 'bold', fontSize: '1.2rem', minWidth: '30px', textAlign: 'center', color: 'var(--text-main)' }}>
                                            {item.quantity || 1}
                                        </span>
                                        <button
                                            onClick={() => onUpdateQuantity(index, 1)}
                                            style={{
                                                width: '35px',
                                                height: '35px',
                                                borderRadius: '50%',
                                                border: '2px solid var(--ocean-blue)',
                                                cursor: 'pointer',
                                                backgroundColor: 'var(--input-bg)',
                                                color: 'var(--ocean-blue)',
                                                fontWeight: 'bold',
                                                fontSize: '1.2rem'
                                            }}
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
                                <div style={{ textAlign: 'right', minWidth: '120px' }}>
                                    <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: 'var(--ocean-blue)', fontSize: '1.2rem' }}>
                                        ₹{(getDisplayPrice(product) * (item.quantity || 1)).toFixed(2)}
                                    </p>
                                    <button
                                        onClick={() => onRemoveItem(index)}
                                        style={{
                                            color: '#e74c3c',
                                            border: '1px solid #e74c3c',
                                            background: 'var(--input-bg)',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem',
                                            padding: '6px 12px',
                                            borderRadius: '5px',
                                            fontWeight: 'bold'
                                        }}
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
            <div style={{ flex: 1, minWidth: '300px' }}>
                <div style={{
                    backgroundColor: 'var(--card-bg)',
                    padding: '30px',
                    borderRadius: '15px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    position: 'sticky',
                    top: '20px',
                    border: '2px solid var(--ocean-blue)'
                }}>
                    <h3 style={{
                        margin: '0 0 25px 0',
                        color: 'var(--ocean-blue)',
                        fontSize: '1.5rem',
                        paddingBottom: '15px',
                        borderBottom: '2px solid var(--ocean-blue)'
                    }}>
                        💳 Order Summary
                    </h3>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '1.05rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Subtotal ({cart.length} items)</span>
                        <span style={{ fontWeight: 'bold', color: 'var(--ocean-blue)' }}>₹{calculateTotal().toFixed(2)}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--border-color)' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
                        <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>Free</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', fontSize: '1.3rem', paddingTop: '10px' }}>
                        <span style={{ fontWeight: 'bold', color: 'var(--ocean-blue)' }}>Total</span>
                        <span style={{ fontWeight: 'bold', color: 'var(--ocean-blue)' }}>₹{calculateTotal().toFixed(2)}</span>
                    </div>

                    <button
                        onClick={onCheckout}
                        disabled={processing}
                        style={{
                            width: '100%',
                            padding: '16px',
                            backgroundColor: processing ? '#95a5a6' : '#2ecc71',
                            color: 'white',
                            border: 'none',
                            borderRadius: '30px',
                            fontSize: '1.15rem',
                            fontWeight: 'bold',
                            cursor: processing ? 'not-allowed' : 'pointer',
                            boxShadow: processing ? 'none' : '0 6px 20px rgba(46, 204, 113, 0.4)',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}
                    >
                        {processing ? '⏳ Processing...' : '🛍️ Proceed to Checkout'}
                    </button>

                    <div style={{
                        marginTop: '20px',
                        padding: '15px',
                        backgroundColor: '#e8f5e9',
                        borderRadius: '10px',
                        fontSize: '0.9rem',
                        color: '#2e7d32'
                    }}>
                        <p style={{ margin: 0 }}>✓ Secure checkout</p>
                        <p style={{ margin: '5px 0 0 0' }}>✓ 100% satisfaction guaranteed</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UnifiedCart;
