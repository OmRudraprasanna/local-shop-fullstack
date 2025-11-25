import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HiOutlineArrowLeft } from 'react-icons/hi';

const AddProductPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    price: '', // Now accepts text
    description: '',
    image: '',
    // REMOVED: category
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await axios.post('/api/products', formData);
      navigate('/shop/dashboard/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product');
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
        <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-700 mb-2">Product Name</label>
            <input 
              type="text" name="name" required 
              placeholder="e.g., Fresh Tomatoes"
              className="w-full p-2 border rounded focus:border-violet-500"
              value={formData.name} onChange={handleChange}
            />
          </div>

          {/* Price (Text Input now) */}
          <div>
            <label className="block text-gray-700 mb-2">Price</label>
            <input 
              type="text" name="price" required 
              placeholder="e.g., 80/kg or 50 per dozen" 
              className="w-full p-2 border rounded focus:border-violet-500"
              value={formData.price} onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea 
              name="description" rows="3" required 
              placeholder="Short details about the item..."
              className="w-full p-2 border rounded focus:border-violet-500"
              value={formData.description} onChange={handleChange}
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-gray-700 mb-2">Image URL (Optional)</label>
            <input 
              type="text" name="image" placeholder="Paste image link here..."
              className="w-full p-2 border rounded focus:border-violet-500"
              value={formData.image} onChange={handleChange}
            />
            <p className="text-xs text-gray-500 mt-1">
              Tip: You can copy image links from Google Images.
            </p>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-violet-600 text-white py-2 rounded hover:bg-violet-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Adding...' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;