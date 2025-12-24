import React from 'react';
import { Link } from 'react-router-dom';
import { getDisplayPrice } from '../../utils/userUtils';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart, onViewDetails, onViewLocations, showRecommendedBadge = false }) => {
  // Function to get the main image for a product
  const getProductImage = (product) => {
    // For backend products, check if images array exists and has items
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      // If it's a base64 image, use it directly
      if (product.images[0].startsWith('data:image')) {
        return product.images[0];
      }
      // If it's a URL, use it directly
      if (product.images[0].startsWith('http')) {
        return product.images[0];
      }
    }

    // Fallback to default image - using a direct data URL for a simple aquarium image
    return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiM0ZmEyY2MiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIyMCIgZmlsbD0iIzNmOGFkYSIvPjxjaXJjbGUgY3g9IjcwIiBjeT0iMzAiIHI9IjgiIGZpbGw9IiNmZmZmMDAiLz48L3N2Zz4=';
  };

  const displayPrice = getDisplayPrice(product);

  return (
    <div className="product-card">
      {showRecommendedBadge && (
        <div className="recommended-badge">
          Recommended
        </div>
      )}

      {/* Product Image */}
      <div className="product-image-container">
        <img
          src={getProductImage(product)}
          alt={product.name}
          className="product-image"
        />
      </div>

      <h3 className="product-name">
        {product.name}
      </h3>

      <p className="product-category">
        <strong>Category:</strong> {product.category}
      </p>

      <p className="product-description">
        <strong>Description:</strong> {product.description}
      </p>

      {/* Stock Information */}
      <div
        className="stock-info"
        style={{
          backgroundColor: product.stock > 10 ? 'rgba(76, 175, 80, 0.1)' : product.stock > 0 ? 'rgba(255, 152, 0, 0.1)' : 'rgba(244, 67, 54, 0.1)',
          border: `1px solid ${product.stock > 10 ? '#4caf50' : product.stock > 0 ? '#ff9800' : '#f44336'}`,
        }}
      >
        <div className="stock-header">
          <span
            className="stock-status"
            style={{ color: product.stock > 10 ? '#4caf50' : product.stock > 0 ? '#ff9800' : '#f44336' }}
          >
            {product.stock > 10 ? '✓ In Stock' : product.stock > 0 ? '⚠ Low Stock' : '✗ Out of Stock'}
          </span>
          <span
            className="stock-count"
            style={{ color: product.stock > 10 ? '#4caf50' : product.stock > 0 ? '#ff9800' : '#f44336' }}
          >
            {product.stock || 0} units
          </span>
        </div>

        {/* Stock bar */}
        <div className="stock-bar-container">
          <div
            className="stock-bar-fill"
            style={{
              width: `${Math.min((product.stock / 50) * 100, 100)}%`,
              backgroundColor: product.stock > 10 ? '#4caf50' : product.stock > 0 ? '#ff9800' : '#f44336',
            }}
          />
        </div>

        {product.stock === 0 && (
          <p className="stock-warning" style={{ color: '#f44336' }}>
            Currently unavailable
          </p>
        )}
        {product.stock > 0 && product.stock <= 5 && (
          <p className="stock-warning" style={{ color: '#ff9800' }}>
            Only {product.stock} left - Order soon!
          </p>
        )}
      </div>

      <div style={{ marginTop: 'auto' }}>
        <h3 className="product-price">
          ₹{displayPrice}
        </h3>

        <div className="product-actions">
          {/* Action Row: View & Locations */}
          <div className="action-row">
            <button
              onClick={() => onViewDetails(product)}
              className="btn-view"
            >
              View
            </button>

            {onViewLocations && (
              <button
                onClick={() => onViewLocations(product)}
                className="btn-locations"
              >
                Locations
              </button>
            )}
          </div>

          {/* Add to Cart - Primary Action */}
          <button
            onClick={() => product.stock > 0 && onAddToCart(product)}
            disabled={product.stock === 0}
            className="btn-add-to-cart"
            style={{
              backgroundColor: product.stock > 0 ? 'var(--aqua-blue)' : '#cccccc',
            }}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>

          {/* Track Product */}
          <Link to={`/product/${product._id}/tracking`} style={{ textDecoration: 'none', width: '100%' }}>
            <button className="btn-track">
              Track Product
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;