import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import Shop from '../models/shopModel.js';

const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, duration } = req.body;

  if (!name || !price || !description) {
    res.status(400);
    throw new Error('Please fill in all fields');
  }

  const shop = await Shop.findOne({ owner: req.user._id });

  if (!shop) {
    res.status(404);
    throw new Error('Shop not found for this user');
  }

  const product = await Product.create({
    shop: shop._id,
    name,
    price,
    description,
    image,
    duration,
  });

  res.status(201).json(product);
});

const getMyProducts = asyncHandler(async (req, res) => {
  const shop = await Shop.findOne({ owner: req.user._id });

  if (!shop) {
    res.status(404);
    throw new Error('Shop not found');
  }

  const products = await Product.find({ shop: shop._id }).sort({ createdAt: -1 });
  res.status(200).json(products);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const shop = await Shop.findOne({ owner: req.user._id });
  
  if (!shop || product.shop.toString() !== shop._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this product');
  }

  await product.deleteOne();
  res.status(200).json({ id: req.params.id });
});

// --- THIS IS THE CRITICAL FUNCTION FOR THE CUSTOMER PAGE ---
const getProductsByShopId = asyncHandler(async (req, res) => {
  const shopId = req.params.shopId;
  // Find all products that belong to this shop
  const products = await Product.find({ shop: shopId });

  // Even if empty, we return the array (it's not a 404 error, just empty shop)
  res.status(200).json(products);
});

// Ensure ALL 4 are exported
export { createProduct, getMyProducts, deleteProduct, getProductsByShopId };