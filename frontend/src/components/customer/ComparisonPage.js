import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useComparison } from '../../context/ComparisonContext';
import { getDisplayPrice } from '../../utils/userUtils';
import Header from '../shared/Header';
import { useToast } from '../shared/ToastProvider';

const ComparisonPage = () => {
    const { comparedProducts, removeFromCompare, clearComparison } = useComparison();
    const navigate = useNavigate();
    const toast = useToast();

    if (comparedProducts.length === 0) {
        return (
            <div style={{
                padding: '40px',
                background: 'var(--background-gradient)',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-main)',
                fontFamily: "'Poppins', sans-serif"
            }}>
                <div style={{
                    padding: '40px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    textAlign: 'center',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
                }}>
                    <span style={{ fontSize: '4rem', display: 'block', marginBottom: '20px' }}>⚖️</span>
                    <h2 style={{ fontSize: '2rem', marginBottom: '10px', color: 'var(--ocean-blue)' }}>No products to compare</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Add some aquatic friends to see how they stack up!</p>
                    <button
                        onClick={() => navigate('/customer/products')}
                        style={{
                            padding: '12px 30px',
                            background: 'linear-gradient(45deg, var(--ocean-blue), var(--aqua-blue))',
                            color: 'white',
                            border: 'none',
                            borderRadius: '30px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            boxShadow: '0 4px 15px rgba(0, 168, 204, 0.3)',
                            transition: 'transform 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        Browse Products
                    </button>
                </div>
            </div>
        );

    }

    // List of attributes to compare
    const attributes = [
        { label: 'Image', key: 'image', type: 'image' },
        { label: 'Name', key: 'name', type: 'text' },
        { label: 'Price', key: 'price', type: 'price' },
        { label: 'Category', key: 'category', type: 'text' },
        { label: 'Stock Status', key: 'stock', type: 'stock' },
        { label: 'Seller', key: 'seller', type: 'seller' },
        { label: 'Fish Type', key: 'specifications.fishType', type: 'nested' },
        { label: 'Care Level', key: 'specifications.careLevel', type: 'nested' },
        { label: 'Temperament', key: 'specifications.temperament', type: 'nested' },
        { label: 'Tank Size', key: 'specifications.tankSize', type: 'nested' },
        { label: 'Description', key: 'description', type: 'longWidth' },
    ];

    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    const handleAddToCart = (product) => {
        const savedCart = localStorage.getItem('customerCart');
        const cart = savedCart ? JSON.parse(savedCart) : [];
        const productId = product._id || product.id;

        const existingItemIndex = cart.findIndex(item => (item.product._id || item.product.id) === productId);

        let newCart;
        if (existingItemIndex > -1) {
            newCart = [...cart];
            newCart[existingItemIndex].quantity += 1;
        } else {
            newCart = [...cart, { product, quantity: 1 }];
        }

        localStorage.setItem('customerCart', JSON.stringify(newCart));
        toast.success(`${product.name} added to cart!`);
    };

    return (
        <div style={{
            padding: '20px',
            background: 'var(--background-gradient)',
            minHeight: '100vh',
            fontFamily: 'Arial, sans-serif',
            color: 'var(--text-main)'
        }}>
            <Header title="Product Comparison" subtitle="Compare features side-by-side" />

            <div style={{ marginTop: '20px', overflowX: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                    <button
                        onClick={clearComparison}
                        style={{
                            padding: '8px 15px',
                            backgroundColor: 'transparent',
                            border: '1px solid #ff6b6b',
                            color: '#ff6b6b',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        Clear Comparison
                    </button>
                    <button
                        onClick={() => navigate('/customer/products')}
                        style={{
                            marginLeft: '15px',
                            padding: '8px 15px',
                            backgroundColor: 'var(--ocean-blue)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        + Add More Products
                    </button>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: `200px repeat(${comparedProducts.length}, minmax(280px, 1fr))`,
                    gap: '1px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    backdropFilter: 'blur(5px)',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)'
                }}>
                    {/* Headers Row (Hidden visually or merged with logic below, we iterate attributes) */}

                    {attributes.map((attr, index) => (
                        <React.Fragment key={index}>
                            <div style={{
                                padding: '20px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                color: 'var(--text-secondary)',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                                fontSize: '0.9rem',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}>
                                {attr.label}
                            </div>
                            {comparedProducts.map(product => (
                                <div key={`${product._id || product.id}-${attr.key}`} style={{
                                    padding: '20px',
                                    background: index % 2 === 0 ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    flexDirection: 'column',
                                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                    transition: 'background-color 0.3s'
                                }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'}
                                >
                                    {/* Render logic based on type */}
                                    {attr.type === 'image' && (
                                        <img
                                            src={product.images && product.images[0] ? (typeof product.images[0] === 'string' ? product.images[0] : URL.createObjectURL(product.images[0])) : 'placeholder.jpg'}
                                            alt={product.name}
                                            style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
                                        />
                                    )}
                                    {attr.type === 'text' && (
                                        <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{product[attr.key]}</span>
                                    )}
                                    {attr.type === 'price' && (
                                        <span style={{ color: 'var(--coral)', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                            ₹{getDisplayPrice(product)}
                                        </span>
                                    )}
                                    {attr.type === 'stock' && (
                                        <span style={{
                                            color: product.stock > 0 ? '#4caf50' : '#f44336',
                                            fontWeight: 'bold',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            backgroundColor: product.stock > 0 ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)'
                                        }}>
                                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    )}
                                    {attr.type === 'seller' && (
                                        <span>{product.retailer?.storeName || product.retailer?.name || 'N/A'}</span>
                                    )}
                                    {attr.type === 'nested' && (
                                        <span>{getNestedValue(product, attr.key) || '-'}</span>
                                    )}
                                    {attr.type === 'longWidth' && (
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxHeight: '100px', overflowY: 'auto' }}>
                                            {product.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </React.Fragment>
                    ))}

                    {/* Actions Row */}
                    {/* Actions Row */}
                    <div style={{
                        padding: '20px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        Actions
                    </div>
                    {comparedProducts.map(product => (
                        <div key={`action-${product._id || product.id}`} style={{
                            padding: '20px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            alignItems: 'center'
                        }}>
                            <button
                                onClick={() => handleAddToCart(product)}
                                disabled={product.stock <= 0}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: product.stock > 0 ? 'var(--aqua-blue)' : '#ccc',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '20px',
                                    cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                                    width: '100%'
                                }}
                            >
                                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                            <button
                                onClick={() => removeFromCompare(product._id || product.id)}
                                style={{
                                    padding: '5px 10px',
                                    backgroundColor: 'transparent',
                                    color: '#ff6b6b',
                                    border: 'none',
                                    cursor: 'pointer',
                                    textDecoration: 'underline'
                                }}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ComparisonPage;
