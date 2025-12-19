import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders } from '../../services/orderService';
import Header from './Header';
import Modal from './Modal';

function OrderHistory({ role }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showTrackingModal, setShowTrackingModal] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await getOrders();
            // Filter for orders where the current user is the buyer
            // The backend getMyOrders returns orders where user is buyer OR seller
            // For "Order History" (Tracking), we usually care about what we BOUGHT.
            // Retailers might also want to track outgoing, but usually "Tracking" implies incoming.
            // Let's show "My Purchases" primarily.

            const userId = user._id || user.id;
            const myPurchases = data.orders.filter(order => (order.buyer && (order.buyer._id === userId || order.buyer === userId)));
            // Sort by date desc
            myPurchases.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            setOrders(myPurchases);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setLoading(false);
        }
    };

    const handleTrackOrder = (order) => {
        setSelectedOrder(order);
        setShowTrackingModal(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#f39c12';
            case 'confirmed': return '#3498db';
            case 'processing': return '#9b59b6';
            case 'shipped': return '#e67e22';
            case 'delivered': return '#2ecc71';
            case 'cancelled': return '#e74c3c';
            default: return '#95a5a6';
        }
    };

    // Tracking Timeline Component
    const TrackingTimeline = ({ order }) => {
        const steps = [
            { status: 'pending', label: 'Placed', icon: '📝' },
            { status: 'confirmed', label: 'Confirmed', icon: '✅' },
            { status: 'shipped', label: 'Shipped', icon: '🚚' },
            { status: 'Delivered', label: 'Delivered', icon: '📦' }
        ];

        const currentStepIndex = steps.findIndex(s => s.status === order.status) !== -1
            ? steps.findIndex(s => s.status === order.status)
            // If status is not in basic steps (e.g. processing), map it suitable
            : order.status === 'processing' ? 1
                : 0;

        return (
            <div style={{ marginTop: '20px', position: 'relative' }}>
                <h3 style={{ color: '#0a4f70', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                    Tracking Information
                </h3>

                {order.trackingNumber && (
                    <div style={{
                        backgroundColor: '#e3f2fd',
                        padding: '15px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        border: '1px solid #90caf9'
                    }}>
                        <p style={{ margin: '5px 0' }}><strong>Carrier:</strong> {order.shippingCarrier || 'Standard Shipping'}</p>
                        <p style={{ margin: '5px 0' }}><strong>Tracking #:</strong> <span style={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>{order.trackingNumber}</span></p>
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', position: 'relative' }}>
                    {/* Progress Bar Background */}
                    <div style={{
                        position: 'absolute',
                        top: '25px',
                        left: '0',
                        width: '100%',
                        height: '4px',
                        backgroundColor: '#e0e0e0',
                        zIndex: 0
                    }} />

                    {/* Active Progress Bar */}
                    <div style={{
                        position: 'absolute',
                        top: '25px',
                        left: '0',
                        width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                        height: '4px',
                        backgroundColor: '#2ecc71',
                        zIndex: 0,
                        transition: 'width 0.5s ease'
                    }} />

                    {steps.map((step, index) => {
                        const isActive = index <= currentStepIndex;
                        return (
                            <div key={step.status} style={{ zIndex: 1, textAlign: 'center', flex: 1 }}>
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    backgroundColor: isActive ? '#2ecc71' : '#fff',
                                    border: `3px solid ${isActive ? '#2ecc71' : '#e0e0e0'}`,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    fontSize: '1.5rem',
                                    margin: '0 auto',
                                    color: isActive ? 'white' : '#ccc',
                                    transition: 'all 0.3s ease'
                                }}>
                                    {step.icon}
                                </div>
                                <p style={{
                                    fontWeight: isActive ? 'bold' : 'normal',
                                    color: isActive ? '#0a4f70' : '#999',
                                    marginTop: '10px'
                                }}>
                                    {step.label}
                                </p>
                                {isActive && order.status === step.status && (
                                    <p style={{ fontSize: '0.8rem', color: '#666' }}>
                                        {new Date(order.updatedAt).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
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
                <h2>Loading orders...</h2>
            </div>
        );
    }

    return (
        <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, #e0f7fa, #b2ebf2)',
            minHeight: '100vh'
        }}>
            <Header
                title="My Orders"
                subtitle="Track and manage your purchases"
            />

            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={() => navigate(role === 'retailer' ? '/dashboard/retailer' : '/dashboard/customer')}
                    style={{
                        padding: '10px 20px',
                        background: 'rgba(255,255,255,0.8)',
                        color: '#0a4f70',
                        border: '1px solid rgba(255,255,255,0.5)',
                        borderRadius: '30px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                    }}
                >
                    ← Back to Dashboard
                </button>
            </div>

            {orders.length === 0 ? (
                <div style={{
                    padding: '60px',
                    textAlign: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    color: 'var(--text-secondary)',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '15px', opacity: 0.5 }}>📦</div>
                    <h3 style={{ margin: '0 0 10px 0', color: '#0a4f70' }}>No orders yet</h3>
                    <p style={{ fontSize: '1rem', marginBottom: '25px' }}>Start building your inventory with exotic species!</p>
                    <button
                        onClick={() => navigate(role === 'retailer' ? '/retailer/wholesaler-products' : '/customer/products')}
                        style={{
                            padding: '12px 30px',
                            backgroundColor: '#00a8cc',
                            color: 'white',
                            border: 'none',
                            borderRadius: '30px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            boxShadow: '0 4px 15px rgba(0, 168, 204, 0.4)',
                            transition: 'transform 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    >
                        Browse Products
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                    {orders.map(order => (
                        <div key={order._id} className="order-card" style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            backdropFilter: 'blur(5px)',
                            padding: '25px',
                            borderRadius: '20px',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            marginBottom: '20px',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                            transition: 'all 0.3s ease'
                        }}>
                            <style>{`
                                .order-card:hover {
                                    transform: translateY(-5px);
                                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
                                    background-color: rgba(255, 255, 255, 0.9) !important;
                                }
                             `}</style>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '15px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <span style={{
                                        fontWeight: '800',
                                        fontSize: '1.2rem',
                                        color: '#0a4f70',
                                        letterSpacing: '0.5px'
                                    }}>
                                        #{order._id.slice(-6).toUpperCase()}
                                    </span>
                                    <div style={{ fontSize: '0.9rem', color: '#666', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <span>📅</span> {new Date(order.createdAt).toLocaleDateString()}
                                        <span style={{ margin: '0 5px' }}>•</span>
                                        <span>🕒</span> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
                                    {(() => {
                                        const getStatusStyles = (s) => {
                                            switch (s) {
                                                case 'Delivered': return { bg: 'rgba(76, 175, 80, 0.2)', color: '#2e7d32', border: '#2e7d32' };
                                                case 'Shipped': return { bg: 'rgba(33, 150, 243, 0.2)', color: '#1565c0', border: '#1565c0' };
                                                case 'Cancelled': return { bg: 'rgba(244, 67, 54, 0.2)', color: '#c62828', border: '#c62828' };
                                                default: return { bg: 'rgba(255, 193, 7, 0.2)', color: '#e65100', border: '#ffb300' };
                                            }
                                        };
                                        const styles = getStatusStyles(order.status);
                                        return (
                                            <span style={{
                                                padding: '6px 14px',
                                                borderRadius: '20px',
                                                fontSize: '0.8rem',
                                                fontWeight: 'bold',
                                                textTransform: 'uppercase',
                                                backgroundColor: styles.bg,
                                                color: styles.color,
                                                border: `1px solid ${styles.border}`,
                                                display: 'inline-block'
                                            }}>
                                                {order.status}
                                            </span>
                                        );
                                    })()}
                                    <div style={{ fontWeight: '800', fontSize: '1.4rem', color: '#333' }}>
                                        ₹{order.totalAmount.toFixed(2)}
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#666' }}>
                                    Sold by: <strong>{order.sellerName || 'Wholesaler Store'}</strong>
                                </p>
                                <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', padding: '15px', borderRadius: '10px' }}>
                                    {order.items.slice(0, 3).map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px', fontSize: '0.95rem' }}>
                                            <div style={{
                                                width: '24px', height: '24px',
                                                backgroundColor: '#fff',
                                                borderRadius: '50%',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '0.7rem',
                                                border: '1px solid #eee'
                                            }}>
                                                🐟
                                            </div>
                                            <span style={{ fontWeight: 'bold' }}>{item.quantity}x</span> {item.name}
                                        </div>
                                    ))}
                                    {order.items.length > 3 && (
                                        <div style={{ fontSize: '0.85rem', color: '#666', paddingLeft: '34px', fontStyle: 'italic' }}>
                                            + {order.items.length - 3} more items...
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={() => handleTrackOrder(order)}
                                    style={{
                                        padding: '10px 25px',
                                        background: 'linear-gradient(90deg, #00a8cc, #0a4f70)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '30px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        boxShadow: '0 4px 10px rgba(0, 168, 204, 0.3)',
                                        transition: 'transform 0.2s'
                                    }}
                                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                >
                                    <span>📦</span> Track Order
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Tracking Modal */}
            <Modal
                isOpen={showTrackingModal}
                onClose={() => setShowTrackingModal(false)}
                title={`Tracking Order #${selectedOrder?.orderNumber || selectedOrder?._id.slice(-8)}`}
                showCancel={false}
                confirmText="Close"
            >
                {selectedOrder && (
                    <div>
                        <div style={{ marginBottom: '20px' }}>
                            <h4>Items in Shipment</h4>
                            <ul style={{ paddingLeft: '20px' }}>
                                {selectedOrder.items.map((item, idx) => (
                                    <li key={idx} style={{ marginBottom: '5px' }}>
                                        {item.quantity}x <strong>{item.name}</strong>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <TrackingTimeline order={selectedOrder} />

                        {(selectedOrder.status === 'confirmed' || selectedOrder.status === 'pending') && (
                            <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '5px', color: '#856404' }}>
                                ℹ️ Tracking details will be available once the order is shipped.
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default OrderHistory;
