import express from 'express';
const router = express.Router();
import { 
  registerCustomer, 
  loginUser, 
  logoutUser,
  forgotPassword, // Import
  resetPassword   // Import
} from '../controllers/userController.js';

router.post('/register', registerCustomer);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// --- NEW ROUTES ---
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);

export default router;