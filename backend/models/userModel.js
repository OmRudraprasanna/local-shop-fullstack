import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
    enum: ['customer', 'shopkeeper'], 
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
  },
  // --- NEW FIELDS FOR PASSWORD RESET ---
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  // -------------------------------------
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);
export default User;