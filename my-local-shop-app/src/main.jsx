import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { CustomerAuthProvider } from './context/CustomerAuthContext.jsx';
import { ShopAuthProvider } from './context/ShopAuthContext.jsx'; // 1. Import
import { CartProvider } from './context/CartContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CustomerAuthProvider>
        <ShopAuthProvider> {/* 2. Wrap the app */}
          <CartProvider>
            <App />
          </CartProvider>
        </ShopAuthProvider>
      </CustomerAuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);