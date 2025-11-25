import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HiOutlineArrowLeft } from 'react-icons/hi';

const AddServicePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    duration: '', // New field for services
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // We use the same API endpoint as products
      await axios.post('/api/products', formData);
      navigate('/shop/dashboard/services');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add service');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="mr-4 text-gray-600 hover:text-violet-600">
          <HiOutlineArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Add New Service</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Service Name */}
          <div>
            <label className="block text-gray-700 mb-2">Service Name</label>
            <input 
              type="text" name="name" required 
              placeholder="e.g., Men's Haircut"
              className="w-full p-2 border rounded focus:border-violet-500"
              value={formData.name} onChange={handleChange}
            />
          </div>

          {/* Price & Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Price (₹)</label>
              <input 
                type="text" name="price" required 
                placeholder="e.g., 150"
                className="w-full p-2 border rounded focus:border-violet-500"
                value={formData.price} onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Duration</label>
              <input 
                type="text" name="duration" required 
                placeholder="e.g., 30 mins"
                className="w-full p-2 border rounded focus:border-violet-500"
                value={formData.duration} onChange={handleChange}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea 
              name="description" rows="3" required 
              placeholder="Short details about the service..."
              className="w-full p-2 border rounded focus:border-violet-500"
              value={formData.description} onChange={handleChange}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-violet-600 text-white py-2 rounded hover:bg-violet-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Adding...' : 'Add Service'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddServicePage;