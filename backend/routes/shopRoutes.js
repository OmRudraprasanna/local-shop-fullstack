import express from 'express';
const router = express.Router();
import { 
  registerShop, 
  getAllShops, 
  getShopById,
  updateShopProfile // 1. Import new function
} from '../controllers/shopController.js';
import { protect } from '../middleware/authMiddleware.js'; // 2. Import protect middleware

// Register a new shop
router.post('/register', registerShop);

// Public routes to get shop info
router.get('/', getAllShops);
router.get('/:id', getShopById);

// 3. New Protected Route for Updating Profile
router.put('/profile', protect, updateShopProfile);

export default router;