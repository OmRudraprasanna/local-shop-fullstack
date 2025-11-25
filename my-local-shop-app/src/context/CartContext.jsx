import React, { createContext, useContext, useState, useMemo } from 'react';
import axios from 'axios';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Helper to get a stable ID from an item (handles _id or id)
  // If neither exists, we can't reliably cart it, but we'll try to avoid crashing
  const getItemId = (item) => item._id || item.id;

  const addToCart = (product, shop) => {
    setCartItems(prevItems => {
      const productId = getItemId(product);
      if (!productId) return prevItems; // Safety check

      const existingItem = prevItems.find(item => getItemId(item) === productId);
      
      if (existingItem) {
        // Default add behavior: increment by 1
        return prevItems.map(item =>
          getItemId(item) === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Add new item with quantity 1
        return [...prevItems, { 
          ...product, 
          quantity: 1, 
          shopId: shop.id || shop._id, 
          shopName: shop.name,
          shopCategory: shop.category 
        }];
      }
    });
  };

  // --- UPDATED FUNCTION: Set exact quantity ---
  const updateCartItemQuantity = (productId, newQuantity) => {
    if (!productId) return;
    
    setCartItems(prevItems => {
      if (newQuantity <= 0) {
        // Remove item if quantity is 0 or less
        return prevItems.filter(item => getItemId(item) !== productId);
      }
      return prevItems.map(item =>
        getItemId(item) === productId ? { ...item, quantity: parseFloat(newQuantity) } : item
      );
    });
  };

  const removeFromCart = (productId) => {
    if (!productId) return;
    setCartItems(prevItems => {
      return prevItems.filter(item => getItemId(item) !== productId);
    });
  };

  // Use unique item count for badge
  const totalItemCount = cartItems.length;

  const getCartItem = (productId) => {
    if (!productId) return undefined;
    return cartItems.find(item => getItemId(item) === productId);
  };
  
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      let priceVal = item.price;
      // Handle price strings if necessary
      if (typeof item.price === 'string') {
         const numericPart = item.price.replace(/[^0-9.]/g, '');
         priceVal = parseFloat(numericPart);
      }
      
      if (isNaN(priceVal)) priceVal = 0;

      return total + (priceVal * item.quantity);
    }, 0);
  };

  const groupedCartItems = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const key = item.shopName || 'Other'; 
      if (!acc[key]) {
        acc[key] = {
          shopId: item.shopId,
          shopName: item.shopName,
          shopCategory: item.shopCategory,
          items: [],
        };
      }
      acc[key].items.push(item);
      return acc;
    }, {});
  }, [cartItems]);

  const placeOrder = async (orderData) => {
    try {
      const { data } = await axios.post('/api/orders', orderData);
      
      // Clear items from this specific shop
      setCartItems(prevItems => 
        prevItems.filter(item => item.shopId !== orderData.shopId)
      );
      
      return { success: true, order: data };
    } catch (error) {
      console.error("Order failed:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to place order' 
      };
    }
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity, 
    totalItemCount,
    getCartItem,
    getTotalPrice,
    groupedCartItems,
    placeOrder,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};