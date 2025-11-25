import React from 'react';
import { HiOutlineLightningBolt, HiOutlineLockClosed, HiOutlineBadgeCheck } from 'react-icons/hi';

const features = [
  {
    icon: <HiOutlineLightningBolt className="w-10 h-10" />,
    title: 'Fast Delivery',
    description: 'Get your orders from local shops  from home.',
  },
  {
    icon: <HiOutlineLockClosed className="w-10 h-10" />,
    title: 'Secure Payments',
    description: 'Feature comming soon...',
  },
  {
    icon: <HiOutlineBadgeCheck className="w-10 h-10" />,
    title: 'Verified Shops',
    description: 'We partner with trusted, community-verified local businesses.',
  },
];

const WhyChooseUs = () => {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Why Choose Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => (
             <div key={index} className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-violet-100 text-violet-600 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;