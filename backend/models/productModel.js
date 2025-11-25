import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Shop',
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: String, // Text allowed (e.g. "80/kg")
    required: true,
  },
  image: {
    type: String,
    required: false,
    default: 'https://via.placeholder.com/150',
  },
  // --- NEW FIELD FOR SALONS ---
  duration: {
    type: String, // e.g. "30 mins", "1 hour"
    required: false, 
  },
  // --- END NEW FIELD ---
  inStock: {
    type: Boolean,
    required: true,
    default: true,
  }
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);
export default Product;