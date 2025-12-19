import React, { useState, useEffect } from 'react';

const PaymentGateway = ({ isOpen, onClose, amount, onSuccess }) => {
    const [processing, setProcessing] = useState(false);
    const [step, setStep] = useState('input'); // 'input', 'processing', 'success'
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [formData, setFormData] = useState({
        cardNumber: '',
        cardName: '',
        expiry: '',
        cvv: '',
        upiId: '',
        bankName: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            setStep('input');
            setPaymentMethod('card');
            setFormData({ cardNumber: '', cardName: '', expiry: '', cvv: '', upiId: '', bankName: '' });
            setErrors({});
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const validate = () => {
        const newErrors = {};

        if (paymentMethod === 'card') {
            if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length !== 16) {
                newErrors.cardNumber = 'Enter a valid 16-digit card number';
            }
            if (!formData.cardName) {
                newErrors.cardName = 'Name is required';
            }
            if (!formData.expiry || !/^\d{2}\/\d{2}$/.test(formData.expiry)) {
                newErrors.expiry = 'MM/YY';
            }
            if (!formData.cvv || formData.cvv.length !== 3) {
                newErrors.cvv = '3 digits';
            }
        } else if (paymentMethod === 'upi') {
            if (!formData.upiId || !/^[\w.-]+@[\w.-]+$/.test(formData.upiId)) {
                newErrors.upiId = 'Enter a valid UPI ID (e.g., name@upi)';
            }
        } else if (paymentMethod === 'netbanking') {
            if (!formData.bankName) {
                newErrors.bankName = 'Select a bank';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePay = (e) => {
        e.preventDefault();
        if (!validate()) return;

        setProcessing(true);
        setStep('processing');

        // Simulate API processing delay
        setTimeout(() => {
            setProcessing(false);
            setStep('success');

            // Auto close after success message
            setTimeout(() => {
                onSuccess({
                    ...formData,
                    method: paymentMethod
                });
            }, 1500);
        }, 2000);
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const parts = [];
        for (let i = 0; i < v.length; i += 4) {
            parts.push(v.substr(i, 4));
        }
        return parts.length > 1 ? parts.join(' ') : value;
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3000
        }}>
            <div style={{
                backgroundColor: 'var(--card-bg)',
                borderRadius: '20px',
                padding: '0',
                maxWidth: '700px',
                width: '90%',
                boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                position: 'relative',
                color: 'var(--text-main)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                overflow: 'hidden',
                minHeight: '400px'
            }}>
                {/* Right Close Button (Visible on mobile or absolute overlay) */}
                {step === 'input' && (
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '15px',
                            right: '15px',
                            background: 'none',
                            border: 'none',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            color: 'var(--text-secondary)',
                            zIndex: 10
                        }}
                    >
                        ×
                    </button>
                )}

                {step === 'input' ? (
                    <>
                        {/* Sidebar Payment Methods */}
                        <div style={{
                            width: '200px',
                            backgroundColor: 'rgba(0,0,0,0.03)',
                            borderRight: '1px solid var(--border-color)',
                            padding: '20px 0'
                        }}>
                            <h3 style={{ padding: '0 20px', fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '15px' }}>Payment Method</h3>
                            {[
                                { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
                                { id: 'upi', label: 'UPI / QR', icon: '📱' },
                                { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
                                { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
                            ].map(method => (
                                <div
                                    key={method.id}
                                    onClick={() => { setPaymentMethod(method.id); setErrors({}); }}
                                    style={{
                                        padding: '12px 20px',
                                        cursor: 'pointer',
                                        backgroundColor: paymentMethod === method.id ? 'var(--input-bg)' : 'transparent',
                                        borderLeft: paymentMethod === method.id ? '4px solid var(--aqua-blue)' : '4px solid transparent',
                                        color: paymentMethod === method.id ? 'var(--ocean-blue)' : 'var(--text-main)',
                                        fontWeight: paymentMethod === method.id ? 'bold' : 'normal',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <span>{method.icon}</span> {method.label}
                                </div>
                            ))}
                        </div>

                        {/* Main Content Area */}
                        <div style={{ flex: 1, padding: '30px' }}>
                            <div style={{ textAlign: 'left', marginBottom: '25px', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>
                                <h2 style={{ color: 'var(--ocean-blue)', margin: '0 0 5px 0' }}>Secure Checkout</h2>
                                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Total Amount: <strong style={{ color: 'var(--aqua-blue)', fontSize: '1.2rem' }}>₹{amount.toFixed(2)}</strong></p>
                            </div>

                            <form onSubmit={handlePay}>

                                {/* 1. Credit Card Form */}
                                {paymentMethod === 'card' && (
                                    <>
                                        <div style={{ marginBottom: '15px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Card Number</label>
                                            <input
                                                type="text"
                                                maxLength="19"
                                                value={formData.cardNumber}
                                                onChange={(e) => setFormData({ ...formData, cardNumber: formatCardNumber(e.target.value) })}
                                                placeholder="0000 0000 0000 0000"
                                                style={{
                                                    width: '100%', padding: '12px', borderRadius: '8px',
                                                    border: errors.cardNumber ? '1px solid #ff6b6b' : '1px solid var(--border-color)',
                                                    backgroundColor: 'var(--input-bg)', color: 'var(--text-main)'
                                                }}
                                            />
                                            {errors.cardNumber && <span style={{ color: '#ff6b6b', fontSize: '0.8rem' }}>{errors.cardNumber}</span>}
                                        </div>

                                        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Expiry</label>
                                                <input
                                                    type="text"
                                                    maxLength="5"
                                                    value={formData.expiry}
                                                    onChange={(e) => {
                                                        let val = e.target.value.replace(/\D/g, '');
                                                        if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2);
                                                        setFormData({ ...formData, expiry: val });
                                                    }}
                                                    placeholder="MM/YY"
                                                    style={{
                                                        width: '100%', padding: '12px', borderRadius: '8px',
                                                        border: errors.expiry ? '1px solid #ff6b6b' : '1px solid var(--border-color)',
                                                        backgroundColor: 'var(--input-bg)', color: 'var(--text-main)', textAlign: 'center'
                                                    }}
                                                />
                                                {errors.expiry && <span style={{ color: '#ff6b6b', fontSize: '0.8rem' }}>{errors.expiry}</span>}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>CVV</label>
                                                <input
                                                    type="password"
                                                    maxLength="3"
                                                    value={formData.cvv}
                                                    onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, '') })}
                                                    placeholder="123"
                                                    style={{
                                                        width: '100%', padding: '12px', borderRadius: '8px',
                                                        border: errors.cvv ? '1px solid #ff6b6b' : '1px solid var(--border-color)',
                                                        backgroundColor: 'var(--input-bg)', color: 'var(--text-main)', textAlign: 'center'
                                                    }}
                                                />
                                                {errors.cvv && <span style={{ color: '#ff6b6b', fontSize: '0.8rem' }}>{errors.cvv}</span>}
                                            </div>
                                        </div>
                                        <div style={{ marginBottom: '15px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Card Holder Name</label>
                                            <input
                                                type="text"
                                                value={formData.cardName}
                                                onChange={(e) => setFormData({ ...formData, cardName: e.target.value.toUpperCase() })}
                                                placeholder="Name on Card"
                                                style={{
                                                    width: '100%', padding: '12px', borderRadius: '8px',
                                                    border: errors.cardName ? '1px solid #ff6b6b' : '1px solid var(--border-color)',
                                                    backgroundColor: 'var(--input-bg)', color: 'var(--text-main)'
                                                }}
                                            />
                                            {errors.cardName && <span style={{ color: '#ff6b6b', fontSize: '0.8rem' }}>{errors.cardName}</span>}
                                        </div>
                                    </>
                                )}

                                {/* 2. UPI Form */}
                                {paymentMethod === 'upi' && (
                                    <div>
                                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                            <img
                                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png"
                                                alt="Scan QR"
                                                style={{ width: '150px', height: '150px', border: '1px solid #ddd', borderRadius: '10px' }}
                                            />
                                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '10px' }}>Scan with any UPI App</p>
                                        </div>
                                        <div style={{ position: 'relative' }}>
                                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Or Enter UPI ID</label>
                                            <input
                                                type="text"
                                                value={formData.upiId}
                                                onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                                                placeholder="username@upi"
                                                style={{
                                                    width: '100%', padding: '12px', borderRadius: '8px',
                                                    border: errors.upiId ? '1px solid #ff6b6b' : '1px solid var(--border-color)',
                                                    backgroundColor: 'var(--input-bg)', color: 'var(--text-main)'
                                                }}
                                            />
                                            {errors.upiId && <span style={{ color: '#ff6b6b', fontSize: '0.8rem' }}>{errors.upiId}</span>}
                                        </div>
                                    </div>
                                )}

                                {/* 3. Net Banking Form */}
                                {paymentMethod === 'netbanking' && (
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '15px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Select Your Bank</label>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                                            {['HDFC Bank', 'SBI', 'ICICI Bank', 'Axis Bank', 'Kotak Bank', 'Yes Bank'].map(bank => (
                                                <div
                                                    key={bank}
                                                    onClick={() => setFormData({ ...formData, bankName: bank })}
                                                    style={{
                                                        padding: '15px',
                                                        border: formData.bankName === bank ? '2px solid var(--aqua-blue)' : '1px solid var(--border-color)',
                                                        borderRadius: '8px',
                                                        textAlign: 'center',
                                                        cursor: 'pointer',
                                                        backgroundColor: formData.bankName === bank ? 'rgba(0, 168, 204, 0.1)' : 'var(--input-bg)',
                                                        color: 'var(--text-main)',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    {bank}
                                                </div>
                                            ))}
                                        </div>
                                        {errors.bankName && <p style={{ color: '#ff6b6b', fontSize: '0.8rem', textAlign: 'center' }}>{errors.bankName}</p>}
                                    </div>
                                )}

                                {/* 4. COD Form */}
                                {paymentMethod === 'cod' && (
                                    <div style={{ textAlign: 'center', padding: '20px' }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '15px' }}>💵</div>
                                        <h3 style={{ color: 'var(--ocean-blue)' }}>Cash on Delivery</h3>
                                        <p style={{ color: 'var(--text-secondary)' }}>
                                            Pay securely with cash when your order is delivered to your doorstep.
                                        </p>
                                        <div style={{
                                            backgroundColor: 'rgba(255, 159, 67, 0.1)',
                                            border: '1px solid #f39c12',
                                            padding: '10px',
                                            borderRadius: '8px',
                                            color: '#e67e22',
                                            fontSize: '0.9rem',
                                            marginTop: '20px'
                                        }}>
                                            Note: You will need to verify your phone number upon delivery.
                                        </div>
                                    </div>
                                )}

                                {/* Pay Button */}
                                <button
                                    type="submit"
                                    style={{
                                        width: '100%',
                                        padding: '15px',
                                        backgroundColor: 'var(--aqua-blue)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '10px',
                                        fontSize: '1.1rem',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 15px rgba(0, 168, 204, 0.3)',
                                        transition: 'all 0.3s ease',
                                        marginTop: '25px'
                                    }}
                                >
                                    {paymentMethod === 'cod' ? 'Place Order' : `Pay ₹${amount.toFixed(2)}`}
                                </button>
                            </form>

                            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                🔒 100% Secure SSL Encrypted Payment
                            </div>
                        </div>
                    </>
                ) : (
                    // Processing / Success State (Full Width)
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '50px' }}>
                        {step === 'processing' && (
                            <>
                                <div className="spinner" style={{
                                    width: '60px',
                                    height: '60px',
                                    border: '6px solid rgba(0, 168, 204, 0.3)',
                                    borderTop: '6px solid var(--aqua-blue)',
                                    borderRadius: '50%',
                                    margin: '0 auto 25px',
                                    animation: 'spin 1s linear infinite'
                                }}></div>
                                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                                <h3 style={{ color: 'var(--ocean-blue)', marginBottom: '10px' }}>
                                    {paymentMethod === 'cod' ? 'Confirming Order...' : 'Processing Payment...'}
                                </h3>
                                <p style={{ color: 'var(--text-secondary)' }}>Please do not close this window.</p>
                            </>
                        )}

                        {step === 'success' && (
                            <>
                                <div style={{
                                    fontSize: '5rem',
                                    color: '#2ecc71',
                                    marginBottom: '20px',
                                    animation: 'bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                }}>✅</div>
                                <style>{`@keyframes bounceIn { 0% { transform: scale(0); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }`}</style>
                                <h3 style={{ color: 'var(--ocean-blue)', fontSize: '1.8rem', marginBottom: '10px' }}>
                                    {paymentMethod === 'cod' ? 'Order Placed!' : 'Payment Successful!'}
                                </h3>
                                <p style={{ color: 'var(--text-secondary)' }}>Redirecting you to order confirmation...</p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentGateway;
