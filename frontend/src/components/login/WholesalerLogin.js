import React, { useState } from 'react';
// Removed useNavigate and Link since we'll handle navigation through props
import { useAuth } from '../../context/AuthContext';
import Modal from '../shared/Modal';
import './Login.css';

function WholesalerLogin({ onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });
  const { login } = useAuth();
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

        // Check if user is a wholesaler
        if (res.user.role !== 'wholesaler') {
          setModalContent({
            title: 'Access Denied',
            message: 'Wholesaler access required. Please use the correct login page for your role.'
          });
          setShowModal(true);
          return;
        }

        // Check approval status
        if (res.requiresApproval || res.approvalStatus === 'pending') {
          setModalContent({
            title: '⏳ Account Pending Approval',
            message: `Your wholesaler account is currently pending admin approval.\n\nStatus: ${res.approvalStatus}\n\nYou will receive a notification once your account has been reviewed and approved. Please check back later or contact support if you have questions.`
          });
          setShowModal(true);
          return;
        }

        if (res.approvalStatus === 'rejected') {
          setModalContent({
            title: '❌ Account Rejected',
            message: `Unfortunately, your account application has been rejected.\n\nReason: ${res.rejectionReason || 'Not specified'}\n\nPlease contact our support team for more information or to reapply.`
          });
          setShowModal(true);
          return;
        }

        // If approved, navigate to dashboard
        onNavigate && onNavigate('dashboard', 'wholesaler');

      } catch (err) {
        setModalContent({
          title: 'Login Failed',
          message: err.response?.data?.message || 'Unable to login. Please check your credentials and try again.'
        });
        setShowModal(true);
      }
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
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
            Wholesaler Login
          </h2>
          <p style={{ color: '#00a8cc', margin: 0 }}>
            Access your business dashboard
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
          Login to Dashboard
        </button>

        <div className="link" style={{ textAlign: 'center', marginTop: '25px' }}>
          <p style={{ color: '#0a4f70' }}>
            Don't have an account?{' '}
            <span
              onClick={() => onNavigate && onNavigate('signup', 'wholesaler')}
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
              ← Back to Home
            </span>
          </p>
        </div>
      </form>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalContent.title}
        showCancel={false}
        confirmText="OK"
      >
        <p style={{
          color: '#666',
          lineHeight: '1.6',
          whiteSpace: 'pre-line',
          margin: 0
        }}>
          {modalContent.message}
        </p>
      </Modal>
    </div>
  );
}

export default WholesalerLogin;