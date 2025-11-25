import React, { useState } from 'react';
import { HiMenu, HiX, HiOutlineShoppingCart, HiOutlineUserCircle } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { useCustomerAuth } from '../context/CustomerAuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { customerAuth, customerLogout } = useCustomerAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    customerLogout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <HiOutlineShoppingCart size={32} className="text-violet-600" />
            <span className="font-bold text-xl text-gray-800 ml-2">Local shop</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-violet-600">Home</Link>
            <Link to="/shops" className="text-gray-600 hover:text-violet-600">Shops</Link>
            <HashLink 
              smooth
              to="/#how-it-works" 
              className="text-gray-600 hover:text-violet-600"
            >
              How It Works
            </HashLink> 
          </div>
          
          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {customerAuth ? (
              // --- LOGGED IN (CUSTOMER) VIEW ---
              <>
                <Link to="/profile" className="flex items-center text-gray-600 hover:text-violet-600">
                  <HiOutlineUserCircle size={24} className="mr-1" />
                  Hi, {customerAuth.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-300 transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              // --- LOGGED OUT VIEW ---
              <>
                <Link to="/login" className="text-gray-600 hover:text-violet-600">
                  Login
                </Link>
                
                {/* --- THIS IS THE FIX --- */}
                <Link
                  to="/shop/register"
                  className="px-4 py-2 bg-violet-600 text-white rounded-md shadow-md text-sm font-medium hover:bg-violet-700 transition duration-300"
                >
                  Register Shop
                </Link>
                {/* --- END FIX --- */}

              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {/* ... (other mobile links) ... */}
          {customerAuth ? (
            <>
              {/* ... (logged in mobile links) ... */}
            </>
          ) : (
            <>
              <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Login</Link>
              
              {/* --- THIS IS THE FIX (MOBILE) --- */}
              <Link
                to="/shop/register"
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-violet-600 hover:bg-violet-700"
              >
                Register Shop
              </Link>
              {/* --- END FIX --- */}

            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;