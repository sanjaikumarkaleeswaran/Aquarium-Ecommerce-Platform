import React from 'react';
import { Link } from 'react-router-dom';
import { getDisplayPrice } from '../../utils/userUtils';

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
    <div
      style={{
        backgroundColor: 'var(--card-bg)', // Use theme variable
        padding: '20px',
        borderRadius: '15px',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
        position: 'relative',
        border: '1px solid var(--border-color)', // Use theme variable
        transition: 'all 0.3s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.08)';
      }}
    >
      {showRecommendedBadge && (
        <div style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          backgroundColor: 'var(--aqua-blue)',
          color: 'white',
          padding: '5px 12px',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: 'bold'
        }}>
          Recommended
        </div>
      )}

      {/* Product Image */}
      <div style={{
        width: '100%',
        height: '200px',
        marginBottom: '15px',
        overflow: 'hidden',
        borderRadius: '10px'
      }}>
        <img
          src={getProductImage(product)}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>

      <h3 style={{
        color: 'var(--ocean-blue)', // Use theme variable
        margin: '0 0 10px 0',
        fontSize: '1.4rem'
      }}>
        {product.name}
      </h3>

      <p style={{
        color: 'var(--text-secondary)', // Use theme variable
        margin: '0 0 5px 0',
        fontSize: '0.9rem'
      }}>
        <strong>Category:</strong> {product.category}
      </p>

      <p style={{
        color: 'var(--text-secondary)', // Use theme variable
        margin: '0 0 15px 0',
        flex: 1
      }}>
        <strong>Description:</strong> {product.description}
      </p>

      {/* Stock Information */}
      <div style={{
        marginBottom: '15px',
        padding: '10px',
        borderRadius: '8px',
        // Keep functional colors but potentially adapt opacity if needed later, hardcoded functional colors are usually fine unless they clash badly logic-wise with dark mode (e.g. green text on black is ok, but white background here might be issue? Let's check)
        // Actually, hardcoded backgrounds inside a dark card will look like bright blocks. 
        // Let's use darker variants or transparent with border for dark mode compatibility if we can, or just keep as is if 'var' not available for status specific colors.
        // For safe quick fix, we keep them as functional alerts (often standard colors).
        backgroundColor: product.stock > 10 ? 'rgba(76, 175, 80, 0.1)' : product.stock > 0 ? 'rgba(255, 152, 0, 0.1)' : 'rgba(244, 67, 54, 0.1)',
        border: `1px solid ${product.stock > 10 ? '#4caf50' : product.stock > 0 ? '#ff9800' : '#f44336'}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{
            fontSize: '0.9rem',
            fontWeight: 'bold',
            color: product.stock > 10 ? '#4caf50' : product.stock > 0 ? '#ff9800' : '#f44336' // Brightened for dark mode readability
          }}>
            {product.stock > 10 ? '✓ In Stock' : product.stock > 0 ? '⚠ Low Stock' : '✗ Out of Stock'}
          </span>
          <span style={{
            fontSize: '1.1rem',
            fontWeight: 'bold',
            color: product.stock > 10 ? '#4caf50' : product.stock > 0 ? '#ff9800' : '#f44336'
          }}>
            {product.stock || 0} units
          </span>
        </div>

        {/* Stock bar */}
        <div style={{
          marginTop: '8px',
          height: '6px',
          backgroundColor: 'var(--border-color)',
          borderRadius: '3px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${Math.min((product.stock / 50) * 100, 100)}%`,
            backgroundColor: product.stock > 10 ? '#4caf50' : product.stock > 0 ? '#ff9800' : '#f44336',
            transition: 'width 0.3s ease'
          }} />
        </div>

        {product.stock === 0 && (
          <p style={{
            margin: '8px 0 0 0',
            fontSize: '0.8rem',
            color: '#f44336',
            fontStyle: 'italic'
          }}>
            Currently unavailable
          </p>
        )}
        {product.stock > 0 && product.stock <= 5 && (
          <p style={{
            margin: '8px 0 0 0',
            fontSize: '0.8rem',
            color: '#ff9800',
            fontStyle: 'italic'
          }}>
            Only {product.stock} left - Order soon!
          </p>
        )}
      </div>

      <div style={{ marginTop: 'auto' }}>
        <h3 style={{
          color: 'var(--ocean-blue)',
          margin: '10px 0 15px 0',
          fontSize: '1.5rem'
        }}>
          ₹{displayPrice}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Action Row: View & Locations */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => onViewDetails(product)}
              style={{
                flex: 1,
                padding: '8px',
                backgroundColor: 'transparent',
                color: 'var(--ocean-blue)',
                border: '1px solid var(--ocean-blue)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                fontSize: '0.9rem'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'var(--ocean-blue)';
                e.target.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--ocean-blue)';
              }}
            >
              View
            </button>

            {onViewLocations && (
              <button
                onClick={() => onViewLocations(product)}
                style={{
                  flex: 1,
                  padding: '8px',
                  backgroundColor: 'transparent',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--text-secondary)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease',
                  fontSize: '0.9rem'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = 'var(--text-secondary)';
                  e.target.style.color = 'var(--card-bg)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'var(--text-secondary)';
                }}
              >
                Locations
              </button>
            )}
          </div>

          {/* Add to Cart - Primary Action */}
          <button
            onClick={() => product.stock > 0 && onAddToCart(product)}
            disabled={product.stock === 0}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: product.stock > 0 ? 'var(--aqua-blue)' : '#cccccc',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              fontSize: '1rem',
              boxShadow: product.stock > 0 ? '0 4px 10px rgba(0, 168, 204, 0.2)' : 'none',
              opacity: product.stock > 0 ? 1 : 0.6
            }}
            onMouseOver={(e) => {
              if (product.stock > 0) {
                e.target.style.backgroundColor = 'var(--ocean-blue)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 15px rgba(0, 168, 204, 0.3)';
              }
            }}
            onMouseOut={(e) => {
              if (product.stock > 0) {
                e.target.style.backgroundColor = 'var(--aqua-blue)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 10px rgba(0, 168, 204, 0.2)';
              }
            }}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>

          {/* Track Product */}
          <Link to={`/product/${product._id}/tracking`} style={{ textDecoration: 'none', width: '100%' }}>
            <button
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: 'var(--input-bg)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                fontSize: '0.9rem'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'var(--border-color)';
                e.target.style.color = 'var(--text-main)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'var(--input-bg)';
                e.target.style.color = 'var(--text-secondary)';
              }}
            >
              Track Product
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;