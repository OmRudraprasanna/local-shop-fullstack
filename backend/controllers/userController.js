import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';

// @desc    Register a new customer
// @route   POST /api/users/register
// @access  Public
const registerCustomer = asyncHandler(async (req, res) => {
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
      const expiryDate = new Date(user.shop.subscriptionExpiresAt);

      if (now > expiryDate) {
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

  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes expiration
  await user.save();

  // Generate URL
  // Use env var for production URL, fallback to localhost for dev
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const path = user.userType === 'shopkeeper' ? 'shop/reset-password' : 'reset-password';
  const resetUrl = `${baseUrl}/${path}/${resetToken}`;

  const message = `
    <h1>Password Reset Request</h1>
    <p>You requested a password reset for your Local Shop account.</p>
    <p>Please click the link below to reset your password:</p>
    <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
    <p>If you did not make this request, please ignore this email.</p>
  `;

  try {
    console.log(`Attempting to send email to: ${user.email}`);
    await sendEmail({
      to: user.email,
      subject: 'Local Shop - Password Reset',
      text: message,
    });

    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (error) {
    // Reset token if email fails
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    console.error("Forgot Password Controller Error:", error.message);
    res.status(500);
    throw new Error('Email could not be sent. Check server logs.');
  }
});

// @desc    Reset Password
// @route   PUT /api/users/resetpassword/:resetToken
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid token');
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({ success: true, data: 'Password updated successfully' });
});

// @desc    Get all users (Admin)
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