import React from 'react';

const CTA = () => {
  return (
    <div className="bg-gradient-to-r from-fuchsia-600 via-purple-600 to-orange-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Ready to Grow Your Business?
        </h2>
        <p className="mt-4 text-lg text-purple-100">
          Join our platform today and connect with thousands of customers in your area.
          It's free to get started.
        </p>
        <div className="mt-8 flex justify-center space-x-4">
           <a
              href="#"
              className="px-6 py-3 bg-white text-violet-600 font-semibold rounded-md shadow-lg hover:bg-gray-100 transition duration-300"
            >
              Register Shop
            </a>
            <a
              href="#"
              className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-md hover:bg-white hover:text-violet-600 transition duration-300"
            >
              Learn More
            </a>
        </div>
      </div>
    </div>
  );
};

export default CTA;