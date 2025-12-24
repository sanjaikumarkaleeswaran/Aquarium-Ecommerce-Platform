import React, { useState } from 'react';
// Removed useNavigate and Link since we'll handle navigation through props
import { signup } from '../../services/authService';
import './Login.css';

function RetailerSignup({ onNavigate }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  // Removed navigate since we'll use onNavigate prop

  // Name validation function - only alphabetic characters
  const validateName = (name) => {
    const re = /^[A-Za-z\s]+$/;
    return re.test(name) && name.trim().length >= 2;
  };

  // Email validation function - standard email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Simple Password validation function - just minimum length
  const validatePassword = (password) => {
    return password.length >= 1; // Just check if not empty
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Reset errors
    const newErrors = {};

    // Validate name
    if (!name) {
      newErrors.name = "Name is required";
    } else if (!validateName(name)) {
      newErrors.name = "Name should contain only letters and spaces, minimum 2 characters";
    }

    // Validate business name
    if (!businessName) {
      newErrors.businessName = "Business name is required";
    }

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
      newErrors.password = "Password cannot be empty";
    }

    setErrors(newErrors);

    // If no errors, proceed with signup
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        const response = await signup(name, email, password, "retailer", businessName);
        console.log("Signup response:", response);
        alert("Retailer signup successful! Please login.");
        // Use onNavigate to go to login
        onNavigate && onNavigate('login', 'retailer');
      } catch (err) {
        console.error("Signup error:", err);
        const errorMessage = err.response?.data?.message || err.message || "Signup failed. Please try again.";
        alert(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSignup}>
        <div className="text-center mb-4">
          <h2 className="login-title">
            Retailer Signup
          </h2>
          <p className="login-subtitle">
            Register your business with us
          </p>
        </div>

        <div className="mb-3">
          <label className="form-label">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={e => setName(e.target.value)}
            className={`form-input ${errors.name ? 'error' : ''}`}
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">
            Business Name
          </label>
          <input
            type="text"
            placeholder="Enter your business name"
            value={businessName}
            onChange={e => setBusinessName(e.target.value)}
            className={`form-input ${errors.businessName ? 'error' : ''}`}
          />
          {errors.businessName && <div className="error-message">{errors.businessName}</div>}
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
            placeholder="Create a password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={`form-input ${errors.password ? 'error' : ''}`}
          />
          {errors.password && <div className="error-message">{errors.password}</div>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="form-button"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <div className="link text-center mt-3">
          <p style={{ color: '#0a4f70' }}>
            Already have an account?{' '}
            <span
              onClick={() => onNavigate && onNavigate('login', 'retailer')}
              className="login-link-plain"
            >
              Login
            </span>
          </p>
          <p>
            <span
              onClick={() => onNavigate && onNavigate('home')}
              className="login-link-plain"
            >
              ← Back to Home
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}

export default RetailerSignup;