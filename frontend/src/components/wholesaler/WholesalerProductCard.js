import React from 'react';
import { Link } from 'react-router-dom';
import { getPriceForRole } from '../../utils/userUtils';

const WholesalerProductCard = ({ product, onEdit, onDelete }) => {
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



  return (
    <div
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '20px',
        borderRadius: '15px',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
        position: 'relative',
        border: '1px solid rgba(0, 168, 204, 0.1)',
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
        color: '#0a4f70',
        margin: '0 0 10px 0',
        fontSize: '1.4rem'
      }}>
        {product.name}
      </h3>

      <p style={{
        color: '#666',
        margin: '0 0 5px 0',
        fontSize: '0.9rem'
      }}>
        <strong>Category:</strong> {product.category}
      </p>

      <p style={{
        color: '#666',
        margin: '0 0 15px 0',
        flex: 1
      }}>
        <strong>Description:</strong> {product.description}
      </p>

      {/* Pricing Information */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '10px',
        padding: '10px',
        backgroundColor: 'rgba(0, 168, 204, 0.1)',
        borderRadius: '8px'
      }}>
        <div>
          <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#666' }}>Wholesale Price</p>
          <span style={{
            fontSize: '1.3rem',
            fontWeight: 'bold',
            color: '#0a4f70'
          }}>
            ₹{product.wholesalePrice || product.priceWholesaler || 0}
          </span>
        </div>
        <div>
          <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#666' }}>Retail Margin</p>
          <span style={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: '#f39c12'
          }}>
            {/* Retailer Margin = Suggested Retail - Wholesale */}
            ₹{(product.suggestedRetailPrice || product.priceCustomer || 0) - (product.wholesalePrice || product.priceWholesaler || 0)}
          </span>
        </div>
        <div>
          <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#666' }}>Customer Price</p>
          <span style={{
            fontSize: '1.3rem',
            fontWeight: 'bold',
            color: '#e74c3c'
          }}>
            ₹{product.suggestedRetailPrice || product.priceCustomer || 0}
          </span>
        </div>
      </div>

      {/* Margin Details */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '10px',
        padding: '10px',
        backgroundColor: 'rgba(46, 204, 113, 0.1)',
        borderRadius: '8px'
      }}>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#666', width: '100%', textAlign: 'center' }}>
          <strong>Retailer Profit Margin:</strong>
          {(() => {
            const wp = product.wholesalePrice || product.priceWholesaler || 0;
            const cp = product.suggestedRetailPrice || product.priceCustomer || 0;
            const margin = cp - wp;
            const percent = wp > 0 ? ((margin / wp) * 100).toFixed(1) : 0;
            return ` ₹${margin} (${percent}%)`;
          })()}
        </p>
      </div>

      {/* Stock Information */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '10px',
        padding: '10px',
        backgroundColor: 'rgba(155, 89, 182, 0.1)',
        borderRadius: '8px'
      }}>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}><strong>Stock:</strong> {product.stock || product.quantity || 0}</p>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
          <strong>Potential Sales Value:</strong> ₹{(product.wholesalePrice || product.priceWholesaler || 0) * (product.stock || product.quantity || 0)}
        </p>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '15px',
        gap: '10px'
      }}>
        <button
          onClick={() => onEdit(product)}
          style={{
            padding: '6px 12px',
            backgroundColor: '#f39c12',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            minWidth: '80px',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#e67e22';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#f39c12';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(product)}
          style={{
            padding: '6px 12px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            minWidth: '80px',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#c0392b';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#e74c3c';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default WholesalerProductCard;