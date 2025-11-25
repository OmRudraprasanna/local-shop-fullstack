import React from 'react';
import { HiOutlineUserCircle, HiOutlineLogout } from 'react-icons/hi';

// This component receives props from DashboardLayout
const Header = ({ shopName, userName, onLogout }) => {
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Shop Name */}
          <div>
            <h1 className="text-xl font-semibold text-gray-800">{shopName}</h1>
          </div>
          
          {/* User Info & Logout */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <HiOutlineUserCircle className="h-6 w-6 text-gray-500" />
              <span className="text-gray-700 font-medium">{userName}</span>
            </div>
            
            <button
              onClick={onLogout}
              className="flex items-center text-gray-500 hover:text-red-600"
              title="Logout"
            >
              <HiOutlineLogout className="h-6 w-6" />
              <span className="sr-only">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;