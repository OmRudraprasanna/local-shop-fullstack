import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';

const ProductCard = ({ product, shop, requireAuth }) => {
  const { addToCart, removeFromCart, updateCartItemQuantity, getCartItem } = useCart();
  const { customerAuth } = useCustomerAuth();
  
  // FIX: Use _id (MongoDB) or id (Mock). This MUST be unique.
  const productId = product._id || product.id;
  
  // Get the cart item for *this specific* product ID
  const cartItem = getCartItem(productId);

  // --- LOCAL STATE FOR INPUT ---
  // We initialize it with the cart quantity if it exists, or empty string
  const [inputValue, setInputValue] = useState(cartItem ? cartItem.quantity : '');

  // --- SYNC EFFECT ---
  // Only update local state if the *cart item's quantity* changes externally
  // (e.g. if we deleted it from the cart page, or added via button)
  useEffect(() => {
    if (cartItem) {
      setInputValue(cartItem.quantity);
    } else {
      setInputValue('');
    }
  }, [cartItem]);

  const handleAddToCart = () => {
    if (customerAuth) {
      addToCart(product, shop);
    } else {
      // Trigger the auth modal if the user is not logged in
      if (requireAuth) {
        requireAuth();
      }
    }
  };

  // 1. Handle Typing (Fast, Local Only)
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // 2. Handle "Blur" (User clicks away) -> Update Global Cart
  const handleBlur = () => {
    const val = parseFloat(inputValue);
    if (!isNaN(val) && val > 0) {
      // Only call update if the value actually changed to avoid unnecessary renders
      if (cartItem && cartItem.quantity !== val) {
        updateCartItemQuantity(productId, val);
      }
    } else {
      // If empty or invalid, reset to current valid cart value
      if (cartItem) setInputValue(cartItem.quantity);
    }
  };

  // 3. Handle "Enter" Key -> Update Global Cart
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur(); // Trigger the blur event
    }
  };

  // Helper to format price
  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `₹${price.toFixed(2)}`;
    }
    if (!isNaN(price) && !isNaN(parseFloat(price))) {
       return `₹${parseFloat(price).toFixed(2)}`;
    }
    // If it contains text like "80/kg", return as is
    return price.toString().startsWith('₹') ? price : `₹${price}`; 
  };

  // Safety check for image
  const imageSrc = product.image || 'https://via.placeholder.com/150';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      <img 
        src={imageSrc} 
        alt={product.name} 
        className="w-full h-32 object-cover"
        onError={(e) => {e.target.src = 'https://via.placeholder.com/150'}}
      />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-sm text-gray-500 truncate flex-grow mt-1">{product.description}</p>
        <div className="flex justify-between items-center mt-4">
          {/* USE THE HELPER FUNCTION HERE */}
          <span className="text-xl font-bold text-violet-600">
            {formatPrice(product.price)}
          </span>
          
          {cartItem ? (
            <div className="flex items-center space-x-1">
              {/* REMOVE BUTTON (X) */}
               <button
                onClick={() => removeFromCart(productId)} 
                className="w-6 h-6 bg-red-100 text-red-600 rounded-full font-bold text-xs flex items-center justify-center hover:bg-red-200"
                title="Remove item"
              >
                ✕
              </button>

              {/* INPUT FIELD */}
              <input
                type="number"
                step="0.1"
                min="0"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="w-14 p-1 border border-gray-300 rounded text-center text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
            </div>
          ) : (
            <button
              onClick={handleAddToCart} 
              className="px-4 py-2 bg-violet-100 text-violet-600 text-sm font-semibold rounded-md hover:bg-violet-200"
            >
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;