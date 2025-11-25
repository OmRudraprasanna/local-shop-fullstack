import express from 'express';
const router = express.Router();
import {
  addOrderItems,
  getMyShopOrders,
  updateOrderStatus,
  getOrderById,
  getMyOrders,
  getDashboardStats,
  cancelOrder,
  getShopOrderHistory // Imported
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/', protect, addOrderItems);
router.get('/my-shop-orders', protect, getMyShopOrders);
router.get('/myorders', protect, getMyOrders);
router.get('/dashboard-stats', protect, getDashboardStats);

// New History Route
router.get('/history', protect, getShopOrderHistory);

router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, updateOrderStatus);
router.put('/:id/cancel', protect, cancelOrder);

export default router;