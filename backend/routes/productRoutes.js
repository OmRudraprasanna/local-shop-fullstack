import express from 'express';
const router = express.Router();
import { 
  createProduct, 
  getMyProducts, 
  deleteProduct,
  getProductsByShopId // <-- Ensure this is imported
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';

// Private Routes
router.post('/', protect, createProduct);
router.get('/my-products', protect, getMyProducts);
router.delete('/:id', protect, deleteProduct);

// Public Route (This is the one causing your error if missing)
router.get('/shop/:shopId', getProductsByShopId); 

export default router;