import React from 'react';
import { HiExclamation } from 'react-icons/hi';

const SubscriptionBanner = ({ expiryDate, shopName, shopId }) => {
  if (!expiryDate) return null;

  const now = new Date();
  const expiry = new Date(expiryDate);
  
  // Calculate difference in days
  const diffTime = expiry - now;
  // Use Math.ceil to round up partial days (e.g. 0.5 days left = 1 day)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // --- DEBUG LOG ---
  console.log("------------------------------");
  console.log("SUBSCRIPTION CHECK:");
  console.log("Now:", now.toISOString());
  console.log("Expiry:", expiry.toISOString());
  console.log("Diff Days:", diffDays);
  console.log("Show Banner?:", diffDays <= 3 && diffDays >= 0);
  console.log("------------------------------");
  // ----------------

  // Logic: Show if expiring in 3 days or less, AND not already expired (negative days)
  // If diffDays < 0, they are locked out, so we don't need a warning banner (they see the lockout screen).
  if (diffDays > 3 || diffDays < 0) return null;

  // WhatsApp Message Link
  // Replace 'YOUR_PHONE_NUMBER' with your actual number (e.g., 919876543210)
  const adminPhone = '918260423660'; 
  const message = `Hello Admin, I want to renew my subscription for Shop: ${shopName} (ID: ${shopId}).`;
  const whatsappLink = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <HiExclamation className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <span className="font-bold">Attention:</span> Your subscription expires in {diffDays} day{diffDays !== 1 ? 's' : ''}.
            </p>
          </div>
        </div>
        <div>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-yellow-700 hover:text-yellow-600 underline"
          >
            Contact Admin to Renew
          </a>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionBanner;