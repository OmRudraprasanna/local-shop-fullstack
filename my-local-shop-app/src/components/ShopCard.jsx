import React from 'react';
import { Link } from 'react-router-dom';
import { HiStar, HiPhotograph } from 'react-icons/hi';

const ShopCard = ({ shop }) => {
  // Check if we have a valid ID
  const shopId = shop._id || shop.id; 

  return (
    <Link 
      // 1. Ensure it is "/shops/" (plural) to match App.jsx
      // 2. Ensure we use the correct ID
      to={`/shops/${shopId}`} 
      className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-xl block"
    >
      <div className="aspect-[16/9] w-full bg-gray-200 flex flex-col items-center justify-center text-gray-500">
        <HiPhotograph className="w-12 h-12" />
        <span className="mt-2 text-sm font-semibold">{shop.shopName}</span>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{shop.shopName}</h3>
        <p className="text-sm text-gray-500">{shop.category}</p>
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center">
            <HiStar className="text-yellow-400" />
            <span className="ml-1 text-gray-600 font-medium">{shop.rating || 'New'}</span>
          </div>
          <span className="text-sm text-gray-500">{shop.city}</span>
        </div>
      </div>
    </Link>
  );
};

export default ShopCard;