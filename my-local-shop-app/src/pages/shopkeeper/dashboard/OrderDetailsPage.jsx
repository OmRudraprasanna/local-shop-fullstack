import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  HiOutlineArrowLeft, HiOutlineCheckCircle, 
  HiOutlineClipboardList, HiOutlineTruck, HiOutlineCheck, HiXCircle 
} from 'react-icons/hi';
import { FaRegClock } from 'react-icons/fa';

const Toast = ({ message, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => onClose(), 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <div className={`fixed top-20 right-6 z-50 p-4 rounded-md shadow-lg transition-transform duration-300 ${show ? 'translate-x-0' : 'translate-x-full'} bg-green-500 text-white flex items-center`}>
      <HiOutlineCheckCircle className="w-6 h-6 mr-3" />
      <span>{message}</span>
    </div>
  );
};

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Accepted: 'bg-blue-100 text-blue-800',
  Preparing: 'bg-indigo-100 text-indigo-800',
  Completed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const StatusBadge = ({ status }) => (
  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${statusColors[status]}`}>
    {status}
  </span>
);

const StatusTimeline = ({ currentStatus }) => {
  const statuses = [
    { name: 'Pending', icon: <FaRegClock /> },
    { name: 'Accepted', icon: <HiOutlineClipboardList /> },
    { name: 'Preparing', icon: <HiOutlineTruck /> },
    { name: 'Completed', icon: <HiOutlineCheck /> },
  ];
  
  if (currentStatus === 'Cancelled') {
    return (
      <div className="mt-6 flex items-center justify-center text-red-600 font-bold p-4 bg-red-50 rounded-lg border border-red-200">
        <HiXCircle className="w-6 h-6 mr-2" />
        Order Cancelled
      </div>
    );
  }

  const currentIndex = statuses.findIndex(s => s.name === currentStatus);

  return (
    <div className="flex items-center justify-between mt-6">
      {statuses.map((status, index) => (
        <React.Fragment key={status.name}>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${index <= currentIndex ? 'bg-violet-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {status.icon}
            </div>
            <span className={`mt-2 text-xs font-medium ${index <= currentIndex ? 'text-violet-600' : 'text-gray-500'}`}>
              {status.name}
            </span>
          </div>
          {index < statuses.length - 1 && (
            <div className={`flex-1 h-1 ${index < currentIndex ? 'bg-violet-600' : 'bg-gray-200'}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Import useLocation

  const isReadOnly = new URLSearchParams(location.search).get('readonly') === 'true';
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedStatus, setSelectedStatus] = useState('');
  const [showToast, setShowToast] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/orders/${orderId}`);
      setOrder(data);
      setSelectedStatus(data.status);
    } catch (err) {
      console.error(err);
      setError('Failed to load order details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/orders/${orderId}/status`, { status: selectedStatus });
      setOrder(prev => ({ ...prev, status: selectedStatus }));
      setShowToast(true);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div>
      <Toast message="Status updated successfully" show={showToast} onClose={() => setShowToast(false)} />

      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4"
      >
        <HiOutlineArrowLeft className="w-4 h-4 mr-2" />
        {isReadOnly ? 'Back to History' : 'Back to Orders'}
      </button>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Order #{order._id.substring(0, 8)}...</h1>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 md:mt-0 text-sm text-gray-600">
            <span><strong>Customer:</strong> {order.customer?.name || 'Unknown'}</span>
            <span><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</span>
            <span><strong>Total:</strong> ₹{order.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Status</h2>
        
        {/* FIX: Check for Cancelled OR ReadOnly */}
        {order.status === 'Cancelled' ? (
           <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700 flex items-center">
             <HiXCircle className="w-6 h-6 mr-2" />
             <span className="font-medium">This order has been cancelled.</span>
           </div>
        ) : isReadOnly ? (
           // Read Only View
           <div className="p-4 bg-gray-50 border border-gray-200 rounded-md text-gray-700 flex items-center justify-between">
             <div className="flex items-center">
               <span className="font-medium mr-2">Final Status:</span>
               <StatusBadge status={order.status} />
             </div>
             <span className="text-sm text-gray-500 italic">Archived Record</span>
           </div>
        ) : (
          <form onSubmit={handleUpdateStatus} className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-500 mr-3">Current Status:</span>
              <StatusBadge status={order.status} />
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              <label htmlFor="statusUpdate" className="text-sm font-medium text-gray-500 mr-3">Change Status:</label>
              <select
                id="statusUpdate"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm"
              >
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Preparing">Preparing</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <button
                type="submit"
                className="ml-3 px-4 py-2 bg-violet-600 text-white rounded-md shadow-md hover:bg-violet-700"
              >
                Update Status
              </button>
            </div>
          </form>
        )}
        
        <div className="mt-6">
          <h3 className="text-md font-semibold text-gray-700">Order Progress</h3>
          <StatusTimeline currentStatus={order.status} />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Ordered Items</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.orderItems.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.qty}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">₹{item.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
                     ₹{item.price} x {item.qty}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Customer Details</h3>
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-gray-800">{order.customer?.name || 'Unknown'}</p>
            <p className="text-gray-600">{order.customer?.phone}</p>
            <p className="text-gray-600">{order.customer?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;