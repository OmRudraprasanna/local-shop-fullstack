import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  HiOutlineArrowLeft, HiOutlineCheckCircle, HiXCircle,
  HiOutlineClipboardList, HiOutlineCheck 
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
  Confirmed: 'bg-blue-100 text-blue-800',
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
    { name: 'Confirmed', icon: <HiOutlineClipboardList /> },
    { name: 'Completed', icon: <HiOutlineCheck /> },
  ];
  
  if (currentStatus === 'Cancelled') {
    return (
      <div className="mt-6 flex items-center justify-center text-red-600 font-bold p-4 bg-red-50 rounded-lg border border-red-200">
        <HiXCircle className="w-6 h-6 mr-2" />
        Appointment Cancelled
      </div>
    );
  }

  const currentIndex = statuses.findIndex(s => s.name === currentStatus);

  return (
    <div className="flex items-center justify-between mt-6 max-w-md mx-auto">
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

const AppointmentDetailsPage = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const isReadOnly = new URLSearchParams(location.search).get('readonly') === 'true';
  
  const [appt, setAppt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedStatus, setSelectedStatus] = useState('');
  const [showToast, setShowToast] = useState(false);

  const fetchAppointment = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/orders/${appointmentId}`);
      setAppt(data);
      setSelectedStatus(data.status);
    } catch (err) {
      console.error(err);
      setError('Failed to load appointment details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, [appointmentId]);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/orders/${appointmentId}/status`, { status: selectedStatus });
      setAppt(prev => ({ ...prev, status: selectedStatus }));
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
        {isReadOnly ? 'Back to History' : 'Back to Appointments'}
      </button>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Appointment #{appt._id.substring(0, 8)}...</h1>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 md:mt-0 text-sm text-gray-600">
            <span><strong>Customer:</strong> {appt.customer?.name || 'Unknown'}</span>
            <span><strong>Date:</strong> {new Date(appt.createdAt).toLocaleDateString()}</span>
            <span><strong>Total:</strong> ₹{appt.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Appointment Status</h2>
        
        {/* FIX: Check if Cancelled OR ReadOnly */}
        {appt.status === 'Cancelled' ? (
           <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700 flex items-center">
             <HiXCircle className="w-6 h-6 mr-2" />
             <span className="font-medium">This appointment was cancelled.</span>
           </div>
        ) : isReadOnly ? (
           // Read Only View
           <div className="p-4 bg-gray-50 border border-gray-200 rounded-md text-gray-700 flex items-center justify-between">
             <div className="flex items-center">
               <span className="font-medium mr-2">Final Status:</span>
               <StatusBadge status={appt.status} />
             </div>
             <span className="text-sm text-gray-500 italic">Archived Record</span>
           </div>
        ) : (
          <form onSubmit={handleUpdateStatus} className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-500 mr-3">Current Status:</span>
              <StatusBadge status={appt.status} />
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
                <option value="Confirmed">Confirmed</option>
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
          <h3 className="text-md font-semibold text-gray-700">Appointment Progress</h3>
          <StatusTimeline currentStatus={appt.status} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Service Details</h3>
          <div className="space-y-3">
             {appt.orderItems.map((item, index) => (
                <div key={index} className="border-b last:border-0 pb-2 mb-2 last:pb-0 last:mb-0">
                    <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">Service</span>
                        <p className="text-lg font-semibold text-gray-800">{item.name}</p>
                    </div>
                    <div className="flex justify-between mt-1">
                        <span className="text-sm font-medium text-gray-500">Price</span>
                        <p className="text-lg font-semibold text-gray-800">₹{item.price}</p>
                    </div>
                </div>
             ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Customer Details</h3>
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-gray-800">{appt.customer?.name || 'Unknown'}</p>
            <p className="text-gray-600">{appt.customer?.phone || 'N/A'}</p>
            <p className="text-gray-600">{appt.customer?.email || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailsPage;