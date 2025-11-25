import React from 'react';
import { HiOutlineMenu, HiOutlineBell, HiOutlineUserCircle } from 'react-icons/hi';

const Topbar = ({ setIsSidebarOpen }) => {
  return (
    <header className="sticky top-0 z-10 bg-white shadow-md">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-500 hover:text-gray-700"
          onClick={() => setIsSidebarOpen(true)}
        >
          <HiOutlineMenu className="w-6 h-6" />
        </button>

        {/* Search (Placeholder) */}
        <div className="hidden md:block">
          <span className="text-xl font-semibold text-gray-700">Welcome, Shopkeeper!</span>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:text-gray-700">
            <HiOutlineBell className="w-6 h-6" />
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            <HiOutlineUserCircle className="w-8 h-8" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;