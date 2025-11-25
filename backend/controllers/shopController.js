import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Shop from '../models/shopModel.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new shop and shopkeeper
// @route   POST /api/shops/register
// @access  Public
const registerShop = asyncHandler(async (req, res) => {
  const { 
    name, email, password, phone, 
    shopName, category, city, address,
    openingTime, closingTime, offersDelivery 
  } = req.body;

  if (!name || !email || !password || !phone || !shopName || !category || !city || !address || !openingTime || !closingTime) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    userType: 'shopkeeper',
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid user data');
  }

  // Calculate 30 days from now
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30);

  const shop = await Shop.create({
    owner: user._id,
    shopName,
    category,
    city,
    address,
    openingTime,
    closingTime,
    offersDelivery: offersDelivery === 'true' || offersDelivery === true,
    subscriptionExpiresAt: expiryDate // Set Expiry
  });

  if (!shop) {
    res.status(400);
    throw new Error('Invalid shop data');
  }
  
  user.shop = shop._id;
  await user.save();
  
  generateToken(res, user._id);

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    userType: user.userType,
    shop: {
      _id: shop._id,
      shopName: shop.shopName,
      category: shop.category,
      city: shop.city,
      address: shop.address,
      openingTime: shop.openingTime,
      closingTime: shop.closingTime,
      offersDelivery: shop.offersDelivery,
      subscriptionExpiresAt: shop.subscriptionExpiresAt
    }
  });
});


// @desc    Get all shops
// @route   GET /api/shops
// @access  Public
const getAllShops = asyncHandler(async (req, res) => {
  const { city, category, search } = req.query;
  
  let query = {};

  if (city && city !== 'All') {
    query.city = city;
  }

  if (category && category !== 'All') {
    query.category = category;
  }

  if (search) {
    query.shopName = { $regex: search, $options: 'i' };
  }

  const shops = await Shop.find(query);
  res.status(200).json(shops);
});

// @desc    Get shop by ID
// @route   GET /api/shops/:id
// @access  Public
const getShopById = asyncHandler(async (req, res) => {
  // --- FIX: Populate 'owner' to get phone number ---
  const shop = await Shop.findById(req.params.id).populate('owner', 'name email phone');

  if (shop) {
    res.status(200).json(shop);
  } else {
    res.status(404);
    throw new Error('Shop not found');
  }
});

// @desc    Update shop and owner profile
// @route   PUT /api/shops/profile
// @access  Private (Shopkeeper)
const updateShopProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const shop = await Shop.findOne({ owner: req.user._id });

  if (user && shop) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    
    shop.shopName = req.body.shopName || shop.shopName;
    shop.category = req.body.category || shop.category;
    shop.city = req.body.city || shop.city;
    shop.address = req.body.address || shop.address;
    shop.openingTime = req.body.openingTime || shop.openingTime;
    shop.closingTime = req.body.closingTime || shop.closingTime;
    
    if (req.body.offersDelivery !== undefined) {
      shop.offersDelivery = req.body.offersDelivery;
    }

    const updatedUser = await user.save();
    const updatedShop = await shop.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      userType: updatedUser.userType,
      shop: {
        _id: updatedShop._id,
        shopName: updatedShop.shopName,
        category: updatedShop.category,
        city: updatedShop.city,
        address: updatedShop.address,
        openingTime: updatedShop.openingTime,
        closingTime: updatedShop.closingTime,
        offersDelivery: updatedShop.offersDelivery,
        subscriptionExpiresAt: updatedShop.subscriptionExpiresAt
      }
    });
  } else {
    res.status(404);
    throw new Error('Shop or User not found');
  }
});

export { registerShop, getAllShops, getShopById, updateShopProfile };