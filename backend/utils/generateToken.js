import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  // Create the token
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d', // It will expire in 30 days
  });

  // We will store the token in an HTTP-Only cookie
  // This is more secure than storing it in localStorage
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
    sameSite: 'strict', // Prevents CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  });
};

export default generateToken;