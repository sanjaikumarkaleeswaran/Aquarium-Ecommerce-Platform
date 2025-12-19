import React, { useState } from 'react';
// Removed useNavigate and Link since we'll handle navigation through props
import { signup } from '../../services/authService';
import './Login.css';

function CustomerSignup({ onNavigate }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        const response = await signup(name, email, password, "customer");
        console.log("Signup response:", response);
        alert("Customer signup successful! Please login.");
        // Use onNavigate to go to login
        onNavigate && onNavigate('login', 'customer');
      } catch(err) {
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
            Customer Signup
          </h2>
          <p style={{ color: '#00a8cc', margin: 0 }}>
            Join our community of aquarium enthusiasts
          </p>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: 'bold', 
            color: '#0a4f70' 
          }}>
            Full Name
          </label>
          <input 
            type="text" 
            placeholder="Enter your full name" 
            value={name} 
            onChange={e=>setName(e.target.value)} 
            className={errors.name ? 'error' : ''}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '8px',
              border: `2px solid ${errors.name ? '#ff6b6b' : '#b0d4e3'}`,
              fontSize: '1rem',
              boxSizing: 'border-box',
              transition: 'border-color 0.3s'
            }}
          />
          {errors.name && <div className="error-message" style={{ color: '#ff6b6b', marginTop: '8px' }}>{errors.name}</div>}
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
            onChange={e=>setEmail(e.target.value)} 
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
            placeholder="Create a password" 
            value={password} 
            onChange={e=>setPassword(e.target.value)} 
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
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: loading ? '#ccc' : '#00a8cc',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(0, 168, 204, 0.3)'
          }}
          onMouseOver={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = '#0a4f70';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(0, 168, 204, 0.4)';
            }
          }}
          onMouseOut={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = '#00a8cc';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(0, 168, 204, 0.3)';
            }
          }}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
        
        <div className="link" style={{ textAlign: 'center', marginTop: '25px' }}>
          <p style={{ color: '#0a4f70' }}>
            Already have an account?{' '}
            <span 
              onClick={() => onNavigate && onNavigate('login', 'customer')}
              style={{ 
                color: '#00a8cc', 
                textDecoration: 'none', 
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Login
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
              ← Back to Home
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}

export default CustomerSignup;