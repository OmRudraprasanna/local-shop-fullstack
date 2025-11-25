import React, { useState, useEffect } from 'react';
import { useShopAuth } from '../../../context/ShopAuthContext';
import { HiPencil, HiX, HiCheck } from 'react-icons/hi';

const ProfilePage = () => {
  const { shopAuth, updateShop } = useShopAuth();
  
  const user = shopAuth || {};
  const shop = shopAuth?.shop || {};

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    shopName: '',
    category: '',
    city: '',
    address: '',
    openingTime: '',
    closingTime: '',
    offersDelivery: false
  });

  useEffect(() => {
    if (shopAuth) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        shopName: shop.shopName || '',
        category: shop.category || '',
        city: shop.city || '',
        address: shop.address || '',
        openingTime: shop.openingTime || '',
        closingTime: shop.closingTime || '',
        offersDelivery: shop.offersDelivery || false,
      });
    }
  }, [shopAuth, isEditing]); 

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSave = async () => {
    setIsLoading(true);
    const result = await updateShop(formData);
    setIsLoading(false);
    if (result.success) {
      setIsEditing(false);
      alert("Profile updated successfully!");
    } else {
      alert("Failed to update profile: " + result.message);
    }
  };

  // --- HELPER FUNCTION: Convert 24h to 12h AM/PM ---
  const formatTime = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12; // the hour '0' should be '12'
    return `${h}:${minutes} ${ampm}`;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Shop Profile</h1>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 bg-violet-600 text-white rounded-md shadow hover:bg-violet-700"
          >
            <HiPencil className="mr-2" /> Edit Profile
          </button>
        ) : (
          <div className="flex space-x-3">
            <button 
              onClick={() => setIsEditing(false)}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md shadow hover:bg-gray-300"
              disabled={isLoading}
            >
              <HiX className="mr-2" /> Cancel
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700"
              disabled={isLoading}
            >
              <HiCheck className="mr-2" /> {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>
      
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto space-y-8">

        {/* --- 1. Shop Details Section --- */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">1. Shop Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shop Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Shop Name</label>
              {isEditing ? (
                <input type="text" name="shopName" value={formData.shopName} onChange={handleChange} className="mt-1 w-full p-3 border rounded-md" />
              ) : (
                <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-800">{shop.shopName}</div>
              )}
            </div>
            
            {/* Owner Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Owner Name</label>
              {isEditing ? (
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 w-full p-3 border rounded-md" />
              ) : (
                <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-800">{user.name}</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              {isEditing ? (
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 w-full p-3 border rounded-md" />
              ) : (
                <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-800">{user.phone}</div>
              )}
            </div>
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              {isEditing ? (
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 w-full p-3 border rounded-md" />
              ) : (
                <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-800">{user.email}</div>
              )}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            {isEditing ? (
               <input type="text" name="address" value={formData.address} onChange={handleChange} className="mt-1 w-full p-3 border rounded-md" />
            ) : (
              <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-800">{shop.address}, {shop.city}</div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              {isEditing ? (
                <select name="category" value={formData.category} onChange={handleChange} className="mt-1 w-full p-3 border rounded-md">
                   <option value="Grocery">Grocery</option>
                   <option value="Salon">Salon</option>
                   <option value="Restaurant">Restaurant</option>
                   <option value="Pharmacy">Pharmacy</option>
                   <option value="Bakery">Bakery</option>
                   <option value="Clothing">Clothing</option>
                </select>
              ) : (
                <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-800">{shop.category}</div>
              )}
            </div>
            
            {/* Opening Time (AM/PM applied here) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Opening Time</label>
              {isEditing ? (
                <input type="time" name="openingTime" value={formData.openingTime} onChange={handleChange} className="mt-1 w-full p-3 border rounded-md" />
              ) : (
                <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-800">
                  {formatTime(shop.openingTime)}
                </div>
              )}
            </div>
            
            {/* Closing Time (AM/PM applied here) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Closing Time</label>
              {isEditing ? (
                <input type="time" name="closingTime" value={formData.closingTime} onChange={handleChange} className="mt-1 w-full p-3 border rounded-md" />
              ) : (
                <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-800">
                  {formatTime(shop.closingTime)}
                </div>
              )}
            </div>
          </div>
          
          {/* Delivery Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Delivery Offered?</label>
            {isEditing ? (
              <div className="mt-2 flex items-center">
                 <input 
                  type="checkbox" 
                  name="offersDelivery" 
                  checked={formData.offersDelivery} 
                  onChange={handleChange} 
                  className="h-5 w-5 text-violet-600 border-gray-300 rounded" 
                />
                <span className="ml-2 text-gray-600">Yes, I offer delivery</span>
              </div>
            ) : (
              <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-800">
                {shop.offersDelivery ? "Yes" : "No"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;