import React from 'react';

function SuppliersDashboard() {
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
        🚚 Suppliers Management
      </h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
        }}>
          <h3>Total Suppliers</h3>
          <p style={{ fontSize: '2rem', color: '#00a8cc' }}>86</p>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
        }}>
          <h3>Active</h3>
          <p style={{ fontSize: '2rem', color: '#1dd1a1' }}>72</p>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
        }}>
          <h3>New This Quarter</h3>
          <p style={{ fontSize: '2rem', color: '#4ecdc4' }}>8</p>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
        }}>
          <h3>Avg. Rating</h3>
          <p style={{ fontSize: '2rem', color: '#f368e0' }}>4.7</p>
        </div>
      </div>
      
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
      }}>
        <h3>Top Suppliers</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <th style={{ textAlign: 'left', padding: '10px' }}>Supplier</th>
              <th style={{ textAlign: 'left', padding: '10px' }}>Category</th>
              <th style={{ textAlign: 'left', padding: '10px' }}>Products</th>
              <th style={{ textAlign: 'left', padding: '10px' }}>Rating</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>Oceanic Aquatics Ltd</td>
              <td style={{ padding: '10px' }}>Fish & Invertebrates</td>
              <td style={{ padding: '10px' }}>142</td>
              <td style={{ padding: '10px' }}>⭐ 4.9</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>Aquatic Equipment Co.</td>
              <td style={{ padding: '10px' }}>Tanks & Equipment</td>
              <td style={{ padding: '10px' }}>86</td>
              <td style={{ padding: '10px' }}>⭐ 4.7</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>Marine Life Imports</td>
              <td style={{ padding: '10px' }}>Saltwater Species</td>
              <td style={{ padding: '10px' }}>64</td>
              <td style={{ padding: '10px' }}>⭐ 4.8</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SuppliersDashboard;