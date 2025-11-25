import React from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import SubscriptionBanner from '../../../../components/SubscriptionBanner'; // 1. Import Banner
import { useShopAuth } from '../../../../context/ShopAuthContext.jsx';

const DashboardLayout = () => {
  const parentContext = useOutletContext();
  const shopCategory = parentContext ? parentContext.shopCategory : null;
  
  const { shopAuth, shopLogout } = useShopAuth();

  const shopName = shopAuth?.shop?.shopName || 'My Shop';
  const userName = shopAuth?.name || 'Shopkeeper';
  const shopId = shopAuth?.shop?._id; // Get Shop ID
  const expiryDate = shopAuth?.shop?.subscriptionExpiresAt; // Get Expiry Date

  const finalShopCategory = shopCategory || (shopAuth?.shop?.category) || '';

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar shopCategory={finalShopCategory} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          shopName={shopName} 
          userName={userName} 
          onLogout={shopLogout} 
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {/* 2. Add Banner Here */}
          <SubscriptionBanner 
            expiryDate={expiryDate} 
            shopName={shopName}
            shopId={shopId}
          />
          {/* ------------------ */}
          
          <Outlet context={{ shopCategory: finalShopCategory }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;