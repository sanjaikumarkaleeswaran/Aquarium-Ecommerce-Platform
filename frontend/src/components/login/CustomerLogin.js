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
        <div className="text-center mb-4">
          <h2 className="login-title">
            Customer Login
          </h2>
          <p className="login-subtitle">
            Access your personalized aquarium dashboard
          </p>
          <p style={{ color: '#0a4f70', margin: 0, fontSize: '0.9rem' }}>
            <span
              onClick={() => onNavigate && onNavigate('home')}
              className="login-link"
            >
              or view our homepage
            </span>
          </p>
        </div>

        <div className="mb-3">
          <label className="form-label">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={`form-input ${errors.email ? 'error' : ''}`}
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>

        <div className="mb-4">
          <label className="form-label">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={`form-input ${errors.password ? 'error' : ''}`}
          />
          {errors.password && <div className="error-message">{errors.password}</div>}
        </div>

        <button
          type="submit"
          className="form-button"
        >
          LOGIN TO DASHBOARD
        </button>

        <div className="link text-center mt-3">
          <p style={{ color: '#0a4f70' }}>
            Don't have an account?{' '}
            <span
              onClick={() => onNavigate && onNavigate('signup', 'customer')}
              className="login-link-plain"
            >
              Sign Up
            </span>
          </p>
          <p>
            <span
              onClick={() => onNavigate && onNavigate('home')}
              className="login-link-plain"
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