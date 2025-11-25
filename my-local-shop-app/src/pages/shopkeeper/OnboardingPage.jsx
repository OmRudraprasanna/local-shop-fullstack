import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// --- 1. THE FIX IS HERE ---
// HiPhotograph comes from 'hi' (v1)
import { HiPhotograph } from 'react-icons/hi';
// HiOutlineBuildingStorefront comes from 'hi2' (v2)
import { HiOutlineBuildingStorefront } from 'react-icons/hi2';
// --- END OF FIX ---

const OnboardingPage = () => {
  const navigate = useNavigate();

  // A single state object for all onboarding fields
  const [formData, setFormData] = useState({
    category: '', // This could be pre-filled from registration
    address: '',  // This too
    openingTime: '09:00',
    closingTime: '17:00',
    isOpen: 'true',
    acceptsOnlineOrders: true,
    offersDelivery: false,
    offersPickup: true,
    minOrderAmount: '0',
  });

  // A single handler for all inputs
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd save this data to the backend
    console.log('Onboarding data submitted:', formData);
    alert('Setup Complete! Redirecting to your dashboard.');
    
    // Redirect to the dashboard
    navigate('/shop/dashboard/home');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Simple Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
          <HiOutlineBuildingStorefront size={28} className="text-violet-600" />
          <span className="ml-3 text-2xl font-semibold text-gray-800">Complete Your Shop Setup</span>
        </div>
      </div>

      {/* Onboarding Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-8">
          
          {/* Section 1: Shop Profile */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">1. Shop Profile</h3>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Shop Category</label>
              <select id="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm">
                <option value="">Select a category</option>
                <option value="restaurant">Restaurant</option>
                <option value="bakery">Bakery</option>
                <option value="grocery">Grocery</option>
                <option value="salon">Salon</option>
                <option value="pharmacy">Pharmacy</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address (editable)</label>
              <textarea id="address" rows="3" value={formData.address} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Shop Photo (Placeholder)</label>
              {/* 2. This icon will now work correctly */}
              <div className="mt-1 aspect-[16/9] w-full bg-gray-100 rounded-md flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300">
                <HiPhotograph className="w-12 h-12" />
                <span className="mt-2 text-sm">Upload Shop Image</span>
              </div>
            </div>
          </div>

          {/* Section 2: Opening Details */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">2. Opening Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="openingTime" className="block text-sm font-medium text-gray-700">Opening Time</label>
                <input type="time" id="openingTime" value={formData.openingTime} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label htmlFor="closingTime" className="block text-sm font-medium text-gray-700">Closing Time</label>
                <input type="time" id="closingTime" value={formData.closingTime} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label htmlFor="isOpen" className="block text-sm font-medium text-gray-700">Current Status</label>
                <select id="isOpen" value={formData.isOpen} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm">
                  <option value="true">Open (Accepting Orders)</option>
                  <option value="false">Closed (Temporarily)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Service Options */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">3. Service Options</h3>
            <div className="flex items-center">
              <input type="checkbox" id="acceptsOnlineOrders" checked={formData.acceptsOnlineOrders} onChange={handleChange} className="h-4 w-4 text-violet-600 border-gray-300 rounded" />
              <label htmlFor="acceptsOnlineOrders" className="ml-3 block text-sm font-medium text-gray-700">Do you accept online orders?</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="offersDelivery" checked={formData.offersDelivery} onChange={handleChange} className="h-4 w-4 text-violet-600 border-gray-300 rounded" />
              <label htmlFor="offersDelivery" className="ml-3 block text-sm font-medium text-gray-700">Do you offer delivery?</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="offersPickup" checked={formData.offersPickup} onChange={handleChange} className="h-4 w-4 text-violet-600 border-gray-300 rounded" />
              <label htmlFor="offersPickup" className="ml-3 block text-sm font-medium text-gray-700">Do you offer pickup?</label>
            </div>
            <div>
              <label htmlFor="minOrderAmount" className="block text-sm font-medium text-gray-700">Minimum Order Amount ($)</label>
              <input type="number" id="minOrderAmount" value={formData.minOrderAmount} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="0" />
            </div>
          </div>

          {/* Section 4: Confirmation */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-lg font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
            >
              Complete Setup
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default OnboardingPage;