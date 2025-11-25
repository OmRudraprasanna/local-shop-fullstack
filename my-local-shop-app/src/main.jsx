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

// --- CRITICAL FIX: Connect Frontend to Backend ---
// 1. Check if we are in production (deployed on Vercel)
if (import.meta.env.PROD) {
  // 2. HARDCODE YOUR RENDER URL HERE.
  // This tells Axios to send requests to your live server, not localhost.
  // Make sure this URL matches your Render dashboard exactly (no trailing slash).
  axios.defaults.baseURL = 'https://local-shop-api.onrender.com'; 
  
  console.log('Production Mode: API Base URL set to:', axios.defaults.baseURL);
} else {
  // 3. Development Mode (Localhost)
  // We don't set a baseURL here. 
  // Instead, we rely on the Proxy in vite.config.js to forward '/api' to localhost:8000
  console.log('Development Mode: Using Proxy');
}
// -------------------------------------------------

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Wrap App with all Auth & Data Providers */}
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