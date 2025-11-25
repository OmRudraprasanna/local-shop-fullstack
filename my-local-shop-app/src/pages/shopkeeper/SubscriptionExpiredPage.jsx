import React from 'react';
import { Link } from 'react-router-dom';
import { HiLockClosed } from 'react-icons/hi';

const SubscriptionExpiredPage = () => {
  // Replace with your actual number
  const adminPhone = '918260423660'; 
  const message = "Hello Admin, my shop subscription has expired. I want to renew it.";
  const whatsappLink = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl text-center">
        
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
          <HiLockClosed className="h-8 w-8 text-red-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">Subscription Expired</h2>
        <p className="text-gray-600 mb-8">
          Your shop's subscription plan has ended. To continue accessing your dashboard and managing orders, please renew your plan.
          or contact:8260423660
        </p>

        <div className="space-y-4">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-md font-medium shadow-md transition-colors"
          >
            Contact Admin via WhatsApp
          </a>
          
          <Link
            to="/shop/login"
            className="block w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium transition-colors"
          >
            Back to Login
          </Link>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          Once the admin renews your plan, you can log in again immediately.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionExpiredPage;