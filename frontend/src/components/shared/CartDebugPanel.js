import React from 'react';

function CartDebugPanel({ cart }) {
    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: '#00ff00',
            padding: '15px',
            borderRadius: '10px',
            fontFamily: 'monospace',
            fontSize: '12px',
            maxWidth: '400px',
            maxHeight: '300px',
            overflowY: 'auto',
            zIndex: 10000,
            boxShadow: '0 4px 20px rgba(0, 255, 0, 0.3)',
            border: '2px solid #00ff00'
        }}>
            <div style={{
                fontWeight: 'bold',
                marginBottom: '10px',
                fontSize: '14px',
                color: '#00ff00',
                borderBottom: '1px solid #00ff00',
                paddingBottom: '5px'
            }}>
                🐛 Cart Debug Panel
            </div>

            <div style={{ marginBottom: '8px' }}>
                <strong>Cart Length:</strong> {cart.length}
            </div>

            <div style={{ marginBottom: '8px' }}>
                <strong>localStorage:</strong>
                <div style={{ fontSize: '10px', opacity: 0.8 }}>
                    {localStorage.getItem('customerCart') ?
                        `${localStorage.getItem('customerCart').substring(0, 100)}...` :
                        'Empty'}
                </div>
            </div>

            <div style={{ marginBottom: '8px' }}>
                <strong>Items in Cart:</strong>
            </div>

            {cart.length === 0 ? (
                <div style={{ color: '#ff6b6b', fontStyle: 'italic' }}>
                    No items
                </div>
            ) : (
                cart.map((item, index) => (
                    <div key={index} style={{
                        backgroundColor: 'rgba(0, 255, 0, 0.1)',
                        padding: '8px',
                        marginBottom: '5px',
                        borderRadius: '5px',
                        border: '1px solid rgba(0, 255, 0, 0.3)'
                    }}>
                        <div><strong>#{index + 1}</strong></div>
                        <div>Name: {item.product?.name || 'Unknown'}</div>
                        <div>ID: {item.product?._id || item.product?.id || 'No ID'}</div>
                        <div>Qty: {item.quantity}</div>
                    </div>
                ))
            )}

            <div style={{
                marginTop: '10px',
                paddingTop: '10px',
                borderTop: '1px solid #00ff00',
                fontSize: '10px',
                opacity: 0.7
            }}>
                Press F12 for detailed console logs
            </div>
        </div>
    );
}

export default CartDebugPanel;
