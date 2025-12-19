import React, { useState, useEffect } from 'react';

function RoleBasedAnimation() {
  const [userRole, setUserRole] = useState(null);

  // Get user role from sessionStorage
  useEffect(() => {
    const updateRole = () => {
      const user = sessionStorage.getItem('user');
      if (user) {
        try {
          const userData = JSON.parse(user);
          setUserRole(userData.role);
        } catch (e) {
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
    };

    updateRole();

    // Listen for storage changes
    const interval = setInterval(updateRole, 1000);
    return () => clearInterval(interval);
  }, []);

  // Customer: Tropical fish swimming
  const CustomerAnimation = () => (
    <>
      {[...Array(10)].map((_, i) => (
        <div
          key={`customer-${i}`}
          style={{
            position: 'fixed',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 20 + 25}px`,
            opacity: 0.15,
            animation: `float-fish ${Math.random() * 15 + 10}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        >
          {['🐠', '🐟', '🐡'][Math.floor(Math.random() * 3)]}
        </div>
      ))}
      {/* Bubbles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={`bubble-${i}`}
          style={{
            position: 'fixed',
            left: `${Math.random() * 100}%`,
            bottom: '-20px',
            width: `${Math.random() * 15 + 5}px`,
            height: `${Math.random() * 15 + 5}px`,
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            borderRadius: '50%',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            animation: `rise ${Math.random() * 8 + 8}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      ))}
    </>
  );

  // Retailer: Store boxes and shopping elements
  const RetailerAnimation = () => (
    <>
      {[...Array(8)].map((_, i) => (
        <div
          key={`retailer-${i}`}
          style={{
            position: 'fixed',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 25 + 30}px`,
            opacity: 0.1,
            animation: `spin-slow ${Math.random() * 20 + 15}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        >
          {['📦', '🏪', '🛒', '💰', '📊'][Math.floor(Math.random() * 5)]}
        </div>
      ))}
      {/* Floating coins */}
      {[...Array(12)].map((_, i) => (
        <div
          key={`coin-${i}`}
          style={{
            position: 'fixed',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: '20px',
            opacity: 0.15,
            animation: `bounce-coin ${Math.random() * 3 + 2}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        >
          💵
        </div>
      ))}
    </>
  );

  // Wholesaler: Shipping boxes, trucks
  const WholesalerAnimation = () => (
    <>
      {[...Array(6)].map((_, i) => (
        <div
          key={`wholesale-${i}`}
          style={{
            position: 'fixed',
            left: `${-50 + i * 200}%`,
            top: `${20 + Math.random() * 60}%`,
            fontSize: '40px',
            opacity: 0.12,
            animation: `move-truck ${Math.random() * 25 + 20}s linear infinite`,
            animationDelay: `${i * 3}s`,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        >
          🚚
        </div>
      ))}
      {/* Floating packages */}
      {[...Array(10)].map((_, i) => (
        <div
          key={`package-${i}`}
          style={{
            position: 'fixed',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 20 + 25}px`,
            opacity: 0.1,
            animation: `float-package ${Math.random() * 8 + 6}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 4}s`,
            zIndex: 0,
            pointerEvents: 'none',
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        >
          📦
        </div>
      ))}
      {/* Network nodes */}
      {[...Array(20)].map((_, i) => (
        <div
          key={`node-${i}`}
          style={{
            position: 'fixed',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            backgroundColor: 'rgba(33, 150, 243, 0.3)',
            borderRadius: '50%',
            animation: `pulse ${Math.random() * 3 + 2}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      ))}
    </>
  );

  // Admin: Stars, sparkles, premium effects
  const AdminAnimation = () => (
    <>
      {[...Array(30)].map((_, i) => (
        <div
          key={`star-${i}`}
          style={{
            position: 'fixed',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 15 + 10}px`,
            opacity: Math.random() * 0.3 + 0.1,
            animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        >
          ✨
        </div>
      ))}
      {/* Power symbols */}
      {[...Array(8)].map((_, i) => (
        <div
          key={`power-${i}`}
          style={{
            position: 'fixed',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: '35px',
            opacity: 0.08,
            animation: `glow-pulse ${Math.random() * 4 + 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        >
          {['👑', '⚡', '💎', '🔱'][Math.floor(Math.random() * 4)]}
        </div>
      ))}
      {/* Geometric shapes */}
      {[...Array(15)].map((_, i) => (
        <div
          key={`shape-${i}`}
          style={{
            position: 'fixed',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 30 + 20}px`,
            height: `${Math.random() * 30 + 20}px`,
            border: '2px solid rgba(156, 39, 176, 0.15)',
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
            animation: `rotate-shape ${Math.random() * 15 + 10}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      ))}
    </>
  );

  // Render based on role - ONLY for customer and retailer
  const renderAnimation = () => {
    switch (userRole) {
      case 'customer':
        return <CustomerAnimation />;
      case 'retailer':
        return <RetailerAnimation />;
      case 'wholesaler':
        return null; // No animation for wholesaler
      case 'admin':
        return null; // No animation for admin
      default:
        return null; // No animation for guests
    }
  };

  return (
    <>
      {renderAnimation()}

      {/* CSS Animations */}
      <style>{`
        @keyframes float-fish {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(30px, -30px) rotate(10deg);
          }
          50% {
            transform: translate(-20px, 20px) rotate(-5deg);
          }
          75% {
            transform: translate(40px, 10px) rotate(15deg);
          }
        }

        @keyframes rise {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-100vh) scale(0.5);
            opacity: 0;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes bounce-coin {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(180deg);
          }
        }

        @keyframes move-truck {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(100vw);
          }
        }

        @keyframes float-package {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-40px) rotate(180deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.6;
          }
        }

        @keyframes twinkle {
          0%, 100% {
            transform: scale(1);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.6;
          }
        }

        @keyframes glow-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.08;
            filter: drop-shadow(0 0 5px currentColor);
          }
          50% {
            transform: scale(1.2);
            opacity: 0.15;
            filter: drop-shadow(0 0 15px currentColor);
          }
        }

        @keyframes rotate-shape {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}

export default RoleBasedAnimation;
