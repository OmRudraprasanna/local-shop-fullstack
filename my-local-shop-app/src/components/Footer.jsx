import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center">
          {/* Links ONLY, copyright is removed */}
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-gray-800">About Us</a>
            <a href="#" className="text-gray-500 hover:text-gray-800">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-gray-800">Terms</a>
            <a href="#" className="text-gray-500 hover:text-gray-800">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;