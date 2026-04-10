import React from 'react';
import './WholesalerProductCard.css';

const WholesalerProductCard = ({ product, onEdit, onDelete }) => {
  const getProductImage = (product) => {
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      if (product.images[0].startsWith('data:image')) return product.images[0];
      if (product.images[0].startsWith('http')) return product.images[0];
    }
    return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiM0ZmEyY2MiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIyMCIgZmlsbD0iIzNmOGFkYSIvPjxjaXJjbGUgY3g9IjcwIiBjeT0iMzAiIHI9IjgiIGZpbGw9IiNmZmZmMDAiLz48L3N2Zz4=';
  };

  const wp = product.wholesalePrice || product.priceWholesaler || 0;
  const cp = product.suggestedRetailPrice || product.priceCustomer || 0;
  const margin = cp - wp;
  const percent = wp > 0 ? ((margin / wp) * 100).toFixed(1) : 0;

  return (
    <div className="card wholesaler-product-card animate-fade-in">
      <div className="product-image-container">
        <img src={getProductImage(product)} alt={product.name} loading="lazy" />
      </div>

      <h3 className="ocean-blue" style={{ margin: '0 0 8px 0', fontSize: '1.25rem' }}>{product.name}</h3>
      
      <p className="text-secondary" style={{ margin: '0 0 4px 0', fontSize: '0.85rem' }}>
        <strong>{product.category}</strong>
      </p>
      
      <p className="text-secondary" style={{ margin: '0 0 15px 0', fontSize: '0.9rem', flex: 1 }}>
        {product.description?.length > 80 ? product.description.substring(0, 80) + '...' : product.description}
      </p>

      <div className="price-info-grid">
        <div className="price-box">
          <span className="price-label">Wholesale</span>
          <span className="price-value">₹{wp}</span>
        </div>
        <div className="price-box">
          <span className="price-label">Margin</span>
          <span className="price-value" style={{ color: '#f39c12' }}>₹{margin}</span>
        </div>
        <div className="price-box">
          <span className="price-label">Retail</span>
          <span className="price-value" style={{ color: '#e74c3c' }}>₹{cp}</span>
        </div>
      </div>

      <div className="margin-badge">
        <span className="font-bold" style={{ color: '#27ae60' }}>
          Profit: ₹{margin} ({percent}%)
        </span>
      </div>

      <div className="stock-info">
        <span>Stock: <strong>{product.stock || product.quantity || 0}</strong></span>
        <span>Value: <strong>₹{wp * (product.stock || product.quantity || 0)}</strong></span>
      </div>

      <div className="card-actions">
        <button onClick={() => onEdit(product)} className="btn-secondary" style={{ backgroundColor: '#f39c12' }}>Edit</button>
        <button onClick={() => onDelete(product)} className="btn-danger" style={{ backgroundColor: '#e74c3c' }}>Delete</button>
      </div>
    </div>
  );
};

export default WholesalerProductCard;


export default WholesalerProductCard;