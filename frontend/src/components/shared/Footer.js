import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'rgba(10, 79, 112, 0.9)',
      color: 'white',
      padding: '30px 20px',
      marginTop: '40px',
      textAlign: 'center',
      borderTop: '1px solid rgba(0, 168, 204, 0.3)',
      position: 'relative'
    }}>
      <style>
        {`
          @keyframes lightning {
            0% {
              text-shadow: 0 0 5px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 255, 255, 0.3);
            }
            50% {
              text-shadow: 0 0 15px rgba(255, 255, 255, 0.8), 0 0 25px rgba(255, 255, 255, 0.6), 0 0 35px rgba(255, 255, 255, 0.4);
            }
            100% {
              text-shadow: 0 0 10px rgba(255, 255, 255, 0.7), 0 0 20px rgba(255, 255, 255, 0.5), 0 0 30px rgba(255, 255, 255, 0.3);
            }
          }
        `}
      </style>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px'
      }}>
        <div>
          <h3 style={{
            color: '#00a8cc',
            margin: '0 0 10px 0',
            fontSize: '1.5rem'
          }}>
            Aquarium Commerce
          </h3>
          <p style={{
            margin: 0,
            maxWidth: '300px',
            fontSize: '0.9rem',
            opacity: 0.9,
            textShadow: '0 0 10px rgba(255, 255, 255, 0.7), 0 0 20px rgba(255, 255, 255, 0.5), 0 0 30px rgba(255, 255, 255, 0.3)',
            animation: 'lightning 2s infinite alternate'
          }}>
            🌊 Your Ultimate B2B & B2C Marketplace for All Things Aquatic! 🐠
          </p>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '30px',
          flexWrap: 'wrap'
        }}>
          <div>
            <h4 style={{
              color: '#00a8cc',
              margin: '0 0 10px 0',
              fontSize: '1.1rem'
            }}>
              Quick Links
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              <li style={{ margin: '5px 0' }}>
                <a 
                  href="/" 
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    transition: 'color 0.3s'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.color = '#00a8cc';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.color = 'white';
                  }}
                >
                  Home
                </a>
              </li>
              <li style={{ margin: '5px 0' }}>
                <a 
                  href="/products" 
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    transition: 'color 0.3s'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.color = '#00a8cc';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.color = 'white';
                  }}
                >
                  Products
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 style={{
              color: '#00a8cc',
              margin: '0 0 10px 0',
              fontSize: '1.1rem'
            }}>
              Support
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              <li style={{ margin: '5px 0' }}>
                <a 
                  href="/contact" 
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    transition: 'color 0.3s'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.color = '#00a8cc';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.color = 'white';
                  }}
                >
                  Contact Us
                </a>
              </li>
              <li style={{ margin: '5px 0' }}>
                <a 
                  href="/faq" 
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    transition: 'color 0.3s'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.color = '#00a8cc';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.color = 'white';
                  }}
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div style={{
        borderTop: '1px solid rgba(0, 168, 204, 0.2)',
        marginTop: '20px',
        paddingTop: '20px',
        fontSize: '0.9rem',
        opacity: 0.8
      }}>
        <p style={{ margin: 0 }}>
          © {new Date().getFullYear()} Aquarium Commerce. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;