import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from './shared/Header';
import Sidebar from './shared/Sidebar';
import HomePage from './HomePage';
import CustomerLogin from './login/CustomerLogin';
import RetailerLogin from './login/RetailerLogin';
import WholesalerLogin from './login/WholesalerLogin';
import AdminLogin from './login/AdminLogin';
import CustomerSignup from './signup/CustomerSignup';
import RetailerSignup from './signup/RetailerSignup';
import WholesalerSignup from './signup/WholesalerSignup';
import AdminSignup from './signup/AdminSignup';

// Dashboard Components
import HomeDashboard from './dashboard/HomeDashboard';
import AboutDashboard from './dashboard/AboutDashboard';
import ContactDashboard from './dashboard/ContactDashboard';
import ProductsDashboard from './dashboard/ProductsDashboard';
import OrdersDashboard from './dashboard/OrdersDashboard';
import InventoryDashboard from './dashboard/InventoryDashboard';
import CustomersDashboard from './dashboard/CustomersDashboard';
import SuppliersDashboard from './dashboard/SuppliersDashboard';
import AnalyticsDashboard from './dashboard/AnalyticsDashboard';
import SettingsDashboard from './dashboard/SettingsDashboard';
import ProfileDashboard from './dashboard/ProfileDashboard';
import SupportDashboard from './dashboard/SupportDashboard';

const MainLayout = () => {
  const [currentModule, setCurrentModule] = useState('home');
  const [userRole, setUserRole] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  // Redirect authenticated users away from auth pages
  useEffect(() => {
    if (isAuthenticated && user && (location.pathname.startsWith('/login') || location.pathname.startsWith('/signup'))) {
      // Don't redirect if user needs approval and isn't approved yet
      // This allows the login page to show the "Pending Approval" modal/message
      if ((user.role === 'retailer' || user.role === 'wholesaler') && !user.isApproved) {
        return;
      }
      navigate(`/dashboard/${user.role}`);
    }
  }, [isAuthenticated, user, location.pathname, navigate]);

  // Handle navigation based on URL changes
  useEffect(() => {
    const path = location.pathname;

    if (path === '/') {
      setCurrentModule('home');
    } else if (path === '/secret-admin-login') {
      setUserRole('admin');
      setCurrentModule('login');
    } else if (path.startsWith('/login/')) {
      const role = path.split('/')[2];
      setUserRole(role);
      setCurrentModule('login');
    } else if (path.startsWith('/signup/')) {
      const role = path.split('/')[2];
      setUserRole(role);
      setCurrentModule('signup');
    }
  }, [location]);

  // Handle logout
  const handleLogout = () => {
    logout();
    setCurrentModule('home');
    setUserRole(null);
    navigate('/');
  };

  // Handle navigation requests from child components
  const handleNavigation = (module, role = null) => {
    setCurrentModule(module);
    if (role) {
      setUserRole(role);
    }

    // Update URL without reloading the page
    switch (module) {
      case 'home':
        navigate('/');
        break;
      case 'login':
        navigate(`/login/${role}`);
        break;
      case 'signup':
        navigate(`/signup/${role}`);
        break;
      case 'dashboard':
        // For dashboard, we redirect to the actual dashboard route
        switch (role) {
          case 'customer':
            navigate('/dashboard/customer');
            break;
          case 'retailer':
            navigate('/dashboard/retailer');
            break;
          case 'wholesaler':
            navigate('/dashboard/wholesaler');
            break;
          case 'admin':
            navigate('/dashboard/admin');
            break;
          default:
            navigate('/');
        }
        break;
      default:
        navigate('/');
    }
  };

  // Render the appropriate module based on currentModule state
  const renderModule = () => {
    // Check if we're rendering a dashboard
    if (activeSection !== 'home') {
      switch (activeSection) {
        case 'home':
          return <HomeDashboard />;
        case 'about':
          return <AboutDashboard />;
        case 'contact':
          return <ContactDashboard />;
        case 'products':
          return <ProductsDashboard />;
        case 'orders':
          return <OrdersDashboard />;
        case 'inventory':
          return <InventoryDashboard />;
        case 'customers':
          return <CustomersDashboard />;
        case 'suppliers':
          return <SuppliersDashboard />;
        case 'analytics':
          return <AnalyticsDashboard />;
        case 'settings':
          return <SettingsDashboard />;
        case 'profile':
          return <ProfileDashboard />;
        case 'support':
          return <SupportDashboard />;
        default:
          return <HomePage onNavigate={handleNavigation} />;
      }
    }

    // Otherwise render the standard modules
    switch (currentModule) {
      case 'home':
        return <HomePage onNavigate={handleNavigation} />;
      case 'login':
        switch (userRole) {
          case 'customer':
            return <CustomerLogin onNavigate={handleNavigation} />;
          case 'retailer':
            return <RetailerLogin onNavigate={handleNavigation} />;
          case 'wholesaler':
            return <WholesalerLogin onNavigate={handleNavigation} />;
          case 'admin':
            return <AdminLogin onNavigate={handleNavigation} />;
          default:
            return <HomePage onNavigate={handleNavigation} />;
        }
      case 'signup':
        switch (userRole) {
          case 'customer':
            return <CustomerSignup onNavigate={handleNavigation} />;
          case 'retailer':
            return <RetailerSignup onNavigate={handleNavigation} />;
          case 'wholesaler':
            return <WholesalerSignup onNavigate={handleNavigation} />;
          case 'admin':
            return <AdminSignup onNavigate={handleNavigation} />;
          default:
            return <HomePage onNavigate={handleNavigation} />;
        }
      default:
        return <HomePage onNavigate={handleNavigation} />;
    }
  };

  // Check if we should show sidebar and header (only for dashboards)
  const showLayout = activeSection !== 'home' && currentModule !== 'home' && currentModule !== 'login' && currentModule !== 'signup';

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: showLayout ? 'linear-gradient(135deg, #e0f7fa, #b2ebf2)' : 'transparent'
    }}>
      {/* Sidebar - Only show for dashboards */}
      {showLayout && (
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      )}

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        marginLeft: showLayout ? '250px' : '0',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Fixed Header - Only show for dashboards */}
        {showLayout && (
          <div style={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '10px 20px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <Header
              title="Aquarium Commerce"
              subtitle="🌊 Your Ultimate B2B & B2C Marketplace for All Things Aquatic! 🐠"
            />
          </div>
        )}

        <main style={{
          flex: 1,
          padding: showLayout ? '20px' : '0',
          marginTop: showLayout ? '20px' : '0'
        }}>
          {renderModule()}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;