import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();
  const [fish, setFish] = useState([]);

  // Generate random swimming fish
  useEffect(() => {
    const fishEmojis = ['🐠', '🐟', '🐡', '🦈', '🐙'];
    const generatedFish = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      emoji: fishEmojis[Math.floor(Math.random() * fishEmojis.length)],
      size: Math.random() * 15 + 15,
      left: Math.random() * 90,
      top: Math.random() * 80,
      duration: Math.random() * 10 + 20,
      delay: Math.random() * 5,
    }));
    setFish(generatedFish);
  }, []);

  const handleRoleClick = (role) => {
    navigate(`/login/${role}`);
  };

  const roles = [
    {
      type: 'customer',
      icon: '🐠',
      title: 'Customer',
      description: 'Discover exotic fish and premium aquarium equipment for your home.',
      color: '#4CAF50',
      delay: '0s',
    },
    {
      type: 'retailer',
      icon: '🏪',
      title: 'Retailer',
      description: 'Access wholesale pricing and scale your local aquarium business.',
      color: '#FF9800',
      delay: '0.1s',
    },
    {
      type: 'wholesaler',
      icon: '📦',
      title: 'Wholesaler',
      description: 'Manage bulk supply and connect with retailers across India.',
      color: '#2196F3',
      delay: '0.2s',
    },
  ];

  const features = [
    { icon: '⚡', title: 'Fast Trade' },
    { icon: '🌐', title: 'Pan-India' },
    { icon: '💰', title: 'Best Prices' },
    { icon: '🔒', title: 'Secure' },
  ];

  return (
    <div className="homepage-container">
      {/* Background Elements */}
      <div className="aqua-decor">
        {fish.map((f) => (
          <div
            key={f.id}
            className="swimming-fish"
            style={{
              left: `${f.left}%`,
              top: `${f.top}%`,
              fontSize: `${f.size}px`,
              animationDuration: `${f.duration}s`,
              animationDelay: `${f.delay}s`,
            }}
          >
            {f.emoji}
          </div>
        ))}
        
        {/* Simplified Bubbles for Mobile Performance */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`bubble-${i}`}
            className="bubble"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 15 + 5}px`,
              height: `${Math.random() * 15 + 5}px`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${Math.random() * 6 + 6}s`,
            }}
          />
        ))}
      </div>

      <div className="homepage-hero">
        <div className="homepage-logo">🌊</div>
        <h1 className="homepage-title">Aquarium Commerce</h1>
        <p className="homepage-subtitle">
          India's Premier Aquatic Marketplace
        </p>
      </div>

      <div className="homepage-cards-container">
        {roles.map((role) => (
          <div
            key={role.type}
            className="homepage-card"
            style={{ animationDelay: role.delay }}
            onClick={() => handleRoleClick(role.type)}
          >
            <div className="role-icon-wrapper">{role.icon}</div>
            <h2>{role.title}</h2>
            <p>{role.description}</p>
            <button
              className="role-btn"
              style={{ backgroundColor: role.color }}
            >
              Enter as {role.title}
            </button>
          </div>
        ))}
      </div>

      <div className="features-section">
        {features.map((feature, index) => (
          <div key={index} className="feature-small">
            <span className="feat-icon">{feature.icon}</span>
            <span className="feat-text">{feature.title}</span>
          </div>
        ))}
      </div>

      <footer className="homepage-footer">
        <p>© 2024 Aquarium Commerce • 🇮🇳 Made in India</p>
      </footer>
    </div>
  );
}

export default HomePage;