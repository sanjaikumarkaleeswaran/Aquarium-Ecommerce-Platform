import React from 'react';

function CustomersDashboard() {
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
        👥 Customers Management
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
          <h3>Total Customers</h3>
          <p style={{ fontSize: '2rem', color: '#00a8cc' }}>1,842</p>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
        }}>
          <h3>New This Month</h3>
          <p style={{ fontSize: '2rem', color: '#4ecdc4' }}>124</p>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
        }}>
          <h3>Active</h3>
          <p style={{ fontSize: '2rem', color: '#1dd1a1' }}>1,426</p>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
        }}>
          <h3>Premium</h3>
          <p style={{ fontSize: '2rem', color: '#f368e0' }}>342</p>
        </div>
      </div>
      
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
      }}>
        <h3>Recent Customers</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <th style={{ textAlign: 'left', padding: '10px' }}>Customer</th>
              <th style={{ textAlign: 'left', padding: '10px' }}>Email</th>
              <th style={{ textAlign: 'left', padding: '10px' }}>Join Date</th>
              <th style={{ textAlign: 'left', padding: '10px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>John Smith</td>
              <td style={{ padding: '10px' }}>john.smith@email.com</td>
              <td style={{ padding: '10px' }}>Dec 5, 2023</td>
              <td style={{ padding: '10px' }}><span style={{ color: '#1dd1a1' }}>Active</span></td>
            </tr>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>Sarah Johnson</td>
              <td style={{ padding: '10px' }}>sarah.j@email.com</td>
              <td style={{ padding: '10px' }}>Dec 3, 2023</td>
              <td style={{ padding: '10px' }}><span style={{ color: '#1dd1a1' }}>Active</span></td>
            </tr>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>Michael Brown</td>
              <td style={{ padding: '10px' }}>m.brown@email.com</td>
              <td style={{ padding: '10px' }}>Dec 1, 2023</td>
              <td style={{ padding: '10px' }}><span style={{ color: '#ff9ff3' }}>Premium</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CustomersDashboard;