import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import AuthPage from './pages/customer/AuthPage'; // Customer Login/Register
import CustomerProfilePage from './pages/customer/CustomerProfilePage';
import ShopListingPage from './pages/customer/ShopListingPage';
import ShopDetailsPage from './pages/customer/ShopDetailsPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import ForgotPasswordPage from './pages/customer/ForgotPasswordPage';
import ResetPasswordPage from './pages/customer/ResetPasswordPage';

// Shopkeeper Pages
import RegisterPage from './pages/shopkeeper/RegisterPage'; // <-- IMPORT THIS for Shopkeeper Registration
import LoginPage from './pages/shopkeeper/LoginPage';       // <-- IMPORT THIS for Shopkeeper Login
import OnboardingPage from './pages/shopkeeper/OnboardingPage';
import ShopForgotPasswordPage from './pages/shopkeeper/ForgotPasswordPage';
import ShopResetPasswordPage from './pages/shopkeeper/ResetPasswordPage';
import SubscriptionExpiredPage from './pages/shopkeeper/SubscriptionExpiredPage';

// Dashboard Pages
import ProtectedRoute from './pages/shopkeeper/dashboard/layout/ProtectedRoute';
import DashboardLayout from './pages/shopkeeper/dashboard/layout/DashboardLayout';
import DashboardHome from './pages/shopkeeper/dashboard/DashboardHome';
import OrdersPage from './pages/shopkeeper/dashboard/OrdersPage';
import OrderDetailsPage from './pages/shopkeeper/dashboard/OrderDetailsPage';
import ProductsPage from './pages/shopkeeper/dashboard/ProductsPage';
import AddProductPage from './pages/shopkeeper/dashboard/AddProductPage';
import EditProductPage from './pages/shopkeeper/dashboard/EditProductPage';
import RecordsPage from './pages/shopkeeper/dashboard/RecordsPage';
import ProfilePage from './pages/shopkeeper/dashboard/ProfilePage';
import SettingsPage from './pages/shopkeeper/dashboard/SettingsPage';
import AppointmentsPage from './pages/shopkeeper/dashboard/AppointmentsPage';
import ServicesPage from './pages/shopkeeper/dashboard/ServicesPage';
import AddServicePage from './pages/shopkeeper/dashboard/AddServicePage';
import AppointmentDetailsPage from './pages/shopkeeper/dashboard/AppointmentDetailsPage';

const PublicLayout = ({ children }) => (
  <div className="font-sans">
    <Navbar />
    {children}
    <Footer />
  </div>
);

function App() {
  return (
    <Routes>
      {/* --- PRIORITY ROUTES --- */}
      <Route path="/shops/:shopId" element={<PublicLayout><ShopDetailsPage /></PublicLayout>} />
      <Route path="/shops" element={<PublicLayout><ShopListingPage /></PublicLayout>} />
      <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
      
      {/* --- Customer Auth Routes --- */}
      {/* AuthPage handles both Login and Register for customers */}
      <Route path="/login" element={<PublicLayout><AuthPage /></PublicLayout>} />
      <Route path="/forgot-password" element={<PublicLayout><ForgotPasswordPage /></PublicLayout>} />
      <Route path="/reset-password/:resetToken" element={<PublicLayout><ResetPasswordPage /></PublicLayout>} />
      
      <Route path="/profile" element={<PublicLayout><CustomerProfilePage /></PublicLayout>} />
      <Route path="/checkout" element={<PublicLayout><CheckoutPage /></PublicLayout>} />
      
      {/* --- Shopkeeper Auth Routes --- */}
      {/* These use the files in pages/shopkeeper/ */}
      <Route path="/shop/register" element={<PublicLayout><RegisterPage /></PublicLayout>} />
      <Route path="/shop/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
      <Route path="/shop/forgot-password" element={<PublicLayout><ShopForgotPasswordPage /></PublicLayout>} />
      <Route path="/shop/reset-password/:resetToken" element={<PublicLayout><ShopResetPasswordPage /></PublicLayout>} />
      
      {/* --- Shopkeeper Lockout Route --- */}
      <Route path="/shop/expired" element={<SubscriptionExpiredPage />} />

      {/* --- DASHBOARD ROUTES --- */}
      <Route element={<ProtectedRoute />}>
        <Route path="/shop/onboarding" element={<OnboardingPage />} />
        <Route path="/shop/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="home" replace />} /> 
          <Route path="home" element={<DashboardHome />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:orderId" element={<OrderDetailsPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/add" element={<AddProductPage />} />
          <Route path="products/edit/:productId" element={<EditProductPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="appointments/:appointmentId" element={<AppointmentDetailsPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="services/add" element={<AddServicePage />} />
          <Route path="records" element={<RecordsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* --- 404 Fallback --- */}
      <Route 
        path="*" 
        element={<PublicLayout><h1 className="text-center py-20 text-3xl font-bold text-red-500">404: Page Not Found</h1></PublicLayout>} 
      />
    </Routes>
  );
}

export default App;