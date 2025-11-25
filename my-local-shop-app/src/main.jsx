import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

// Import Context Providers
import { CustomerAuthProvider } from './context/CustomerAuthContext.jsx';
import { ShopAuthProvider } from './context/ShopAuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';

// --- CONFIGURING API CONNECTION ---
// 1. Check for VITE_API_URL (Environment Variable)
// 2. Check for PROD mode (Hardcoded fallback)
// 3. Default to relative path (Proxy for localhost)

const apiUrl = import.meta.env.VITE_API_URL;

if (apiUrl) {
  axios.defaults.baseURL = apiUrl;
  console.log('Using API URL from Env:', apiUrl);
} else if (import.meta.env.PROD) {
  // Fallback for production if env var is missing
  // REPLACE THIS WITH YOUR EXACT RENDER URL
  axios.defaults.baseURL = 'https://local-shop-api.onrender.com'; 
  console.log('Using Hardcoded Production API URL:', axios.defaults.baseURL);
} else {
  // Development: Use Proxy
  console.log('Using Development Proxy');
}

// Ensure credentials (cookies) are sent with every request
axios.defaults.withCredentials = true; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CustomerAuthProvider>
        <ShopAuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </ShopAuthProvider>
      </CustomerAuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);