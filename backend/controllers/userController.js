import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';
import crypto from 'crypto'; // Native Node.js module for generating tokens

// @desc    Register a new customer
// @route   POST /api/users/register
// @access  Public
const registerCustomer = asyncHandler(async (req, res) => {
  // --- DEBUG LOGGING ---
  console.log("Register Request Received!");
  console.log("Body:", req.body); 
  // ---------------------

  const { name, email, password, phone } = req.body;

  if (!name || !email || !password || !phone) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    userType: 'customer',
  });

  if (user) {
    generateToken(res, user._id);
    
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      userType: user.userType,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Auth user & get token (Login)
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).populate('shop');

  if (user && (await bcrypt.compare(password, user.password))) {
    
    // Check for Subscription Expiry (Shopkeeper only)
    if (user.userType === 'shopkeeper' && user.shop) {
      const now = new Date();
      // Ensure we parse the date correctly
      const expiryDate = new Date(user.shop.subscriptionExpiresAt);

      if (now > expiryDate) {
        // EXPIRED! Deny login with specific error code 403 (Forbidden)
        res.status(403); 
        throw new Error('SUBSCRIPTION_EXPIRED'); 
      }
    }

    generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      userType: user.userType,
      shop: user.shop,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Logout user & clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'User logged out' });
});

// --- Forgot Password (Simulation) ---
// @desc    Forgot Password (Send Reset Link)
// @route   POST /api/users/forgotpassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // 1. Generate a random reset token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // 2. Hash it and save to DB (Security best practice)
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // 3. Set expiration (10 minutes)
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  await user.save();

  // 4. Create the reset URL
  // NOTE: This assumes your frontend runs on port 5173 locally.
  // In production, use process.env.FRONTEND_URL
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const path = user.userType === 'shopkeeper' ? 'shop/reset-password' : 'reset-password';
  const resetUrl = `${baseUrl}/${path}/${resetToken}`;

  // 5. SIMULATION: Log the link to the console instead of emailing
  console.log('------------------------------------');
  console.log('PASSWORD RESET LINK (Simulation):');
  console.log(resetUrl);
  console.log('------------------------------------');

  res.status(200).json({ success: true, data: 'Email sent (check server console)' });
});

// --- Reset Password ---
// @desc    Reset Password
// @route   PUT /api/users/resetpassword/:resetToken
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  // 1. Get the token from the URL and hash it (to match DB)
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  // 2. Find user with this token AND verify it hasn't expired
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid token');
  }

  // 3. Update Password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);

  // 4. Clear the reset fields
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({ success: true, data: 'Password updated successfully' });
});

// --- Get All Users (Admin) ---
// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

export { 
  registerCustomer, 
  loginUser, 
  logoutUser, 
  forgotPassword, 
  resetPassword,
  getUsers
};