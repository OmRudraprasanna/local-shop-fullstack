import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

// Import Routes
import userRoutes from './routes/userRoutes.js';
import shopRoutes from './routes/shopRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js'; // <-- 1. Import Order Routes

// Config
dotenv.config();
const app = express();
const PORT = 8000;

// --- Database Connection ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
connectDB();
// --- End Database Connection ---

// --- Middlewares ---
app.use(express.json()); // Allows JSON data in requests
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // Allows reading cookies (for auth)

// --- Use Routes ---
app.use('/api/users', userRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes); // <-- 2. Add Order Routes

// Original API endpoint (for testing)
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});