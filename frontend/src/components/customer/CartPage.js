import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../shared/Header';
import UnifiedCart from '../shared/UnifiedCart';
import './CartPage.css';
import { placeOrder } from '../../services/orderService';
import { getDisplayPrice } from '../../utils/userUtils';
import { useToast } from '../shared/ToastProvider';
import PaymentGateway from '../shared/PaymentGateway';

function CartPage() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        // Load cart from localStorage
        const savedCart = localStorage.getItem('customerCart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
        setLoading(false);
    }, []);

    const updateQuantity = (index, delta) => {
        const newCart = [...cart];
        newCart[index].quantity = (newCart[index].quantity || 1) + delta;
        if (newCart[index].quantity < 1) newCart[index].quantity = 1;
        setCart(newCart);
        localStorage.setItem('customerCart', JSON.stringify(newCart));
    };

    const removeItem = (index) => {
        if (window.confirm('Remove this item from cart?')) {
            const newCart = cart.filter((_, i) => i !== index);
            setCart(newCart);
            localStorage.setItem('customerCart', JSON.stringify(newCart));
            toast.success('Item removed from cart');
        }
    };

    const handleCheckoutClick = () => {
        if (cart.length === 0) return;

        const user = JSON.parse(sessionStorage.getItem('user'));
        if (!user) {
            toast.warning('Please login to checkout');
            navigate('/login/customer');
            return;
        }

        setShowPayment(true);
    };

    const handlePaymentSuccess = async (paymentDetails) => {
        setProcessing(true);
        try {
            const user = JSON.parse(sessionStorage.getItem('user'));
            const ordersBySeller = {};

            cart.forEach(item => {
                const product = item.product || {};
                const sellerId = product.wholesaler?._id || product.wholesaler ||
                    product.retailer?._id || product.retailer ||
                    product.seller?._id || product.seller ||
                    product.wholesalerId;
                const safeSellerId = sellerId || 'unknown_seller';

                if (!ordersBySeller[safeSellerId]) {
                    ordersBySeller[safeSellerId] = [];
                }

                const price = getDisplayPrice(product);
                const quantity = item.quantity || 1;

                ordersBySeller[safeSellerId].push({
                    product: product._id || product.id,
                    productModel: 'Product',
                    productId: product._id || product.id,
                    name: product.name,
                    quantity: quantity,
                    price: price,
                    subtotal: price * quantity
                });
            });

            const promises = Object.keys(ordersBySeller).map(async (sellerId) => {
                const items = ordersBySeller[sellerId];
                const subtotal = items.reduce((sum, i) => sum + i.subtotal, 0);

                const orderData = {
                    items,
                    seller: sellerId === 'unknown_seller' ? null : sellerId,
                    subtotal,
                    totalAmount: subtotal,
                    paymentMethod: 'credit-card',
                    shippingAddress: {
                        name: user.name || paymentDetails.cardName,
                        phone: user.phone || '9999999999',
                        street: '123 Main St',
                        city: 'City',
                        state: 'State',
                        zipCode: '10001',
                        country: 'India'
                    },
                    paymentDetails: {
                        last4: paymentDetails.cardNumber.slice(-4),
                        brand: 'Visa'
                    }
                };

                return placeOrder(orderData);
            });

            await Promise.all(promises);

            toast.success('Order placed successfully! 🎉');
            setCart([]);
            localStorage.removeItem('customerCart');
            setShowPayment(false);
            navigate('/customer/orders');

        } catch (error) {
            console.error('Checkout error:', error);
            toast.error('Failed to place order: ' + (error.response?.data?.message || error.message));
            setShowPayment(false);
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="cart-loading-container">
                <h2>Loading cart...</h2>
            </div>
        );
    }

    return (
        <div className="cart-page-container">
            <Header
                title="Your Shopping Cart"
                subtitle="Review your items and proceed to checkout"
            />

            <div className="cart-content-wrapper">
                <UnifiedCart
                    cart={cart}
                    onUpdateQuantity={updateQuantity}
                    onRemoveItem={removeItem}
                    onCheckout={handleCheckoutClick}
                    processing={false}
                    userRole="customer"
                    showQuantityControls={true}
                />
            </div>

            {/* Payment Gateway */}
            <PaymentGateway
                isOpen={showPayment}
                onClose={() => setShowPayment(false)}
                amount={cart.reduce((total, item) => total + (getDisplayPrice(item.product) * item.quantity), 0)}
                onSuccess={handlePaymentSuccess}
            />
        </div>
    );
}

export default CartPage;
