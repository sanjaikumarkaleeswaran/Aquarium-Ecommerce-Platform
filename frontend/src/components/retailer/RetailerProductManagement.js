import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProducts, addProduct, updateProduct, deleteProduct } from '../../services/productService';
import { getMyInventory } from '../../services/retailerService';
import Header from '../shared/Header';
import { useToast } from '../shared/ToastProvider';

function RetailerProductManagement() {
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'mine', 'resale'
    const [products, setProducts] = useState([]);
    const [resaleProducts, setResaleProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const [formData, setFormData] = useState({
        name: '',
        category: 'Fresh Water Fish',
        description: '',
        priceWholesaler: '',
        priceRetailer: '',
        priceCustomer: '',
        quantity: '',
        fishType: '',
        medicineType: '',
        accessoryType: '',
        images: []
    });

    const categories = [
        'Marine Fish',
        'Fresh Water Fish',
        'Tanks',
        'Pots',
        'Medicines',
        'Foods',
        'Decorative Items'
    ];

    useEffect(() => {
        fetchMyProducts();
    }, []);

    const fetchMyProducts = async () => {
        setLoading(true);

        try {
            const data = await getUserProducts();
            setProducts(data.products || data);
        } catch (error) {
            console.error('Error fetching own products:', error);
            // Don't alert here to avoid annoying user if they just don't have access yet
        }

        try {
            const invData = await getMyInventory();
            setResaleProducts(invData.products || []);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate pricing
        const ws = parseFloat(formData.priceWholesaler) || 0;
        const rt = parseFloat(formData.priceRetailer) || 0;
        const cs = parseFloat(formData.priceCustomer);

        if (rt <= ws && ws > 0) {
            toast.warning('Retailer price should normally be higher than wholesaler price.');
        }
        if (cs <= rt) {
            toast.error('Customer price must be higher than your retailer cost/price!');
            return;
        }

        try {
            setLoading(true);
            const productData = {
                ...formData,
                wholesalePrice: ws, // Map to backend field
                suggestedRetailPrice: cs, // Map to backend field (Customer Price)
                // retailerPrice: rt, // Not used in standard Product model, ignoring
                stock: parseInt(formData.quantity) // Map to backend field
            };

            if (editingProduct) {
                await updateProduct(editingProduct._id, productData);
                toast.success('Product updated successfully!');
            } else {
                await addProduct(productData);
                toast.success('Product added successfully!');
            }

            resetForm();
            fetchMyProducts();
        } catch (error) {
            console.error('Error saving product:', error);
            toast.error('Error saving product: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            category: product.category,
            description: product.description,
            priceWholesaler: product.wholesalePrice || 0,
            priceRetailer: product.priceRetailer || product.wholesalePrice || 0, // Fallback
            priceCustomer: product.suggestedRetailPrice || product.retailPrice,
            quantity: product.quantity || product.stock,
            fishType: product.specifications?.fishType || '',
            medicineType: product.specifications?.medicineType || '',
            accessoryType: product.specifications?.accessoryType || '',
            images: product.images || []
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            setLoading(true);
            await deleteProduct(productId);
            toast.success('Product deleted successfully!');
            fetchMyProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Error deleting product');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            category: 'Fresh Water Fish',
            description: '',
            priceWholesaler: '',
            priceRetailer: '',
            priceCustomer: '',
            quantity: '',
            fishType: '',
            medicineType: '',
            accessoryType: '',
            images: []
        });
        setEditingProduct(null);
        setShowForm(false);
    };

    const getStockStatus = (qty) => {
        if (qty <= 0) return { label: 'Out of Stock', color: '#ff4757', bg: 'rgba(255, 71, 87, 0.1)' };
        if (qty < 5) return { label: 'Low Stock', color: '#ffa502', bg: 'rgba(255, 165, 2, 0.1)' };
        return { label: 'In Stock', color: '#2ed573', bg: 'rgba(46, 213, 115, 0.1)' };
    };

    // Combine for All view
    const allProducts = activeTab === 'all'
        ? [...products.map(p => ({ ...p, type: 'mine' })), ...resaleProducts.map(p => ({ ...p, type: 'resale' }))]
        : activeTab === 'mine'
            ? products.map(p => ({ ...p, type: 'mine' }))
            : resaleProducts.map(p => ({ ...p, type: 'resale' }));

    return (
        <div style={{
            padding: '20px',
            background: 'var(--background-gradient)',
            minHeight: '100vh',
            fontFamily: 'Arial, sans-serif',
            color: 'var(--text-main)'
        }}>
            <Header
                title="My Products"
                subtitle="Manage your inventory and pricing"
            />

            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '20px 0'
            }}>
                <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={() => setActiveTab('all')}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: activeTab === 'all' ? 'var(--ocean-blue)' : 'rgba(255,255,255,0.1)',
                                color: activeTab === 'all' ? 'white' : 'var(--text-secondary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '25px',
                                cursor: 'pointer',
                                fontWeight: activeTab === 'all' ? 'bold' : 'normal',
                                backdropFilter: 'blur(5px)',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            All Inventory
                        </button>
                        <button
                            onClick={() => setActiveTab('mine')}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: activeTab === 'mine' ? 'var(--ocean-blue)' : 'rgba(255,255,255,0.1)',
                                color: activeTab === 'mine' ? 'white' : 'var(--text-secondary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '25px',
                                cursor: 'pointer',
                                fontWeight: activeTab === 'mine' ? 'bold' : 'normal',
                                backdropFilter: 'blur(5px)',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            My Products ({products.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('resale')}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: activeTab === 'resale' ? 'var(--ocean-blue)' : 'rgba(255,255,255,0.1)',
                                color: activeTab === 'resale' ? 'white' : 'var(--text-secondary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '25px',
                                cursor: 'pointer',
                                fontWeight: activeTab === 'resale' ? 'bold' : 'normal',
                                backdropFilter: 'blur(5px)',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Resale Items ({resaleProducts.length})
                        </button>
                    </div>

                    <button
                        onClick={() => setShowForm(!showForm)}
                        style={{
                            padding: '12px 25px',
                            background: 'linear-gradient(45deg, #2ecc71, #27ae60)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '30px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 15px rgba(46, 204, 113, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        {showForm ? 'Cancel Adding' : '+ Add New Product'}
                    </button>
                </div>

                {/* Add/Edit Product Form */}
                {showForm && (
                    <div style={{
                        backgroundColor: 'var(--card-bg)',
                        padding: '30px',
                        borderRadius: '20px',
                        marginBottom: '40px',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
                        border: '1px solid var(--border-color)',
                        backdropFilter: 'blur(5px)',
                        animation: 'fadeIn 0.3s ease-out'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                            <h2 style={{ color: 'var(--ocean-blue)', margin: 0 }}>
                                {editingProduct ? '📝 Edit Product' : '✨ Add New Product'}
                            </h2>
                            <button onClick={resetForm} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            borderRadius: '10px',
                                            border: '1px solid var(--border-color)',
                                            backgroundColor: 'var(--input-bg)',
                                            color: 'var(--text-main)',
                                            outline: 'none'
                                        }}
                                        placeholder="e.g. Neon Tetra"
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                                        Category *
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            borderRadius: '10px',
                                            border: '1px solid var(--border-color)',
                                            backgroundColor: 'var(--input-bg)',
                                            color: 'var(--text-main)',
                                            outline: 'none'
                                        }}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows="3"
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            borderRadius: '10px',
                                            border: '1px solid var(--border-color)',
                                            backgroundColor: 'var(--input-bg)',
                                            color: 'var(--text-main)',
                                            outline: 'none',
                                            resize: 'vertical'
                                        }}
                                        placeholder="Describe the product features..."
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                                        My Retail Price (₹) *
                                        <span style={{ fontSize: '0.8rem', marginLeft: '10px', color: 'var(--text-secondary)', fontWeight: 'normal' }}>
                                            (Cost to you: ₹{formData.priceWholesaler || 0})
                                        </span>
                                    </label>
                                    <div style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
                                        {[10, 20, 30].map(margin => (
                                            <button
                                                key={margin}
                                                type="button"
                                                onClick={() => {
                                                    const cost = parseFloat(formData.priceWholesaler) || 0;
                                                    if (cost > 0) {
                                                        const newPrice = (cost * (1 + margin / 100)).toFixed(2);
                                                        setFormData(prev => ({ ...prev, priceRetailer: newPrice }));
                                                    }
                                                }}
                                                style={{
                                                    padding: '2px 8px',
                                                    fontSize: '0.7rem',
                                                    borderRadius: '4px',
                                                    border: '1px solid var(--border-color)',
                                                    background: 'rgba(255,255,255,0.1)',
                                                    color: 'var(--text-secondary)',
                                                    cursor: 'pointer'
                                                }}
                                                title={`Set to ${margin}% profit margin`}
                                            >
                                                +{margin}%
                                            </button>
                                        ))}
                                    </div>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.priceRetailer}
                                        onChange={(e) => setFormData({ ...formData, priceRetailer: e.target.value })}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            borderRadius: '10px',
                                            border: '1px solid var(--border-color)',
                                            backgroundColor: 'var(--input-bg)',
                                            color: 'var(--text-main)'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                                        Customer Price (₹) *
                                        <span style={{ fontSize: '0.8rem', marginLeft: '10px', color: 'var(--text-secondary)', fontWeight: 'normal' }}>
                                            (Rec. Margin)
                                        </span>
                                    </label>
                                    <div style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
                                        {[15, 25, 50].map(margin => (
                                            <button
                                                key={margin}
                                                type="button"
                                                onClick={() => {
                                                    const cost = parseFloat(formData.priceRetailer) || 0;
                                                    if (cost > 0) {
                                                        const newPrice = (cost * (1 + margin / 100)).toFixed(2);
                                                        setFormData(prev => ({ ...prev, priceCustomer: newPrice }));
                                                    }
                                                }}
                                                style={{
                                                    padding: '2px 8px',
                                                    fontSize: '0.7rem',
                                                    borderRadius: '4px',
                                                    border: '1px solid var(--border-color)',
                                                    background: 'rgba(255,255,255,0.1)',
                                                    color: 'var(--text-secondary)',
                                                    cursor: 'pointer'
                                                }}
                                                title={`Set to ${margin}% markup from Retailer Price`}
                                            >
                                                +{margin}%
                                            </button>
                                        ))}
                                    </div>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.priceCustomer}
                                        onChange={(e) => setFormData({ ...formData, priceCustomer: e.target.value })}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            borderRadius: '10px',
                                            border: '1px solid var(--border-color)',
                                            backgroundColor: 'var(--input-bg)',
                                            color: 'var(--text-main)',
                                            fontWeight: 'bold'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                                        Stock Quantity *
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            borderRadius: '10px',
                                            border: '1px solid var(--border-color)',
                                            backgroundColor: 'var(--input-bg)',
                                            color: 'var(--text-main)'
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    style={{
                                        padding: '12px 30px',
                                        backgroundColor: 'transparent',
                                        color: 'var(--text-secondary)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '30px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        padding: '12px 40px',
                                        background: 'linear-gradient(45deg, var(--ocean-blue), var(--aqua-blue))',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '30px',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        fontWeight: 'bold',
                                        boxShadow: '0 4px 15px rgba(0, 168, 204, 0.3)',
                                        opacity: loading ? 0.7 : 1
                                    }}
                                >
                                    {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Unified Inventory Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '25px'
                }}>
                    {allProducts.length === 0 ? (
                        <div style={{
                            gridColumn: '1 / -1',
                            textAlign: 'center',
                            padding: '60px',
                            backgroundColor: 'var(--card-bg)',
                            borderRadius: '20px',
                            border: '1px solid var(--border-color)'
                        }}>
                            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '20px' }}>📦</span>
                            <h3 style={{ color: 'var(--text-secondary)' }}>No products found in this category.</h3>
                            {activeTab === 'all' && (
                                <p style={{ color: 'var(--text-secondary)' }}>Start by adding a new product or buying from wholesales!</p>
                            )}
                        </div>
                    ) : (
                        allProducts.map(product => {
                            const stockStatus = getStockStatus(product.quantity || product.stock || 0);
                            return (
                                <div
                                    key={product._id || product.id}
                                    style={{
                                        position: 'relative',
                                        backgroundColor: 'var(--card-bg)',
                                        borderRadius: '15px',
                                        overflow: 'hidden',
                                        border: '1px solid var(--border-color)',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                        e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.1)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
                                    }}
                                >
                                    {/* Type Badge */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '15px',
                                        right: '15px',
                                        padding: '4px 10px',
                                        borderRadius: '20px',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold',
                                        backgroundColor: product.type === 'mine' ? 'var(--ocean-blue)' : '#9b59b6',
                                        color: 'white',
                                        zIndex: 2
                                    }}>
                                        {product.type === 'mine' ? 'MY PRODUCT' : 'RESALE ITEM'}
                                    </div>

                                    {/* Image Placeholder or Actual Image */}
                                    <div style={{
                                        height: '180px',
                                        backgroundColor: 'var(--input-bg)',
                                        backgroundImage: product.images && product.images.length > 0 ? `url(${product.images[0]})` : 'none',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderBottom: '1px solid var(--border-color)'
                                    }}>
                                        {(!product.images || product.images.length === 0) && (
                                            <span style={{ fontSize: '3rem' }}>🐠</span>
                                        )}
                                    </div>

                                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <h3 style={{ margin: '0 0 10px 0', color: 'var(--ocean-blue)', fontSize: '1.2rem' }}>
                                            {product.name}
                                        </h3>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                            <span style={{
                                                padding: '4px 10px',
                                                borderRadius: '8px',
                                                fontSize: '0.8rem',
                                                backgroundColor: 'rgba(0, 168, 204, 0.1)',
                                                color: 'var(--ocean-blue)',
                                                fontWeight: 'bold'
                                            }}>
                                                {product.category}
                                            </span>
                                            <span style={{
                                                padding: '4px 10px',
                                                borderRadius: '8px',
                                                fontSize: '0.8rem',
                                                backgroundColor: stockStatus.bg,
                                                color: stockStatus.color,
                                                fontWeight: 'bold'
                                            }}>
                                                {stockStatus.label} ({product.quantity || product.stock || 0})
                                            </span>
                                        </div>

                                        <div style={{
                                            backgroundColor: 'var(--input-bg)',
                                            padding: '10px',
                                            borderRadius: '10px',
                                            marginBottom: '15px'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>You Sell For:</span>
                                                <span style={{ fontWeight: 'bold', color: '#2ecc71' }}>₹{product.suggestedRetailPrice || product.retailPrice || 0}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>You Pay:</span>
                                                <span style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>₹{product.wholesalePrice || product.purchasePrice || 0}</span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                                            {product.type === 'mine' && (
                                                <>
                                                    <button
                                                        onClick={() => handleEdit(product)}
                                                        style={{
                                                            flex: 1,
                                                            padding: '10px',
                                                            backgroundColor: 'var(--ocean-blue)',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '8px',
                                                            cursor: 'pointer',
                                                            fontWeight: 'bold',
                                                            transition: 'background 0.2s'
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product._id)}
                                                        style={{
                                                            flex: 1,
                                                            padding: '10px',
                                                            backgroundColor: 'transparent',
                                                            color: '#e74c3c',
                                                            border: '1px solid #e74c3c',
                                                            borderRadius: '8px',
                                                            cursor: 'pointer',
                                                            fontWeight: 'bold',
                                                            transition: 'background 0.2s'
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                            {product.type === 'resale' && (
                                                <button
                                                    onClick={() => navigate('/retailer/wholesaler-products')}
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px',
                                                        backgroundColor: '#9b59b6',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    Buy More Stock
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}

export default RetailerProductManagement;
