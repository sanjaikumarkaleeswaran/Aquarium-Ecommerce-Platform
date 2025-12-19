import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useComparison } from '../../context/ComparisonContext';

const ComparisonBar = () => {
    const { comparedProducts, removeFromCompare, clearComparison, isOpen, setIsOpen } = useComparison();
    const navigate = useNavigate();

    if (comparedProducts.length === 0) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'var(--card-bg)', // Use theme var
            boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
            padding: '15px 20px',
            zIndex: 1000,
            borderTop: '2px solid var(--aqua-blue)',
            transition: 'transform 0.3s ease',
            transform: isOpen ? 'translateY(0)' : 'translateY(100%)', // Only show when open
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Toggle Button (Always visible tab when "closed" but has items) - Wait, simplified for now: just always visible if items exist */}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, color: 'var(--ocean-blue)' }}>Compare Products ({comparedProducts.length}/3)</h3>
                <div>
                    <button
                        onClick={clearComparison}
                        style={{ marginRight: '10px', background: 'transparent', color: '#ff6b6b', border: '1px solid #ff6b6b' }}
                    >
                        Clear All
                    </button>
                    <button onClick={() => {
                        setIsOpen(false);
                        navigate('/customer/compare');
                    }}>
                        Compare Now
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        style={{ marginLeft: '10px', background: 'transparent', color: '#666' }}
                    >
                        ✕
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', overflowX: 'auto' }}>
                {comparedProducts.map(product => (
                    <div key={product._id || product.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        backgroundColor: 'var(--input-bg)',
                        minWidth: '200px'
                    }}>
                        <img
                            src={product.images && product.images[0] ? (typeof product.images[0] === 'string' ? product.images[0] : URL.createObjectURL(product.images[0])) : 'placeholder.jpg'}
                            alt={product.name}
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</p>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>₹{product.priceCustomer}</p>
                        </div>
                        <button
                            onClick={() => removeFromCompare(product._id || product.id)}
                            style={{ padding: '2px 6px', fontSize: '0.8rem', background: '#eee', color: '#333' }}
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default ComparisonBar;
