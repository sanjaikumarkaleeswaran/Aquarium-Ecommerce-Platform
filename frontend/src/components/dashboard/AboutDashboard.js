import React from 'react';

function AboutDashboard() {
  return (
    <div style={{ 
      padding: '20px',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      borderRadius: '10px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{ 
        color: '#0a4f70',
        marginBottom: '20px'
      }}>
        📘 About Us
      </h2>
      
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        marginBottom: '20px'
      }}>
        <h3>Our Mission</h3>
        <p>
          At Aquarium Commerce, our mission is to revolutionize the aquarium industry by connecting hobbyists, retailers, 
          and wholesalers through a seamless digital platform. We aim to make aquarium supplies more accessible while 
          fostering a thriving community of aquatic enthusiasts.
        </p>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
        }}>
          <h3>Our Vision</h3>
          <p>
            To become the world's leading marketplace for aquarium products, promoting sustainable practices 
            and supporting the growth of both businesses and hobbyists in the aquatic community.
          </p>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
        }}>
          <h3>Core Values</h3>
          <ul>
            <li>Quality and Sustainability</li>
            <li>Community Building</li>
            <li>Innovation and Technology</li>
            <li>Transparency and Trust</li>
          </ul>
        </div>
      </div>
      
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
      }}>
        <h3>Platform Features</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '15px',
          marginTop: '15px'
        }}>
          <div>
            <h4>🛒 B2B & B2C Marketplace</h4>
            <p>Connect buyers and sellers across all segments of the aquarium industry</p>
          </div>
          <div>
            <h4>📦 Inventory Management</h4>
            <p>Real-time tracking and automated reorder suggestions</p>
          </div>
          <div>
            <h4>📊 Analytics Dashboard</h4>
            <p>Data-driven insights for better business decisions</p>
          </div>
          <div>
            <h4>🚚 Order Fulfillment</h4>
            <p>Streamlined processing from order to delivery</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutDashboard;