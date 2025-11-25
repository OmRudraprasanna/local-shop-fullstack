import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Shop',
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  orderType: {
    type: String,
    required: true,
    enum: ['Retail', 'Service'], 
  },
  orderItems: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      price: { type: String, required: true }, 
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
      },
    },
  ],
  itemsPrice: { type: Number, required: true, default: 0.0 },
  taxPrice: { type: Number, required: true, default: 0.0 },
  deliveryPrice: { type: Number, required: true, default: 0.0 },
  totalPrice: { type: Number, required: true, default: 0.0 },
  
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Confirmed', 'Preparing', 'Completed', 'Cancelled'],
    default: 'Pending',
  },

  appointmentDate: { type: String }, 
  appointmentTime: { type: String }, 
  
}, {
  timestamps: true,
});

// --- NEW: TTL Index for Auto-Deletion ---
// This tells MongoDB: "Look at 'createdAt'. If it is older than 31536000 seconds (1 year), delete it."
// 365 days * 24 hours * 60 minutes * 60 seconds = 31,536,000
orderSchema.index({ createdAt: 1 }, { expireAfterSeconds: 31536000 });

const Order = mongoose.model('Order', orderSchema);
export default Order;