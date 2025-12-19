import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactImageMagnify from 'react-image-magnify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { getRetailerProductById } from '../../services/retailerService';
import ProductReviews from '../shared/ProductReviews';

import { useComparison } from '../../context/ComparisonContext';

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const navigate = useNavigate();
  const { addToCompare } = useComparison();

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await getRetailerProductById(productId);
      const data = response.product || response;
      setProduct(data);
      if (data.images && data.images.length > 0) {
        setActiveImage(data.images[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/customer/products');
  };

  const handleAddToCart = () => {
    const prodId = product._id || product.id;
    if (!prodId) {
      alert("Error: Product ID missing");
      return;
    }

    const savedCart = localStorage.getItem('customerCart');
    const cart = savedCart ? JSON.parse(savedCart) : [];

    const existingItemIndex = cart.findIndex(item => {
      const itemProductId = item.product?._id || item.product?.id;
      return itemProductId && prodId && String(itemProductId) === String(prodId);
    });

    let newCart;
    if (existingItemIndex > -1) {
      newCart = [...cart];
      newCart[existingItemIndex].quantity += 1;
    } else {
      newCart = [...cart, { product, quantity: 1 }];
    }

    localStorage.setItem('customerCart', JSON.stringify(newCart));
    alert(`${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '20px' }}>
        <div className="card" style={{ display: 'flex', gap: '30px' }}>
          <div style={{ flex: 1 }}>
            <Skeleton height={400} />
          </div>
          <div style={{ flex: 1 }}>
            <Skeleton height={40} width={300} style={{ marginBottom: 20 }} />
            <Skeleton count={3} height={20} style={{ marginBottom: 10 }} />
            <Skeleton height={100} style={{ marginBottom: 20 }} />
            <Skeleton height={50} width={150} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{
        padding: '20px',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h2>Product not found</h2>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      minHeight: '100vh'
    }}>
      <div style={{
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: 'var(--card-bg)',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
      }}>
        <button
          onClick={handleBack}
          style={{
            padding: '10px 20px',
            backgroundColor: 'var(--ocean-blue)',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          ← Back to Products
        </button>
      </div>

      <div className="card" style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '30px',
        padding: '30px',
      }}>
        {/* Image Gallery */}
        <div style={{ flex: '1 1 500px' }}>
          <div style={{
            marginBottom: '20px',
            borderRadius: '10px',
            overflow: 'hidden',
            border: '1px solid var(--border-color)',
            zIndex: 10
          }}>
            {activeImage ? (
              <ReactImageMagnify {...{
                smallImage: {
                  alt: product.name,
                  isFluidWidth: true,
                  src: typeof activeImage === 'string' ? activeImage : URL.createObjectURL(activeImage)
                },
                largeImage: {
                  src: typeof activeImage === 'string' ? activeImage : URL.createObjectURL(activeImage),
                  width: 1200,
                  height: 1800
                },
                enlargedImageContainerDimensions: {
                  width: '150%',
                  height: '150%'
                }
              }} />
            ) : (
              <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0' }}>No Image</div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
            {product.images && product.images.map((img, index) => (
              <div
                key={index}
                onClick={() => setActiveImage(img)}
                style={{
                  width: '80px',
                  height: '80px',
                  border: activeImage === img ? '2px solid var(--aqua-blue)' : '2px solid transparent',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                <img
                  src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                  alt={`${product.name} ${index}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Information */}
        <div style={{ flex: '1 1 400px' }}>
          <h1 style={{ color: 'var(--ocean-blue)', marginBottom: '20px' }}>{product.name}</h1>

          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}><strong>Category:</strong> {product.category && product.category.replace ? product.category.replace('-', ' ') : product.category}</p>
            <p style={{ fontSize: '1.5rem', marginBottom: '10px', color: 'var(--coral)', fontWeight: 'bold' }}>₹{product.retailPrice}</p>
            <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
              <strong>In Stock:</strong> <span style={{ color: product.stock > 0 ? '#4caf50' : '#f44336' }}>{product.stock > 0 ? product.stock : 'Out of Stock'}</span>
            </p>

            {product.retailer && (
              <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
                <strong>Seller:</strong> {product.retailer.storeName || product.retailer.businessName || product.retailer.name}
              </p>
            )}

            {product.specifications?.fishType && (
              <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}><strong>Fish Type:</strong> {product.specifications.fishType}</p>
            )}

            {/* Comparison attributes */}
            <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
              <span style={{ padding: '5px 10px', background: 'var(--light-aqua)', borderRadius: '15px', fontSize: '0.9rem' }}>
                Care: {product.specifications?.careLevel || 'Medium'}
              </span>
              <span style={{ padding: '5px 10px', background: 'var(--light-aqua)', borderRadius: '15px', fontSize: '0.9rem' }}>
                Temp: {product.specifications?.temperament || 'Peaceful'}
              </span>
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--ocean-blue)', marginBottom: '15px' }}>Description</h2>
            <p style={{ lineHeight: '1.6' }}>{product.description}</p>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              style={{
                padding: '15px 40px',
                backgroundColor: product.stock > 0 ? 'var(--ocean-blue)' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '30px',
                cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                flex: 1
              }}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>

            <button
              style={{
                padding: '15px',
                backgroundColor: 'transparent',
                color: 'var(--ocean-blue)',
                border: '2px solid var(--ocean-blue)',
                borderRadius: '30px',
                cursor: 'pointer',
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}
              onClick={() => addToCompare(product)}
            >
              ⚖️ Compare
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <ProductReviews productId={product._id} />
    </div>
  );
}

export default ProductDetail;