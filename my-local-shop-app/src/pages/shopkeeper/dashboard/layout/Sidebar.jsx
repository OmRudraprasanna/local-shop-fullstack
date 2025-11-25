import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  HiOutlineHome, 
  HiOutlineClipboardList, 
  HiOutlineArchive, 
  HiOutlineUser, 
  HiOutlineCog,
  HiOutlineCalendar,
  HiOutlineSparkles,
  HiOutlineDocumentReport // Ensure this icon is imported
} from 'react-icons/hi';

// This is the component for each link in the sidebar
const SidebarLink = ({ icon, text, to }) => (
  <NavLink
    to={to}
    // This makes the active link show a different style
    className={({ isActive }) =>
      `flex items-center px-4 py-3 text-gray-200 hover:bg-violet-700 ${
        isActive ? 'bg-violet-700 border-r-4 border-violet-300' : ''
      }`
    }
  >
    {icon}
    <span className="ml-3">{text}</span>
  </NavLink>
);

const Sidebar = ({ shopCategory }) => {
  // We convert the category to lowercase to avoid any case-sensitivity bugs.
  const category = shopCategory ? shopCategory.toLowerCase() : '';

  return (
    <div className="w-64 bg-violet-800 text-white flex-shrink-0 min-h-screen">
      <div className="p-5 text-center border-b border-violet-700">
        <h2 className="text-2xl font-bold">Local Shop</h2>
        <span className="text-sm text-violet-300">Shop Dashboard</span>
      </div>
      <nav>
        <SidebarLink icon={<HiOutlineHome />} text="Home" to="home" />

        {/* --- DYNAMIC LINKS --- */}
        {category === 'salon' ? (
          <>
            {/* --- SALON / SERVICE LINKS --- */}
            <SidebarLink icon={<HiOutlineCalendar />} text="Appointments" to="appointments" />
            <SidebarLink icon={<HiOutlineSparkles />} text="Services" to="services" />
          </>
        ) : (
          <>
            {/* --- RETAIL / PRODUCT LINKS --- */}
            <SidebarLink icon={<HiOutlineClipboardList />} text="Orders" to="orders" />
            <SidebarLink icon={<HiOutlineArchive />} text="Products" to="products" />
          </>
        )}
        
        {/* --- FIXED: RESTORED RECORDS LINK --- */}
        <SidebarLink icon={<HiOutlineDocumentReport />} text="Records" to="records" />
        {/* ------------------------------------ */}

        <div className="my-4 border-t border-violet-700"></div>

        <SidebarLink icon={<HiOutlineUser />} text="Profile" to="profile" />
        <SidebarLink icon={<HiOutlineCog />} text="Settings" to="settings" />
      </nav>
    </div>
  );
};

export default Sidebar;