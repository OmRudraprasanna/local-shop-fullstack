import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import Shop from '../models/shopModel.js';

// @desc    Create new order
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems, itemsPrice, taxPrice, deliveryPrice, totalPrice,
    shopId, orderType, appointmentDate, appointmentTime
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      orderItems, customer: req.user._id, shop: shopId,
      itemsPrice, taxPrice, deliveryPrice, totalPrice,
      orderType, appointmentDate, appointmentTime
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// @desc    Get logged in shopkeeper's ACTIVE orders
// @route   GET /api/orders/my-shop-orders
// @access  Private (Shopkeeper)
const getMyShopOrders = asyncHandler(async (req, res) => {
  const shop = await Shop.findOne({ owner: req.user._id });

  if (!shop) {
    res.status(404);
    throw new Error('Shop not found for this user');
  }

  // Calculate 48 hours ago
  const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

  // Find orders that are either:
  // 1. NOT Completed/Cancelled (Active)
  // 2. OR Completed/Cancelled but updated within the last 48 hours
  const orders = await Order.find({
    shop: shop._id,
    $or: [
      { status: { $nin: ['Completed', 'Cancelled'] } },
      { 
        status: { $in: ['Completed', 'Cancelled'] },
        updatedAt: { $gte: twoDaysAgo } 
      }
    ]
  })
  .populate('customer', 'name email phone') 
  .sort({ createdAt: -1 }); 

  res.json(orders);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.status = req.body.status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('customer', 'name email phone');
  if (order) { res.json(order); } else { res.status(404); throw new Error('Order not found'); }
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ customer: req.user._id })
                            .populate('shop', 'shopName category') 
                            .sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Get dashboard stats
const getDashboardStats = asyncHandler(async (req, res) => {
  const shop = await Shop.findOne({ owner: req.user._id });
  if (!shop) { res.status(404); throw new Error('Shop not found'); }

  const now = new Date();
  const openingTime = shop.openingTime || '00:00'; 
  const [openHour, openMinute] = openingTime.split(':').map(Number);
  let lastResetTime = new Date();
  lastResetTime.setHours(openHour, openMinute, 0, 0);
  if (now < lastResetTime) { lastResetTime.setDate(lastResetTime.getDate() - 1); }

  const cycleOrders = await Order.find({
    shop: shop._id,
    createdAt: { $gte: lastResetTime }
  }).populate('customer', 'name');

  const totalOrders = cycleOrders.length;
  
  // Sum Revenue ONLY for 'Completed' orders
  const totalRevenue = cycleOrders.reduce((acc, order) => {
    if (order.status === 'Completed') { return acc + order.totalPrice; }
    return acc;
  }, 0);
  
  const pendingOrdersCount = cycleOrders.filter(o => o.status === 'Pending').length;
  const uniqueCustomers = new Set(cycleOrders.map(order => order.customer?._id.toString()));
  const newCustomersCount = uniqueCustomers.size;

  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const recentStartTime = oneHourAgo > lastResetTime ? oneHourAgo : lastResetTime;
  const recentOrders = await Order.find({
    shop: shop._id,
    createdAt: { $gte: recentStartTime }
  }).sort({ createdAt: -1 }).populate('customer', 'name email');

  res.json({ totalOrders, totalRevenue, newCustomersCount, pendingOrdersCount, recentOrders });
});

const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  if (order.customer.toString() !== req.user._id.toString()) { res.status(401); throw new Error('Not authorized'); }
  if (order.status !== 'Pending') { res.status(400); throw new Error('Cannot cancel processed order'); }
  order.status = 'Cancelled';
  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

// @desc    Get Shop Order History
const getShopOrderHistory = asyncHandler(async (req, res) => {
  const shop = await Shop.findOne({ owner: req.user._id });
  if (!shop) { res.status(404); throw new Error('Shop not found'); }

  const historyOrders = await Order.find({
    shop: shop._id,
    status: { $in: ['Completed', 'Cancelled'] }
  })
  .populate('customer', 'name email phone')
  .sort({ createdAt: -1 });

  res.json(historyOrders);
});

export { 
  addOrderItems, getMyShopOrders, updateOrderStatus, getOrderById, 
  getMyOrders, getDashboardStats, cancelOrder, getShopOrderHistory 
};