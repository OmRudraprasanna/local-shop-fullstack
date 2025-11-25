import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  // Determine if we are in production
  // You can set NODE_ENV=production in your Render environment variables
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('jwt', token, {
    httpOnly: true,
    // 'strict' works for localhost, but 'none' is required for cross-site (Vercel -> Render)
    sameSite: isProduction ? 'none' : 'strict', 
    secure: isProduction, // Must be true if sameSite is 'none'
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

export default generateToken;