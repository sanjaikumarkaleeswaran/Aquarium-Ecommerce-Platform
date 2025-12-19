import React, { useState } from 'react';

/**
 * Image Gallery Component
 * Displays a main image with thumbnails for navigation
 * 
 * @param {Array} images - Array of image URLs
 * @param {string} alt - Alt text for images
 * @param {object} style - Custom styles for the gallery container
 */
function ImageGallery({ images = [], alt = "Product image", style = {} }) {
  const [selectedImage, setSelectedImage] = useState(0);
  
  // If no images, show a placeholder
  if (!images || images.length === 0) {
    return (
      <div style={{
        width: '100%',
        height: '300px',
        backgroundImage: 'url(https://images.unsplash.com/photo-1544787280-7a5e3b3f8a8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '10px',
        ...style
      }} />
    );
  }
  
  return (
    <div style={{ ...style }}>
      {/* Main Image */}
      <div style={{
        width: '100%',
        height: '300px',
        backgroundImage: `url(${images[selectedImage]})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        borderRadius: '10px',
        marginBottom: '15px'
      }} />
      
      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          overflowX: 'auto',
          paddingBottom: '10px'
        }}>
          {images.map((image, index) => (
            <img 
              key={index}
              src={image} 
              alt={`${alt} ${index + 1}`} 
              onClick={() => setSelectedImage(index)}
              style={{ 
                width: '60px', 
                height: '60px', 
                objectFit: 'cover', 
                borderRadius: '5px', 
                cursor: 'pointer',
                border: selectedImage === index ? '2px solid #00a8cc' : '1px solid #ddd'
              }} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageGallery;