import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// Explicitly adding .jsx extension to avoid build errors
import { useCart } from '../../context/CartContext.jsx';
import { 
  HiOutlineArrowLeft, HiOutlineChevronDown, HiOutlineChevronUp, 
  HiOutlineCheckCircle 
} from 'react-icons/hi';

// --- ShopCartSection Component ---
const ShopCartSection = ({ shopId, shopName, items, shopCategory }) => {
  const [isOpen, setIsOpen] = useState(false); 
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { addToCart, removeFromCart, updateCartItemQuantity, placeOrder } = useCart(); 

  // Per-Shop Calculations
  const shopSubtotal = items.reduce((total, item) => {
    const price = parseFloat(item.price) || 0;
    return total + (price * item.quantity);
  }, 0);
  
  const shopTotal = shopSubtotal;

  const summaryTitle = shopCategory === 'Salon' ? 'Appointment Summary' : 'Order Summary';
  const confirmText = shopCategory === 'Salon' ? `Confirm Appointment` : `Confirm Order`;
  const cancelText = shopCategory === 'Salon' ? 'Cancel Appointment' : 'Cancel Order';

  const handleConfirmOrder = async () => {
    setIsLoading(true);
    setError(null);

    const orderData = {
      shopId,
      orderType: shopCategory === 'Salon' ? 'Service' : 'Retail',
      orderItems: items.map(item => ({
        product: item._id || item.id,
        name: item.name,
        qty: item.quantity,
        price: item.price,
      })),
      itemsPrice: shopSubtotal,
      taxPrice: 0,
      deliveryPrice: 0,
      totalPrice: shopTotal,
    };

    const result = await placeOrder(orderData);
    
    setIsLoading(false);

    if (result.success) {
      setIsConfirmed(true);
    } else {
      setError(result.message);
    }
  };

  const handleCancelOrder = () => {
    console.log(`Cancelling order for ${shopName}`);
    setIsCancelled(true);
    setIsConfirmed(false);
  };

  if (isConfirmed) {
     return (
       <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-l-4 border-green-500">
         <div className="flex items-center text-green-700 mb-2">
            <HiOutlineCheckCircle className="w-6 h-6 mr-2" />
            <h3 className="text-xl font-semibold">Order Confirmed!</h3>
         </div>
         <p className="text-gray-600">Your order for {shopName} has been placed successfully.</p>
       </div>
     )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 border-b bg-gray-50"
      >
        <h3 className="text-xl font-semibold text-gray-800">{shopName}</h3>
        <div className="flex items-center">
           <span className="text-gray-600 font-medium mr-4">₹{shopTotal.toFixed(2)}</span>
           {isOpen ? <HiOutlineChevronUp /> : <HiOutlineChevronDown />}
        </div>
      </button>

      {/* Accordion Body */}
      {isOpen && (
        <div className="p-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4 mb-6">
            {items.map(item => (
              <div key={item._id || item.id} className="flex items-center space-x-4">
                <img 
                  src={item.image || 'https://via.placeholder.com/150'} 
                  alt={item.name} 
                  className="w-16 h-16 rounded-md object-cover" 
                  onError={(e) => {e.target.src = 'https://via.placeholder.com/150'}}
                />
                <div className="flex-grow">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">₹{item.price}</p> 
                </div>
                {/* Quantity Stepper / Input for Checkout */}
                {/* Keeping it simple with buttons here, but ensuring correct ID usage */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => removeFromCart(item._id || item.id)}
                    className="w-7 h-7 bg-gray-200 text-gray-700 rounded-full font-bold"
                  >
                    -
                  </button>
                  {/* Display as float to show decimals */}
                  <span className="text-lg font-semibold w-10 text-center">{parseFloat(item.quantity)}</span>
                  <button
                    onClick={() => addToCart(item, { id: item.shopId, name: item.shopName, category: item.shopCategory })}
                    className="w-7 h-7 bg-violet-600 text-white rounded-full font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <h4 className="text-lg font-semibold mb-3">{summaryTitle}</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">₹{shopSubtotal.toFixed(2)}</span>
              </div>
              
              <div className="border-t pt-3 mt-3 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>₹{shopTotal.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mt-6">
              {isCancelled ? (
                <div className="p-3 rounded-md bg-red-100 text-red-700 font-medium text-center">
                  {cancelText}led
                </div>
              ) : (
                <div className="space-y-3">
                    <button
                    onClick={handleConfirmOrder}
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-md shadow-lg font-medium flex items-center justify-center bg-violet-600 text-white hover:bg-violet-700 disabled:bg-violet-300"
                    >
                    {isLoading ? 'Processing...' : confirmText}
                    </button>
                     <button
                        onClick={handleCancelOrder}
                        className="w-full py-2 px-4 rounded-md font-medium flex items-center justify-center bg-gray-200 text-gray-800 hover:bg-gray-300"
                    >
                        {cancelText}
                    </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CheckoutPage = () => {
  const { groupedCartItems, totalItemCount } = useCart();
  const shopGroups = Object.values(groupedCartItems);

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4"> 
        <div className="flex items-center mb-6">
          <Link 
            to="/shops" 
            className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <HiOutlineArrowLeft className="w-4 h-4 mr-2" />
            Back to Shopping
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>

        {totalItemCount === 0 ? (
          <div className="text-center bg-white p-12 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold">Your cart is empty.</h2>
            <p className="text-gray-500 mt-2">Go to a shop page to add items.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {shopGroups.map(group => (
              <ShopCartSection 
                key={group.shopId}
                shopId={group.shopId} 
                shopName={group.shopName}
                items={group.items}
                shopCategory={group.shopCategory} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;