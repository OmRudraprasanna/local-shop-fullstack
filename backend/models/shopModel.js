import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  shopName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Grocery', 'Salon', 'Restaurant', 'Pharmacy', 'Bakery', 'Clothing'],
  },
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  openingTime: {
    type: String,
    required: true, 
    default: '09:00',
  },
  closingTime: {
    type: String,
    required: true,
    default: '21:00',
  },
  offersDelivery: {
    type: Boolean,
    required: true,
    default: false,
  },
  rating: {
    type: Number,
    required: false,
    default: 0,
  },
  bannerImage: {
    type: String,
    required: false,
    default: 'https://via.placeholder.com/800x300.png?text=Shop+Banner',
  },
  // --- NEW FIELD: Subscription Expiry ---
  subscriptionExpiresAt: {
    type: Date,
    required: true,
    // Default to 30 days from creation if not specified
    default: () => new Date(+new Date() + 30*24*60*60*1000), 
  }
  // --------------------------------------
}, {
  timestamps: true,
});

const Shop = mongoose.model('Shop', shopSchema);
export default Shop;