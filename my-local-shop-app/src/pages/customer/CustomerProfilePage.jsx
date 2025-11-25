import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCustomerAuth } from '../../context/CustomerAuthContext.jsx';
import { HiOutlineShoppingBag, HiXCircle } from 'react-icons/hi';

const CustomerProfilePage = () => {
  const { customerAuth } = useCustomerAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('/api/orders/myorders');
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError('Failed to load order history.');
      } finally {
        setLoading(false);
      }
    };

    if (customerAuth) {
      fetchOrders();
    }
  }, [customerAuth]);

  // --- NEW: Handle Cancel Order ---
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await axios.put(`/api/orders/${orderId}/cancel`);
      
      // Update UI locally to reflect change immediately
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId ? { ...order, status: 'Cancelled' } : order
        )
      );
      alert("Order cancelled successfully.");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel order");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed': return 'bg-blue-100 text-blue-800';
      case 'Preparing': return 'bg-indigo-100 text-indigo-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 flex items-center">
          <div className="h-16 w-16 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 text-2xl font-bold uppercase">
            {customerAuth?.name?.charAt(0) || 'U'}
          </div>
          <div className="ml-6">
            <h1 className="text-2xl font-bold text-gray-800">
              {customerAuth?.name || 'Customer'}
            </h1>
            <p className="text-gray-500">{customerAuth?.email}</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Order History</h2>

        {loading ? (
          <div className="text-center py-10">Loading orders...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow">
            <p className="text-gray-500">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <p className="text-sm text-gray-500">Order Placed</p>
                    <p className="font-medium text-gray-800">
                      {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-medium text-gray-800">₹{order.totalPrice.toFixed(2)}</p>
                  </div>
                  <div className="mt-2 sm:mt-0">
                     <p className="text-sm text-gray-500">Order #</p>
                     <p className="font-medium text-gray-800 text-xs uppercase">{order._id.substring(0, 10)}...</p>
                  </div>
                  
                  <div className="mt-2 sm:mt-0 flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>

                    {/* --- CANCEL BUTTON (Only if Pending) --- */}
                    {order.status === 'Pending' && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="flex items-center text-red-600 hover:text-red-800 text-sm font-medium transition"
                        title="Cancel Order"
                      >
                        <HiXCircle className="w-5 h-5 mr-1" />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-violet-700 mb-4 flex items-center">
                    <HiOutlineShoppingBag className="mr-2"/> 
                    {order.shop ? order.shop.shopName : 'Unknown Shop'}
                  </h3>
                  
                  <div className="space-y-3">
                    {order.orderItems.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <div className="flex items-center">
                           <span className="font-medium text-gray-800 mr-2">{item.qty}x</span>
                           <span className="text-gray-600">{item.name}</span>
                        </div>
                        <span className="font-medium text-gray-800">
                           {typeof item.price === 'number' ? `₹${item.price.toFixed(2)}` : item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerProfilePage;