import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { HiPlus, HiTrash } from 'react-icons/hi';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products when page loads
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products/my-products');
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete Handler
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${id}`);
        // Refresh the list
        fetchProducts();
      } catch (error) {
        alert('Failed to delete product');
      }
    }
  };

  if (loading) return <div className="p-10 text-center">Loading products...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Products</h1>
        <Link 
          to="/shop/dashboard/products/add" 
          className="flex items-center bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700"
        >
          <HiPlus className="mr-2" /> Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white p-10 text-center rounded-lg shadow text-gray-500">
          No products yet. Click "Add Product" to start selling!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
              {/* Use a placeholder if image fails or is empty */}
              <img 
                src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'} 
                alt={product.name} 
                className="w-full h-40 object-cover"
                onError={(e) => {e.target.src = 'https://via.placeholder.com/300x200?text=Error'}}
              />
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                  <span className="bg-violet-100 text-violet-800 text-xs px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-1">{product.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold text-violet-600">₹{product.price}</span>
                  <button 
                    onClick={() => handleDelete(product._id)}
                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full"
                    title="Delete Product"
                  >
                    <HiTrash size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;