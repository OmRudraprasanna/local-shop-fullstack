import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useOutletContext } from 'react-router-dom';
import { HiOutlineShoppingCart, HiOutlineCurrencyDollar, HiOutlineUsers, HiOutlineCheckCircle } from 'react-icons/hi';

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <div className={`flex items-center justify-center w-12 h-12 rounded-full ${color}`}>
      {icon}
    </div>
    <p className="mt-4 text-sm font-medium text-gray-500">{title}</p>
    <p className="text-3xl font-bold text-gray-800">{value}</p>
  </div>
);

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending': return 'bg-yellow-100 text-yellow-800';
    case 'Accepted': return 'bg-blue-100 text-blue-800';
    case 'Confirmed': return 'bg-blue-100 text-blue-800';
    case 'Preparing': return 'bg-indigo-100 text-indigo-800';
    case 'Completed': return 'bg-green-100 text-green-800';
    case 'Cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const DashboardHome = () => {
  // 1. Safely get context
  const context = useOutletContext();
  const shopCategory = context ? context.shopCategory : '';
  
  const isSalon = shopCategory && shopCategory.toLowerCase() === 'salon';
  const detailsBasePath = isSalon ? '/shop/dashboard/appointments' : '/shop/dashboard/orders';
  const ordersLabel = isSalon ? "Today's Appointments" : "Today's Orders";

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    newCustomersCount: 0,
    pendingOrdersCount: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/orders/dashboard-stats');
        setStats(data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading dashboard...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Today's Dashboard</h1>
        <span className="text-lg font-semibold text-gray-600">{today}</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title={ordersLabel} 
          value={stats.totalOrders} 
          icon={<HiOutlineShoppingCart className="w-6 h-6 text-blue-600" />}
          color="bg-blue-100"
        />
        <StatCard 
          title="Today's Revenue" 
          value={`₹${stats.totalRevenue.toFixed(2)}`} 
          icon={<HiOutlineCurrencyDollar className="w-6 h-6 text-green-600" />}
          color="bg-green-100"
        />
        <StatCard 
          title="Today's Customers" 
          value={stats.newCustomersCount} 
          icon={<HiOutlineUsers className="w-6 h-6 text-yellow-600" />}
          color="bg-yellow-100"
        />
        <StatCard 
          title={isSalon ? "Pending Appts" : "Pending Orders"}
          value={stats.pendingOrdersCount} 
          icon={<HiOutlineCheckCircle className="w-6 h-6 text-violet-600" />}
          color="bg-violet-100"
        />
      </div>

      <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        {stats.recentOrders.length === 0 ? (
          <p className="text-gray-500">No activity yet today.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order._id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.customer?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      ₹{order.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        to={`${detailsBasePath}/${order._id}`} 
                        className="text-violet-600 hover:text-violet-900"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;