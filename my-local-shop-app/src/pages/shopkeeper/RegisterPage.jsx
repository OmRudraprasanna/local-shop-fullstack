import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShopAuth } from '../../context/ShopAuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    shopName: '',
    category: '',
    city: '',
    address: '',
    // New Fields
    openingTime: '09:00',
    closingTime: '21:00',
    offersDelivery: false,
  });
  
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { shopRegister } = useShopAuth();

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await shopRegister(formData);
    
    setIsLoading(false);

    if (result.success) {
      navigate('/shop/dashboard/home');
    } else {
      setError(result.message);
    }
  };

  // Destructure for cleaner JSX
  const { 
    name, email, password, phone, 
    shopName, category, city, address, 
    openingTime, closingTime, offersDelivery 
  } = formData;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 bg-white p-10 rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Register your Shop
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {/* Owner Details */}
          <fieldset className="border p-4 rounded-md">
            <legend className="text-lg font-medium text-gray-700 px-2">Owner Details</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <input type="text" name="name" value={name} onChange={handleChange} placeholder="Full Name" required className="p-3 border border-gray-300 rounded-md" />
              <input type="email" name="email" value={email} onChange={handleChange} placeholder="Email Address" required className="p-3 border border-gray-300 rounded-md" />
              <input type="password" name="password" value={password} onChange={handleChange} placeholder="Password" required className="p-3 border border-gray-300 rounded-md" />
              <input type="tel" name="phone" value={phone} onChange={handleChange} placeholder="Phone Number" required className="p-3 border border-gray-300 rounded-md" />
            </div>
          </fieldset>
          
          {/* Shop Details */}
          <fieldset className="border p-4 rounded-md">
            <legend className="text-lg font-medium text-gray-700 px-2">Shop Details</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <input type="text" name="shopName" value={shopName} onChange={handleChange} placeholder="Shop Name" required className="p-3 border border-gray-300 rounded-md" />
              <select name="category" value={category} onChange={handleChange} required className="p-3 border border-gray-300 rounded-md text-gray-500">
                <option value="">Select Category</option>
                <option value="Grocery">Grocery</option>
                <option value="Salon">Salon</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Bakery">Bakery</option>
                <option value="Clothing">Clothing</option>
              </select>
              <input type="text" name="city" value={city} onChange={handleChange} placeholder="City" required className="p-3 border border-gray-300 rounded-md" />
              <input type="text" name="address" value={address} onChange={handleChange} placeholder="Full Address" required className="p-3 border border-gray-300 rounded-md" />
            </div>
            
            {/* NEW: Timing & Delivery */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Opening Time</label>
                <input type="time" name="openingTime" value={openingTime} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Closing Time</label>
                <input type="time" name="closingTime" value={closingTime} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-md" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <input 
                type="checkbox" 
                name="offersDelivery" 
                id="offersDelivery"
                checked={offersDelivery} 
                onChange={handleChange} 
                className="h-5 w-5 text-violet-600" 
              />
              <label htmlFor="offersDelivery" className="ml-2 text-gray-700">Do you offer Delivery?</label>
            </div>
          </fieldset>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300"
            >
              {isLoading ? 'Creating account...' : 'Create Account & Shop'}
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
          <p className="text-gray-600">
            Already have a shop account?{' '}
            <Link to="/shop/login" className="font-medium text-violet-600 hover:text-violet-500">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;