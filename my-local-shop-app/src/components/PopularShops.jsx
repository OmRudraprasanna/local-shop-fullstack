import React from 'react';
import { HiStar, HiPhotograph } from 'react-icons/hi'; // Added a photo icon

// 1. No more image imports are needed.

// 2. The shop data no longer needs an 'img' property.
const shops = [
  { id: 1, name: 'Delicious Dishes', rating: 4.7, category: 'Restaurant' },
  { id: 2, name: 'The Cake House', rating: 4.9, category: 'Bakery' },
  { id: 3, name: 'Fresh Greens Market', rating: 4.5, category: 'Groceries' },
  { id: 4, name: 'Glamour Salon', rating: 4.8, category: 'Salon' },
];

const PopularShops = () => {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Popular Shops
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {shops.map((shop) => (
            <div key={shop.id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-shadow hover:shadow-xl">
              
              {/* 3. This is your new placeholder div */}
              <div className="aspect-[3/2] w-full bg-gray-200 flex flex-col items-center justify-center text-gray-500 p-4 text-center">
                <HiPhotograph className="w-12 h-12" />
                <span className="mt-2 text-sm font-semibold">Shop Image</span>
                <span className="text-xs font-medium">{shop.name}</span>
                <span className="text-xs">(ID: {shop.id})</span>
              </div>
              {/* End of placeholder section */}

              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800">{shop.name}</h3>
                <span className="text-sm text-gray-500">{shop.category}</span>
                <div className="flex items-center mt-2">
                  <HiStar className="text-yellow-400" />
                  <span className="ml-1 text-gray-600 font-medium">{shop.rating}</span>
                </div>
                <button className="mt-4 w-full px-4 py-2 bg-violet-600 text-white text-sm rounded-md hover:bg-violet-700 transition duration-300">
                  View Shop
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularShops;