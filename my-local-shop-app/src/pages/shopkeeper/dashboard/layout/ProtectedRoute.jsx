import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useShopAuth } from '../../../../context/ShopAuthContext';

const ProtectedRoute = () => {
  // 1. Get the REAL shopkeeper auth state
  const { shopAuth } = useShopAuth();

  // 2. Check if they are logged in AND are a shopkeeper
  if (!shopAuth || shopAuth.userType !== 'shopkeeper') {
    // If not, send them to the shop login page
    return <Navigate to="/shop/login" replace />;
  }

  // 3. Get the REAL shop category from the logged-in user's data
  //    Our shopAuth object is { ..., shop: { ..., category: 'Salon' } }
  const shopCategory = shopAuth.shop.category;

  // 4. Pass the REAL category to the dashboard
  //    This is what makes the sidebar "smart"
  return <Outlet context={{ shopCategory }} />;
};

export default ProtectedRoute;