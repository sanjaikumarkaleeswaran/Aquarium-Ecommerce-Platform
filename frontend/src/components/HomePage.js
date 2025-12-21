import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage({ onNavigate }) {
  const navigate = useNavigate();
  const [fish, setFish] = useState([]);

  // Generate random swimming fish
  useEffect(() => {
    const fishEmojis = ['🐠', '🐟', '🐡', '🦈', '🐙', '🦑', '🦀', '🦞'];
    const generatedFish = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      emoji: fishEmojis[Math.floor(Math.random() * fishEmojis.length)],
      size: Math.random() * 20 + 20,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 10 + 15,
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
      title: 'For Customers',
      description: 'Dive into our vast collection of aquarium products. Find everything from exotic fish to premium equipment.',
      color: '#4CAF50',
      delay: '0s',
    },
    {
      type: 'retailer',
      icon: '🏪',
      title: 'For Retailers',
      description: 'Grow your aquarium business with our B2B platform. Access wholesale prices and expand your reach.',
      color: '#FF9800',
      delay: '0.2s',
    },
    {
      type: 'wholesaler',
      icon: '📦',
      title: 'For Wholesalers',
      description: 'Connect with retailers nationwide. Manage bulk orders and streamline your distribution network.',
      color: '#2196F3',
      delay: '0.4s',
    },
  ];

  const features = [
    { icon: '⚡', title: 'Lightning Fast', text: 'Instant transactions with real-time updates' },
    { icon: '🌐', title: 'Pan-India Delivery', text: 'We deliver to every corner of the country' },
    { icon: '💰', title: 'Best Prices', text: 'Unbeatable wholesale and retail pricing' },
    { icon: '🔒', title: '100% Secure', text: 'Bank-grade encryption for all transactions' },
  ];

  return (
    <div className="homepage-container">
      {/* Animated background fish */}
      {fish.map((f) => (
        <div
          key={f.id}
          style={{
            position: 'absolute',
            left: `${f.left}%`,
            top: `${f.top}%`,
            fontSize: `${f.size}px`,
            opacity: 0.3,
            animation: `swim-across ${f.duration}s linear infinite`,
            animationDelay: `${f.delay}s`,
            zIndex: 1,
          }}
        >
          {f.emoji}
        </div>
      ))}

      {/* Floating bubbles */}
      {[...Array(30)].map((_, i) => (
        <div
          key={`bubble-${i}`}
          style={{
            position: 'absolute',
            bottom: '-50px',
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 30 + 10}px`,
            height: `${Math.random() * 30 + 10}px`,
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            animation: `bubbleRise ${Math.random() * 10 + 10}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
            zIndex: 1,
            border: '1px solid rgba(255,255,255,0.3)',
          }}
        />
      ))}

      {/* Waves */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: '150px',
          zIndex: 2,
        }}
      >
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{ width: '100%', height: '100%' }}
        >
          <path
            d="M0,50 Q300,80 600,50 T1200,50 L1200,120 L0,120 Z"
            fill="rgba(0,150,255,0.2)"
            style={{ animation: 'wave 8s ease-in-out infinite' }}
          />
          <path
            d="M0,70 Q300,40 600,70 T1200,70 L1200,120 L0,120 Z"
            fill="rgba(0,100,200,0.3)"
            style={{ animation: 'wave 6s ease-in-out infinite reverse' }}
          />
        </svg>
      </div>

      {/* Hero Section */}
      <div className="homepage-hero">
        <div className="homepage-logo">🐟 🐠 🐡</div>
        <h1 className="homepage-title">Aquarium Commerce</h1>
        <p className="homepage-subtitle">
          🌊 India's Premier B2B & B2C Aquatic Marketplace 🌊
        </p>
      </div>

      {/* Role Cards */}
      <div className="homepage-cards-container">
        {roles.map((role, index) => (
          <div
            key={role.type}
            className="homepage-card"
            style={{
              animationDelay: role.delay,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.3)';
            }}
          >
            {/* Card shine effect */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                animation: 'shine 3s ease-in-out infinite',
                animationDelay: `${index * 0.5}s`,
              }}
            />

            <div style={{ fontSize: '64px', marginBottom: '20px', display: 'inline-block', animation: 'bounce 2s ease-in-out infinite' }}>{role.icon}</div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0a4f70', marginBottom: '15px' }}>{role.title}</h2>
            <p style={{ fontSize: '16px', color: '#555', marginBottom: '25px', lineHeight: '1.6' }}>{role.description}</p>
            <button
              style={{
                backgroundColor: role.color,
                color: 'white',
                border: 'none',
                padding: '14px 30px',
                borderRadius: '30px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: `0 5px 20px ${role.color}60`,
                position: 'relative',
                overflow: 'hidden',
                width: '100%',
                maxWidth: '220px'
              }}
              onClick={() => handleRoleClick(role.type)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = `0 8px 25px ${role.color}80`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = `0 5px 20px ${role.color}60`;
              }}
            >
              <span style={{ position: 'relative', zIndex: 1 }}>
                Login as {role.title.split(' ')[1]}
              </span>
            </button>
          </div>
        ))}
      </div>

      {/* Features Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '60px auto 40px',
        padding: '0 20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '25px',
        position: 'relative',
        zIndex: 10,
      }}>
        {features.map((feature, index) => (
          <div
            key={index}
            style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '30px 20px',
              textAlign: 'center',
              border: '2px solid rgba(255,255,255,0.3)',
              transition: 'all 0.3s ease',
              animation: 'fadeIn 1s ease-out',
              animationDelay: `${index * 0.15}s`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '15px', display: 'inline-block', animation: 'iconGlow 3s ease-in-out infinite', animationDelay: `${index * 0.75}s` }}>{feature.icon}</div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', marginBottom: '10px' }}>{feature.title}</h3>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.95)', lineHeight: '1.5' }}>{feature.text}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        color: 'rgba(255,255,255,0.9)',
        padding: '40px 20px',
        fontSize: '14px',
        position: 'relative',
        zIndex: 10,
      }}>
        <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
          © 2024 Aquarium Commerce
        </p>
        <p style={{ fontSize: '14px', opacity: 0.9 }}>
          🇮🇳 Connecting the Aquatic Community Across India 🇮🇳
        </p>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes glow {
          from { text-shadow: 0 0 20px rgba(0,200,255,0.5), 2px 2px 4px rgba(0,0,0,0.3); }
          to { text-shadow: 0 0 40px rgba(0,200,255,0.9), 2px 2px 8px rgba(0,0,0,0.3); }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes cardSlideIn {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        @keyframes swim-across {
          0% {
            transform: translateX(-100px);
          }
          100% {
            transform: translateX(calc(100vw + 100px));
          }
        }

        @keyframes bubbleRise {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-100vh) scale(0.5);
            opacity: 0;
          }
        }

        @keyframes wave {
          0%, 100% {
            d: path("M0,50 Q300,80 600,50 T1200,50 L1200,120 L0,120 Z");
          }
          50% {
            d: path("M0,50 Q300,20 600,50 T1200,50 L1200,120 L0,120 Z");
          }
        }

        @keyframes shine {
          0% { left: -100%; }
          100% { left: 200%; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes iconGlow {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 0 0px rgba(255,255,255,0));
          }
          50% {
            transform: scale(1.2);
            filter: drop-shadow(0 0 20px rgba(255,255,255,0.8)) drop-shadow(0 0 30px rgba(0,200,255,0.6));
          }
        }
      `}</style>
    </div>
  );
}

export default HomePage;