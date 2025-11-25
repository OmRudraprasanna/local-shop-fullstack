import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineShoppingCart } from 'react-icons/hi';
import { useCart } from '../context/CartContext';

const CartButton = () => {
  const { totalItemCount } = useCart();

  return (
    <Link
      to="/checkout" // This link now goes to our new cart page
      className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-violet-600 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-violet-700"
    >
      <HiOutlineShoppingCart className="w-8 h-8" />
      
      {/* Badge will now show '0' if cart is empty */}
      <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
        {totalItemCount}
      </span>
    </Link>
  );
};

export default CartButton;