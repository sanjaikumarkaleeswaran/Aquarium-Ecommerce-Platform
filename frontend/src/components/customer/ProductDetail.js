import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactImageMagnify from 'react-image-magnify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { getRetailerProductById } from '../../services/retailerService';
import ProductReviews from '../shared/ProductReviews';
import './ProductDetail.css';

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
      <div className="skeleton-container">
        <div className="skeleton-card">
          <div className="skeleton-left">
            <Skeleton height={400} />
          </div>
          <div className="skeleton-right">
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
      <div className="product-not-found">
        <h2>Product not found</h2>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <div className="back-btn-container">
        <button
          onClick={handleBack}
          className="back-btn"
        >
          ← Back to Products
        </button>
      </div>

      <div className="product-detail-card">
        {/* Image Gallery */}
        <div className="gallery-section">
          <div className="main-image-container">
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
              <div className="no-image-placeholder">No Image</div>
            )}
          </div>
          <div className="thumbnail-strip">
            {product.images && product.images.map((img, index) => (
              <div
                key={index}
                onClick={() => setActiveImage(img)}
                className="thumbnail-container"
                style={{
                  border: activeImage === img ? '2px solid var(--aqua-blue)' : '2px solid transparent',
                }}
              >
                <img
                  src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                  alt={`${product.name} ${index}`}
                  className="thumbnail-image"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Information */}
        <div className="info-section">
          <h1 className="product-title">{product.name}</h1>

          <div className="product-meta">
            <p className="meta-row"><strong>Category:</strong> {product.category && product.category.replace ? product.category.replace('-', ' ') : product.category}</p>
            <p className="product-price">₹{product.retailPrice}</p>
            <p className="meta-row">
              <strong>In Stock:</strong> <span className="stock-status" style={{ color: product.stock > 0 ? '#4caf50' : '#f44336' }}>{product.stock > 0 ? product.stock : 'Out of Stock'}</span>
            </p>

            {product.retailer && (
              <p className="meta-row">
                <strong>Seller:</strong> {product.retailer.storeName || product.retailer.businessName || product.retailer.name}
              </p>
            )}

            {product.specifications?.fishType && (
              <p className="meta-row"><strong>Fish Type:</strong> {product.specifications.fishType}</p>
            )}

            {/* Comparison attributes */}
            <div className="comparison-tags">
              <span className="tag-badge">
                Care: {product.specifications?.careLevel || 'Medium'}
              </span>
              <span className="tag-badge">
                Temp: {product.specifications?.temperament || 'Peaceful'}
              </span>
            </div>
          </div>

          <div className="description-section">
            <h2 className="description-title">Description</h2>
            <p className="description-text">{product.description}</p>
          </div>

          <div className="actions-row">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="btn-add-cart"
              style={{
                backgroundColor: product.stock > 0 ? 'var(--ocean-blue)' : '#ccc',
                cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
              }}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>

            <button
              className="btn-compare"
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