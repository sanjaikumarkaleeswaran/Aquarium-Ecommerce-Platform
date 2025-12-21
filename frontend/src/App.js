import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import { ToastProvider } from './components/shared/ToastProvider';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ComparisonProvider } from './context/ComparisonContext';
import ProtectedRoute from './components/shared/ProtectedRoute';
import ComparisonBar from './components/shared/ComparisonBar';

// Import dashboard components
import CustomerDashboard from './components/dashboard/CustomerDashboard';
import ProfileDashboard from './components/dashboard/ProfileDashboard';
import RetailerDashboard from './components/dashboard/RetailerDashboard';
import WholesalerDashboard from './components/dashboard/WholesalerDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';

// Wholesaler components
import ProductManagement from './components/wholesaler/ProductManagement';

// Retailer components
import WholesalerProducts from './components/retailer/WholesalerProducts';
import RetailerProductManagement from './components/retailer/RetailerProductManagement';

// Customer components
import ProductCatalog from './components/customer/ProductCatalog';
import ProductDetail from './components/customer/ProductDetail';
import LocationsPage from './components/customer/LocationsPage';
import CartPage from './components/customer/CartPage';
import ComparisonPage from './components/customer/ComparisonPage';
import EditProfile from './components/customer/EditProfile';

// Shared components
import ProductTracking from './components/shared/ProductTracking';
import OrderHistory from './components/shared/OrderHistory';
import FishCursor from './components/shared/FishCursor';
import RoleBasedAnimation from './components/shared/RoleBasedAnimation';
import DrFishChatbot from './components/shared/DrFishChatbot';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ComparisonProvider>
          <ToastProvider>
            <CustomerDashboard />
          </ProtectedRoute>
                  }
                />
          <Route
            path="/dashboard/retailer"
            element={
              <ProtectedRoute allowedRoles={['retailer']}>
                <RetailerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/wholesaler"
            element={
              <ProtectedRoute allowedRoles={['wholesaler']}>
                <WholesalerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Wholesaler specific routes - Protected */}
          <Route
            path="/wholesaler/products"
            element={
              <ProtectedRoute allowedRoles={['wholesaler']}>
                <ProductManagement />
              </ProtectedRoute>
            }
          />

          {/* Retailer specific routes - Protected */}
          <Route
            path="/retailer/products"
            element={
              <ProtectedRoute allowedRoles={['retailer']}>
                <RetailerProductManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/retailer/wholesaler-products"
            element={
              <ProtectedRoute allowedRoles={['retailer']}>
                <WholesalerProducts />
              </ProtectedRoute>
            }
          />

          {/* Customer specific routes - Protected */}
          <Route
            path="/customer/products"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <ProductCatalog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/product/:productId"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <ProductDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/product/:productId/locations"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <LocationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/cart"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/profile"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <ProfileDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/profile/edit"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <EditProfile />
              </ProtectedRoute>
            }
          />

          {/* Retailer Profile Routes */}
          <Route
            path="/retailer/profile"
            element={
              <ProtectedRoute allowedRoles={['retailer']}>
                <ProfileDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/retailer/profile/edit"
            element={
              <ProtectedRoute allowedRoles={['retailer']}>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/compare"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <ComparisonPage />
              </ProtectedRoute>
            }
          />

          {/* Shared routes - May need protection or role check inside */}
          <Route path="/product/:productId/tracking" element={<ProductTracking />} />

          {/* Order History Routes - Protected */}
          <Route
            path="/customer/orders"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <OrderHistory role="customer" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/retailer/orders"
            element={
              <ProtectedRoute allowedRoles={['retailer']}>
                <OrderHistory role="retailer" />
              </ProtectedRoute>
            }
          />
        </Routes>
        <ComparisonBar />
        <DrFishChatbot />
      </Router>
    </ToastProvider>
        </ComparisonProvider >
      </AuthProvider >
    </ThemeProvider >
  );
}

export default App;