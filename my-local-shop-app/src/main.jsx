import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { CustomerAuthProvider } from './context/CustomerAuthContext.jsx';
import { ShopAuthProvider } from './context/ShopAuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import axios from 'axios';

// --- THIS IS THE FIX ---
// In production (Vercel), use the Render URL.
// In development (localhost), leave it empty so the proxy works.
if (import.meta.env.PROD) {
  // HARDCODE YOUR RENDER URL HERE for simplicity
  axios.defaults.baseURL = 'https://local-shop-api.onrender.com'; 
}
// -----------------------

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