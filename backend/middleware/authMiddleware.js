import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check if the 'jwt' cookie exists
  token = req.cookies.jwt;

  if (token) {
    try {
      // 2. Verify the token using our secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Find the user in the DB (exclude the password)
      // This is where we create 'req.user'
      req.user = await User.findById(decoded.userId).select('-password');

      // 4. Let them pass to the Controller
      next();
      
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, invalid token');
    }
  } else {
    // If no token found in cookies
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

export { protect };