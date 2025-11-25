import React from 'react';
import { HiSearch, HiOutlineShoppingCart } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-fuchsia-600 via-purple-600 to-orange-500 text-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="flex flex-col items-center text-center">
          
          {/* Logo */}
          <div className="mb-4">
            <HiOutlineShoppingCart size={64} className="text-white" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold mt-4">
            Local Shop
          </h1>
          <p className="mt-4 text-xl text-purple-100 max-w-xl">
            Your Local Commerce Revolution
          </p>
          <p className="mt-2 text-md text-purple-200 max-w-xl">
            Get your groceries, food, and essentials from local stores you trust, Connect with nearby shoppers, manage orders in real-time, and grow your business faster than ever.
          </p>

          {/* Search Bar */}
          <div className="mt-8 w-full max-w-lg">
            <form className="flex bg-white rounded-md shadow-lg overflow-hidden">
              <input
                type="text"
                placeholder="Search shops, products, or services..."
                className="flex-grow p-4 text-gray-700 outline-none"
              />
              <button
                type="submit"
                className="px-6 py-4 bg-violet-600 text-white hover:bg-violet-700"
              >
                <HiSearch size={24} />
              </button>
            </form>
          </div>
          
          {/* Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            
            {/* --- THIS IS THE FIX --- */}
            {/* Changed <a> tag to <Link> and href to to="/shop/register" */}
            <Link
              to="/shop/register"
              className="px-6 py-3 bg-white text-violet-600 font-semibold rounded-md shadow-lg hover:bg-gray-100 transition duration-300"
            >
              Register Shop
            </Link>
            
            <Link
              to="/shops"
              className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-md hover:bg-white hover:text-violet-600 transition duration-300"
            >
              Start Exploring..
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;