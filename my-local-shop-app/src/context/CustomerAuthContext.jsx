import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context
const CustomerAuthContext = createContext();

// Create the provider
export const CustomerAuthProvider = ({ children }) => {
  // We get the initial state from localStorage, if it exists
  const [customerAuth, setCustomerAuth] = useState(() => {
    try {
      const storedUser = localStorage.getItem('customerInfo');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse auth from localStorage", error);
      return null;
    }
  });

  // Whenever the auth state changes, update localStorage
  useEffect(() => {
    if (customerAuth) {
      localStorage.setItem('customerInfo', JSON.stringify(customerAuth));
    } else {
      localStorage.removeItem('customerInfo');
    }
  }, [customerAuth]);


  // --- REAL API FUNCTIONS ---

  // Customer Login
  const customerLogin = async (email, password) => {
    try {
      // 1. Call the backend API
      const { data } = await axios.post(
        '/api/users/login', // The proxy will send this to http://localhost:8000/api/users/login
        { email, password }
      );

      // 2. Check if the user is a customer
      if (data.userType !== 'customer') {
        throw new Error('This account is a Shopkeeper, not a Customer.');
      }

      // 3. Set the state with the user data from the API
      setCustomerAuth(data);
      return { success: true };

    } catch (error) {
      // 4. Handle errors
      console.error('Login failed:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Login failed' 
      };
    }
  };

  // Customer Registration
  const customerRegister = async (name, email, password, phone) => {
    try {
      // 1. Call the backend API
      const { data } = await axios.post(
        '/api/users/register',
        { name, email, password, phone }
      );

      // 2. Set the state (backend logs them in automatically)
      setCustomerAuth(data);
      return { success: true };

    } catch (error) {
      // 3. Handle errors
      console.error('Registration failed:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  // Customer Logout
  const customerLogout = async () => {
    try {
      // 1. Call the backend logout to clear the cookie
      await axios.post('/api/users/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    }
    
    // 2. Clear the state and localStorage
    setCustomerAuth(null);
  };

  return (
    <CustomerAuthContext.Provider 
      value={{ 
        customerAuth, 
        customerLogin, 
        customerRegister, 
        customerLogout 
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};

// Create the custom hook
export const useCustomerAuth = () => {
  return useContext(CustomerAuthContext);
};