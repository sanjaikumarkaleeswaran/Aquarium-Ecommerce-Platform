import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-brand">
          <h3 className="footer-title">
            Aquarium Commerce
          </h3>
          <p className="footer-subtitle">
            🌊 Your Ultimate B2B & B2C Marketplace for All Things Aquatic! 🐠
          </p>
        </div>

        <div className="footer-links">
          <div>
            <h4 className="links-group-title">
              Quick Links
            </h4>
            <ul className="links-list">
              <li className="link-item">
                <a href="/" className="footer-link">Home</a>
              </li>
              <li className="link-item">
                <a href="/products" className="footer-link">Products</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="links-group-title">
              Support
            </h4>
            <ul className="links-list">
              <li className="link-item">
                <a href="/contact" className="footer-link">Contact Us</a>
              </li>
              <li className="link-item">
                <a href="/faq" className="footer-link">FAQ</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-copyright">
        <p style={{ margin: 0 }}>
          © {new Date().getFullYear()} Aquarium Commerce. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;