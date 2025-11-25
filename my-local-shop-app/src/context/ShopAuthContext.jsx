import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ShopAuthContext = createContext();

export const ShopAuthProvider = ({ children }) => {
  const [shopAuth, setShopAuth] = useState(() => {
    try {
      const storedUser = localStorage.getItem('shopkeeperInfo');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse shop auth from localStorage", error);
      return null;
    }
  });

  useEffect(() => {
    if (shopAuth) {
      localStorage.setItem('shopkeeperInfo', JSON.stringify(shopAuth));
    } else {
      localStorage.removeItem('shopkeeperInfo');
    }
  }, [shopAuth]);

  // Shopkeeper Login
  const shopLogin = async (email, password) => {
    try {
      const { data } = await axios.post('/api/users/login', { email, password });
      
      if (data.userType !== 'shopkeeper') {
        throw new Error('This account is a Customer, not a Shopkeeper.');
      }

      setShopAuth(data);
      return { success: true };
    } catch (error) {
      // --- FIX: Check Status Code 403 ---
      // 403 means "Forbidden" - which we used specifically for Expiry
      if (error.response && error.response.status === 403) {
         return { success: false, isExpired: true };
      }
      // ----------------------------------

      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Login failed' 
      };
    }
  };

  const shopRegister = async (formData) => {
    try {
      const { data } = await axios.post('/api/shops/register', formData);
      setShopAuth(data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const updateShop = async (updateData) => {
    try {
      const { data } = await axios.put('/api/shops/profile', updateData);
      setShopAuth(data); 
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Update failed' };
    }
  };

  const shopLogout = async () => {
    try {
      await axios.post('/api/users/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    }
    setShopAuth(null);
  };

  return (
    <ShopAuthContext.Provider 
      value={{ shopAuth, shopLogin, shopRegister, updateShop, shopLogout }}
    >
      {children}
    </ShopAuthContext.Provider>
  );
};

export const useShopAuth = () => {
  return useContext(ShopAuthContext);
};