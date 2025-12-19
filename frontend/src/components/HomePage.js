import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #001f3f 0%, #003d7a 50%, #0074D9 100%)',
      padding: '0',
      margin: '-20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      position: 'relative',
      overflow: 'hidden',
    },
    hero: {
      textAlign: 'center',
      padding: '100px 20px 60px',
      position: 'relative',
      zIndex: 10,
    },
    logo: {
      fontSize: '64px',
      marginBottom: '20px',
      animation: 'float 3s ease-in-out infinite',
      display: 'inline-block',
    },
    title: {
      fontSize: '56px',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '16px',
      textShadow: '0 0 20px rgba(0,200,255,0.5), 2px 2px 4px rgba(0,0,0,0.3)',
      animation: 'glow 2s ease-in-out infinite alternate',
    },
    subtitle: {
      fontSize: '26px',
      color: 'rgba(255,255,255,0.95)',
      marginBottom: '40px',
      fontWeight: '300',
      animation: 'fadeInUp 1s ease-out',
    },
    cardsContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '40px',
      position: 'relative',
      zIndex: 10,
    },
    card: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '25px',
      padding: '50px 35px',
      boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      cursor: 'pointer',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
      animation: 'cardSlideIn 0.8s ease-out',
    },
    cardIcon: {
      fontSize: '72px',
      marginBottom: '25px',
      display: 'inline-block',
      animation: 'bounce 2s ease-in-out infinite',
    },
    cardTitle: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#0a4f70',
      marginBottom: '20px',
    },
    cardDescription: {
      fontSize: '17px',
      color: '#555',
      marginBottom: '30px',
      lineHeight: '1.7',
    },
    loginButton: {
      backgroundColor: '#2196F3',
      color: 'white',
      border: 'none',
      padding: '16px 40px',
      borderRadius: '30px',
      fontSize: '18px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 5px 20px rgba(33,150,243,0.4)',
      position: 'relative',
      overflow: 'hidden',
    },
    features: {
      maxWidth: '1200px',
      margin: '80px auto 60px',
      padding: '0 20px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '30px',
      position: 'relative',
      zIndex: 10,
    },
    featureCard: {
      background: 'rgba(255,255,255,0.15)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      padding: '35px 25px',
      textAlign: 'center',
      border: '2px solid rgba(255,255,255,0.3)',
      transition: 'all 0.3s ease',
      animation: 'fadeIn 1s ease-out',
    },
    featureIcon: {
      fontSize: '48px',
      marginBottom: '20px',
      display: 'inline-block',
      animation: 'iconGlow 3s ease-in-out infinite',
    },
    featureTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '12px',
    },
    featureText: {
      fontSize: '15px',
      color: 'rgba(255,255,255,0.95)',
      lineHeight: '1.6',
    },
    footer: {
      textAlign: 'center',
      color: 'rgba(255,255,255,0.9)',
      padding: '50px 20px',
      fontSize: '15px',
      position: 'relative',
      zIndex: 10,
    },
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
    <div style={styles.container}>
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
      <div style={styles.hero}>
        <div style={styles.logo}>🐟 🐠 🐡</div>
        <h1 style={styles.title}>Aquarium Commerce</h1>
        <p style={styles.subtitle}>
          🌊 India's Premier B2B & B2C Aquatic Marketplace 🌊
        </p>
      </div>

      {/* Role Cards */}
      <div style={styles.cardsContainer}>
        {roles.map((role, index) => (
          <div
            key={role.type}
            style={{
              ...styles.card,
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

            <div style={styles.cardIcon}>{role.icon}</div>
            <h2 style={styles.cardTitle}>{role.title}</h2>
            <p style={styles.cardDescription}>{role.description}</p>
            <button
              style={{
                ...styles.loginButton,
                backgroundColor: role.color,
                boxShadow: `0 5px 20px ${role.color}60`,
              }}
              onClick={() => handleRoleClick(role.type)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
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
      <div style={styles.features}>
        {features.map((feature, index) => (
          <div
            key={index}
            style={{
              ...styles.featureCard,
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
            <div style={{ ...styles.featureIcon, animationDelay: `${index * 0.75}s` }}>{feature.icon}</div>
            <h3 style={styles.featureTitle}>{feature.title}</h3>
            <p style={styles.featureText}>{feature.text}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={styles.footer}>
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