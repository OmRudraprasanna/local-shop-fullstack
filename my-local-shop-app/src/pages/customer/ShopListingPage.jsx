import React, { useState, useEffect } from 'react';
import { HiSearch } from 'react-icons/hi';
import axios from 'axios'; // 1. Import Axios
import ShopCard from '../../components/ShopCard';
import CartButton from '../../components/CartButton';

const categories = ['All', 'Grocery', 'Restaurant', 'Salon', 'Pharmacy', 'Bakery', 'Clothing'];

// Expanded list of major Districts and Cities
const districts = [
  'All',
  'Agra', 'Ahmedabad', 'Ajmer', 'Aligarh', 'Allahabad', 'Amravati', 'Amritsar', 'Asansol', 'Aurangabad',
  'Bangalore', 'Bareilly', 'Belgaum', 'Bhavnagar', 'Bhilai', 'Bhiwandi', 'Bhopal', 'Bhubaneswar', 'Bikaner', 'Bilaspur', 'Bokaro',
  'Chandigarh', 'Chennai', 'Coimbatore', 'Cuttack',
  'Dehradun', 'Delhi', 'Dhanbad', 'Durgapur',
  'Erode', 'Faridabad', 'Firozabad',
  'Gandhinagar', 'Ghaziabad', 'Goa', 'Gorakhpur', 'Gulbarga', 'Guntur', 'Gurgaon', 'Guwahati', 'Gwalior',
  'Hubli-Dharwad', 'Hyderabad',
  'Indore',
  'Jabalpur', 'Jaipur', 'Jalandhar', 'Jammu', 'Jamnagar', 'Jamshedpur', 'Jhansi', 'Jodhpur',
  'Kakinada', 'Kannur', 'Kanpur', 'Kochi', 'Kolhapur', 'Kolkata', 'Kollam', 'Kota', 'Kozhikode', 'Kurnool','Keonjhar',
  'Lucknow', 'Ludhiana',
  'Madurai', 'Malappuram', 'Mangalore', 'Mathura', 'Meerut', 'Moradabad', 'Mumbai', 'Mysore',
  'Nagpur', 'Nanded', 'Nashik', 'Nellore', 'Noida',
  'Patna', 'Pondicherry', 'Pune', 'Puri',
  'Raipur', 'Rajahmundry', 'Rajkot', 'Ranchi', 'Rourkela',
  'Salem', 'Sangli', 'Shimla', 'Siliguri', 'Solapur', 'Srinagar', 'Surat','Sambalpur',
  'Thane', 'Thiruvananthapuram', 'Thrissur', 'Tiruchirappalli', 'Tirunelveli', 'Tiruppur',
  'Ujjain',
  'Vadodara', 'Varanasi', 'Vasai-Virar', 'Vellore', 'Vijayawada', 'Visakhapatnam',
  'Warangal'
];

const ShopListingPage = () => {
  // 2. State for real shops
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');

  // 3. Fetch shops from Backend
  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        // Fetching all shops to filter on frontend for smoother experience with small datasets
        const { data } = await axios.get('/api/shops');
        setShops(data);
      } catch (err) {
        setError('Failed to load shops. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []); 

  // 4. Filter logic (applied to real data)
  const filteredShops = shops.filter(shop => {
    const matchesCategory = activeCategory === 'All' || shop.category === activeCategory;
    // Case-insensitive comparison for city to handle "mumbai" vs "Mumbai"
    const matchesCity = selectedCity === 'All' || (shop.city && shop.city.toLowerCase() === selectedCity.toLowerCase());
    const matchesSearch = shop.shopName.toLowerCase().includes(searchTerm.toLowerCase()); 
    return matchesCategory && matchesCity && matchesSearch;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Find a Shop</h2>
          
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search for shops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 rounded-md border border-gray-300"
            />
            <HiSearch className="absolute top-1/2 left-3 -translate-y-1/2 w-6 h-6 text-gray-400" />
          </div>

          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            {/* Category Filter */}
            <div className="flex-1">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <select
                id="category"
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="mt-1 block w-full p-3 border border-gray-300 bg-white rounded-md shadow-sm"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* City / District Filter */}
            <div className="flex-1">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">City / District</label>
              <select
                id="city"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="mt-1 block w-full p-3 border border-gray-300 bg-white rounded-md shadow-sm"
              >
                {districts.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Shop Grid */}
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading shops...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredShops.map(shop => (
                <ShopCard key={shop._id} shop={shop} />
              ))}
            </div>
            {filteredShops.length === 0 && (
              <div className="text-center py-10 mt-10">
                 <p className="text-xl text-gray-500">No shops found.</p>
                 <p className="text-gray-400 text-sm mt-2">Try changing the city or category filter.</p>
              </div>
            )}
          </>
        )}
      </div>

      <CartButton />
    </div>
  );
};

export default ShopListingPage;