import React from 'react';

const SettingsPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Account Settings</h1>
      
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto space-y-6">
        
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Change Password</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Password</label>
            {/* Fixed: changed class to className */}
            <input type="password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700">New Password</label>
             {/* Fixed: changed class to className */}
            <input type="password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
           <div>
             <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
             {/* Fixed: changed class to className */}
            <input type="password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
        </div>

        <div className="pt-6 border-t">
          <button className="w-full py-3 px-4 bg-violet-600 text-white rounded-md shadow-lg font-medium hover:bg-violet-700">
            Update Password
          </button>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;