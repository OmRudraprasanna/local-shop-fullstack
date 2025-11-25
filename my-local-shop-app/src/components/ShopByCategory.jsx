import React from 'react';
import { FaShoppingCart, FaBirthdayCake, FaCut, FaBriefcaseMedical, FaCarrot, FaCookie, FaCookieBite } from 'react-icons/fa';

const categories = [
  { name: 'Groceries', icon: <FaShoppingCart size={28} /> },
  { name: 'Bakery', icon: <FaBirthdayCake size={28} /> },
  { name: 'Tiffin', icon: <FaCookieBite size={28} /> },
  { name: 'Salon', icon: <FaCut size={28} /> },
  { name: 'Pharmacy', icon: <FaBriefcaseMedical size={28} /> },
];

const CategoryCard = ({ icon, name }) => (
  <a
    href="#"
    className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
  >
    <div className="text-violet-600">
      {icon}
    </div>
    <span className="mt-3 font-medium text-gray-700">{name}</span>
  </a>
);

const ShopByCategory = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 max-w-4xl mx-auto">
          {categories.map((category) => (
            <CategoryCard key={category.name} {...category} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopByCategory;