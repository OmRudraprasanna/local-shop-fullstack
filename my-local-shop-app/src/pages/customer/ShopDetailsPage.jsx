import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  HiOutlineArrowLeft, HiStar, HiOutlineClock, 
  HiPhone, HiOutlineLocationMarker // Imported phone icon
} from 'react-icons/hi';
import ProductCard from '../../components/ProductCard';
import CartButton from '../../components/CartButton';
import AuthRedirectModal from '../../components/AuthRedirectModal';

const ShopDetailsPage = () => {
  const { shopId } = useParams();
  
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const requireAuth = () => {
    setIsAuthModalOpen(true);
  };

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setLoading(true);
        const shopRes = await axios.get(`/api/shops/${shopId}`);
        setShop(shopRes.data);

        const productsRes = await axios.get(`/api/products/shop/${shopId}`);
        setProducts(productsRes.data);
        
      } catch (err) {
        console.error("Error fetching shop:", err);
        setError(err.response?.data?.message || 'Failed to load shop details.');
      } finally {
        setLoading(false);
      }
    };

    if (shopId) {
      fetchShopData();
    }
  }, [shopId]);

  if (loading) return <div className="text-center py-20 text-gray-500">Loading shop details...</div>;
  
  if (error || !shop) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold text-gray-800">Shop Not Found</h1>
        <p className="text-red-500 mt-2">{error}</p>
        <Link to="/shops" className="text-violet-600 mt-4 inline-block hover:underline">
          Back to all shops
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Shop Header */}
        <div className="relative h-48 md:h-64">
          <img 
            src={shop.bannerImage || 'https://via.placeholder.com/800x300.png?text=Shop+Banner'} 
            alt={`${shop.shopName} banner`}
            className="w-full h-full object-cover"
            onError={(e) => {e.target.src = 'https://via.placeholder.com/800x300.png?text=Shop+Banner'}}
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-6">
            <h1 className="text-4xl font-bold text-white">{shop.shopName}</h1>
          </div>
          <Link 
            to="/shops" 
            className="absolute top-4 left-4 flex items-center bg-white bg-opacity-90 rounded-full px-3 py-1 text-sm font-medium text-gray-800 hover:bg-white transition"
          >
            <HiOutlineArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Link>
        </div>

        {/* Shop Info */}
        <div className="bg-white shadow-md p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            
            <div className="space-y-2">
              {/* Address */}
              <div className="flex items-start text-gray-600">
                 <HiOutlineLocationMarker className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                 <span className="text-lg font-medium">{shop.address}, {shop.city}</span>
              </div>

              {/* Rating & Time */}
              <div className="flex items-center space-x-6 text-sm text-gray-500 ml-7">
                <div className="flex items-center">
                  <HiStar className="text-yellow-400 w-5 h-5 mr-1" />
                  <span className="font-bold text-gray-800">{shop.rating || 'New'}</span>
                </div>
                <div className="flex items-center">
                  <HiOutlineClock className="w-5 h-5 mr-1" />
                  <span>{shop.openingTime} – {shop.closingTime}</span>
                </div>
              </div>

              {/* --- NEW: PHONE NUMBER SECTION --- */}
              {shop.owner && shop.owner.phone && (
                <div className="flex items-center text-violet-700 ml-7 font-medium">
                  <HiPhone className="w-5 h-5 mr-2" />
                  <a href={`tel:${shop.owner.phone}`} className="hover:underline">
                    {shop.owner.phone}
                  </a>
                </div>
              )}
              {/* -------------------------------- */}

            </div>

            <span className="px-4 py-1 bg-violet-100 text-violet-800 rounded-full text-sm font-semibold">
              {shop.category}
            </span>
          </div>
        </div>

        {/* Products Grid */}
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {shop.category === 'Salon' ? 'Services' : 'Products'}
          </h2>
          
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  shop={{ id: shop._id, name: shop.shopName, category: shop.category }}
                  requireAuth={requireAuth} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center bg-white p-10 rounded-lg shadow">
              <p className="text-gray-500 text-lg">
                This shop hasn't added any {shop.category === 'Salon' ? 'services' : 'products'} yet.
              </p>
            </div>
          )}
        </div>
      </div>

      <CartButton />

      <AuthRedirectModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
};

export default ShopDetailsPage;