import React, { useState } from 'react';
// Removed useNavigate and Link since we'll handle navigation through props
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../shared/ToastProvider';
import './Login.css';

function CustomerLogin({ onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const toast = useToast();
  // Removed navigate since we'll use onNavigate prop

  // Email validation function - standard email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Simple password validation - just check if not empty
  const validatePassword = (password) => {
    return password.length > 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Reset errors
    const newErrors = {};

    // Validate email
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Validate password
    if (!password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(password)) {
      newErrors.password = "Please enter a password";
    }

    setErrors(newErrors);

    // If no errors, proceed with login
    if (Object.keys(newErrors).length === 0) {
      try {
        const res = await login(email, password);
        if (res.user.role === 'customer') {
          // Use onNavigate to go to dashboard
          onNavigate && onNavigate('dashboard', 'customer');
        } else {
          toast.error("Access denied. Customer access required.");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Login failed");
      }
    }
  };

  return (
    <div className="login-container" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Animated Background */}
      {/* Floating Fish */}
      {[...Array(8)].map((_, i) => (
        <div
          key={`fish-${i}`}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 30 + 20}px`,
            opacity: 0.15,
            animation: `swim ${Math.random() * 15 + 10}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        >
          {['🐠', '🐟', '🐡'][Math.floor(Math.random() * 3)]}
        </div>
      ))}

      {/* Rising Bubbles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={`bubble-${i}`}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            bottom: '-20px',
            width: `${Math.random() * 15 + 5}px`,
            height: `${Math.random() * 15 + 5}px`,
            backgroundColor: 'rgba(0, 168, 204, 0.2)',
            borderRadius: '50%',
            border: '1px solid rgba(0, 168, 204, 0.3)',
            animation: `rise ${Math.random() * 8 + 8}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      ))}

      <form className="login-form" onSubmit={handleLogin} style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{
            color: '#0a4f70',
            fontSize: '2.2rem',
            margin: '0 0 10px 0',
            background: 'linear-gradient(90deg, #00a8cc, #0a4f70)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Customer Login
          </h2>
          <p style={{ color: '#00a8cc', margin: '0 0 15px 0' }}>
            Access your personalized aquarium dashboard
          </p>
          <p style={{ color: '#0a4f70', margin: 0, fontSize: '0.9rem' }}>
            <span
              onClick={() => onNavigate && onNavigate('home')}
              style={{
                color: '#00a8cc',
                textDecoration: 'underline',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              or view our homepage
            </span>
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 'bold',
            color: '#0a4f70'
          }}>
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={errors.email ? 'error' : ''}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '8px',
              border: `2px solid ${errors.email ? '#ff6b6b' : '#b0d4e3'}`,
              fontSize: '1rem',
              boxSizing: 'border-box',
              transition: 'border-color 0.3s'
            }}
          />
          {errors.email && <div className="error-message" style={{ color: '#ff6b6b', marginTop: '8px' }}>{errors.email}</div>}
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 'bold',
            color: '#0a4f70'
          }}>
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={errors.password ? 'error' : ''}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '8px',
              border: `2px solid ${errors.password ? '#ff6b6b' : '#b0d4e3'}`,
              fontSize: '1rem',
              boxSizing: 'border-box',
              transition: 'border-color 0.3s'
            }}
          />
          {errors.password && <div className="error-message" style={{ color: '#ff6b6b', marginTop: '8px' }}>{errors.password}</div>}
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#00a8cc',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(0, 168, 204, 0.3)'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#0a4f70';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(0, 168, 204, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#00a8cc';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(0, 168, 204, 0.3)';
          }}
        >
          LOGIN TO DASHBOARD
        </button>

        <div className="link" style={{ textAlign: 'center', marginTop: '25px' }}>
          <p style={{ color: '#0a4f70' }}>
            Don't have an account?{' '}
            <span
              onClick={() => onNavigate && onNavigate('signup', 'customer')}
              style={{
                color: '#00a8cc',
                textDecoration: 'none',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Sign Up
            </span>
          </p>
          <p>
            <span
              onClick={() => onNavigate && onNavigate('home')}
              style={{
                color: '#00a8cc',
                textDecoration: 'none',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              ← View Homepage
            </span>
          </p>
        </div>
      </form>

      {/* Animation Styles */}
      <style>{`
        @keyframes swim {
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
      `}</style>
    </div>
  );
}

export default CustomerLogin;