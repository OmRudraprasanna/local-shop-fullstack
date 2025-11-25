import React, { useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { HiPhotograph, HiOutlineArrowLeft } from 'react-icons/hi';

// --- MOCK DATA ---
// In a real app, you would use 'useEffect' and 'fetch' to get this 
// data from your backend using the 'productId' from the URL.
const mockProductDatabase = {
  1: { name: 'Fresh Loaf of Bread', price: 3.50, stock: 50, description: 'A warm, crusty loaf.' },
  2: { name: 'Chocolate Croissant', price: 2.25, stock: 30, description: 'Flaky and rich.' },
  3: { name: 'Bag of Groceries', price: 25.00, stock: 20, description: 'Assorted grocery items.' },
};
// --- END MOCK DATA ---

const EditProductPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams(); // Get the ID from the URL (e.g., "1", "2")

  // Find the product to edit from our mock database
  const productToEdit = mockProductDatabase[productId] || {
    name: '', price: '', stock: '', description: ''
  };

  // 1. Pre-fill the form state with the product's data
  const [formData, setFormData] = useState({
    name: productToEdit.name,
    price: productToEdit.price,
    stock: productToEdit.stock,
    description: productToEdit.description,
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, send this updated data to the backend
    console.log(`Updating Product #${productId}:`, formData);
    alert('Product updated successfully!');
    // Redirect back to the products list
    navigate('/shop/dashboard/products');
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <Link 
          to="/shop/dashboard/products" 
          className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4"
        >
          <HiOutlineArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">
          Edit Product {/* 2. Title changed */}
        </h1>
      </div>

      {/* Edit Product Form */}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto space-y-6">
        
        {/* Product Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Price and Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($)</label>
            <input
              type="number"
              id="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              id="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
          <textarea
            id="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          ></textarea>
        </div>

        {/* Image Upload Placeholder */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Image (Optional)</label>
          <div className="mt-1 aspect-[16/9] w-full bg-gray-100 rounded-md flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300">
            <HiPhotograph className="w-12 h-12" />
            <span className="mt-2 text-sm">Upload new image</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Link
            to="/shop/dashboard/products"
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md font-medium hover:bg-gray-300"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2 bg-violet-600 text-white rounded-md shadow-md font-medium hover:bg-violet-700"
          >
            Save Changes {/* 3. Button text changed */}
          </button>
        </div>

      </form>
    </div>
  );
};

export default EditProductPage;