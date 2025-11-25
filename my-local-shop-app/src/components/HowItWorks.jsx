import React from 'react';
import { HiOutlineShoppingCart, HiOutlineSearch } from 'react-icons/hi';
import { HiOutlineBuildingStorefront } from 'react-icons/hi2';

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <div className="flex items-center justify-center w-12 h-12 bg-violet-100 text-violet-600 rounded-full">
      {icon}
    </div>
    <h3 className="mt-4 text-xl font-bold text-gray-800">{title}</h3>
    <p className="mt-2 text-gray-600">{description}</p>
  </div>
);

const HowItWorks = () => {
  return (
    // --- 1. THIS IS THE ONLY CHANGE ---
    <section id="how-it-works" className="py-20">
    {/* --- END CHANGE --- */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<HiOutlineSearch size={28} />}
            title="1. Find Your Shop"
            description="Explore a wide range of local stores and services in your area, from bakeries to salons."
          />
          <FeatureCard
            icon={<HiOutlineShoppingCart size={28} />}
            title="2. Place Your Order"
            description="Add products to your cart from one or more shops. Checkout is simple and secure."
          />
          <FeatureCard
            icon={<HiOutlineBuildingStorefront size={28} />}
            title="3. Support Local"
            description="Get your items from your local shop near you , all while supporting businesses in your community."
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;