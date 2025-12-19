import React from 'react';

/**
 * Simple component to test if an image URL loads correctly
 */
function ImageTest() {
  const testImageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-AGEMT0CVAzLmB9l_5JT6Fgo64PYDgbGGpQ&s';
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>Image Test</h2>
      <p>Testing if the image loads correctly:</p>
      <img 
        src={testImageUrl} 
        alt="Test" 
        style={{ width: '300px', height: 'auto' }}
        onError={(e) => {
          console.log('Image failed to load');
          e.target.src = 'https://images.unsplash.com/photo-1544787280-7a5e3b3f8a8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80';
        }}
      />
      <p>If you see the image above, it's working correctly.</p>
      <p>If you see a different image, the original image URL may be blocked.</p>
    </div>
  );
}

export default ImageTest;