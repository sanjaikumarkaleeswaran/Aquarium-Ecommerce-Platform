import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, showHeader = true, showFooter = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine if we're on a dashboard page
  const isDashboardPage = location.pathname.includes('/dashboard/');
  
  // Determine title and subtitle based on current path
  const getPageInfo = () => {
    if (location.pathname === '/') {
      return { title: 'Aquarium Commerce', subtitle: '🌊 Your Ultimate B2B & B2C Marketplace for All Things Aquatic! 🐠' };
    } else if (location.pathname.includes('/login/')) {
      const role = location.pathname.split('/')[2];
      return { title: `${role.charAt(0).toUpperCase() + role.slice(1)} Login`, subtitle: `Access your ${role} account` };
    } else if (location.pathname.includes('/signup/')) {
      const role = location.pathname.split('/')[2];
      return { title: `${role.charAt(0).toUpperCase() + role.slice(1)} Signup`, subtitle: `Create your ${role} account` };
    }
    return null;
  };
  
  const pageInfo = getPageInfo();
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0f7fa, #b2ebf2)',
      overflowY: 'auto'
    }}>
      {showHeader && pageInfo && (
        <Header 
          title={pageInfo.title} 
          subtitle={pageInfo.subtitle}
          showBackButton={isDashboardPage}
          showLogout={isDashboardPage}
        />
      )}
      
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {children}
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;