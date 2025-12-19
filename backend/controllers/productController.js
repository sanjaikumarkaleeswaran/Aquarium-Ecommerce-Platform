import Product from "../models/Product.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// @desc    Create a new product (Wholesaler only)
// @route   POST /api/products
// @access  Private/Wholesaler
export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    description,
    sku,
    wholesalePrice,
    suggestedRetailPrice,
    stock,
    minimumOrderQuantity,
    lowStockThreshold,
    images,
    specifications,
    tags,
    isFeatured
  } = req.body;

  // Create product
  const product = await Product.create({
    name,
    category,
    description,
    sku,
    wholesalePrice,
    suggestedRetailPrice,
    stock,
    minimumOrderQuantity: minimumOrderQuantity || 1,
    lowStockThreshold: lowStockThreshold || 10,
    wholesaler: req.user._id,
    wholesalerName: req.user.businessName || req.user.name,
    images: images || [],
    mainImage: images && images.length > 0 ? images[0] : null,
    specifications: specifications || {},
    tags: tags || [],
    searchKeywords: tags || [],
    isFeatured: isFeatured || false
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product
  });
});

// @desc    Get all products (with filters)
// @route   GET /api/products
// @access  Public
export const getAllProducts = asyncHandler(async (req, res) => {
  const {
    category,
    search,
    minPrice,
    maxPrice,
    wholesaler,
    inStock,
    featured,
    sort,
    page = 1,
    limit = 20
  } = req.query;

  const filter = { isActive: true };

  // Category filter
  if (category) filter.category = category;

  // Wholesaler filter
  if (wholesaler) filter.wholesaler = wholesaler;

  // Stock filter
  if (inStock === "true") filter.stock = { $gt: 0 };

  // Featured filter
  if (featured === "true") filter.isFeatured = true;

  // Price range filter
  if (minPrice || maxPrice) {
    filter.wholesalePrice = {};
    if (minPrice) filter.wholesalePrice.$gte = parseFloat(minPrice);
    if (maxPrice) filter.wholesalePrice.$lte = parseFloat(maxPrice);
  }

  // Search filter
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { tags: { $in: [new RegExp(search, "i")] } }
    ];
  }

  // Sorting
  let sortOption = { createdAt: -1 }; // Default: newest first
  if (sort === "price-asc") sortOption = { wholesalePrice: 1 };
  if (sort === "price-desc") sortOption = { wholesalePrice: -1 };
  if (sort === "name") sortOption = { name: 1 };
  if (sort === "popular") sortOption = { orderCount: -1 };

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const products = await Product.find(filter)
    .populate("wholesaler", "name businessName email phone warehouseLocation role")
    .sort(sortOption)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Product.countDocuments(filter);

  res.json({
    success: true,
    count: products.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    products
  });
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("wholesaler", "name businessName email phone warehouseLocation minimumOrderQuantity");

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found"
    });
  }

  // Increment view count
  await product.incrementViewCount();

  res.json({
    success: true,
    product
  });
});

// @desc    Update product (Wholesaler only - own products)
// @route   PUT /api/products/:id
// @access  Private/Wholesaler
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found"
    });
  }

  // Check ownership
  if (product.wholesaler.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "You don't have permission to update this product"
    });
  }

  // Update fields
  const {
    name,
    category,
    description,
    sku,
    wholesalePrice,
    suggestedRetailPrice,
    stock,
    minimumOrderQuantity,
    lowStockThreshold,
    images,
    specifications,
    tags,
    isFeatured,
    isActive
  } = req.body;

  if (name) product.name = name;
  if (category) product.category = category;
  if (description) product.description = description;
  if (sku) product.sku = sku;
  if (wholesalePrice !== undefined) product.wholesalePrice = wholesalePrice;
  if (suggestedRetailPrice !== undefined) product.suggestedRetailPrice = suggestedRetailPrice;
  if (stock !== undefined) product.stock = stock;
  if (minimumOrderQuantity !== undefined) product.minimumOrderQuantity = minimumOrderQuantity;
  if (lowStockThreshold !== undefined) product.lowStockThreshold = lowStockThreshold;
  if (images) product.images = images;
  if (specifications) product.specifications = specifications;
  if (tags) product.tags = tags;
  if (isFeatured !== undefined) product.isFeatured = isFeatured;
  if (isActive !== undefined) product.isActive = isActive;

  await product.save();

  res.json({
    success: true,
    message: "Product updated successfully",
    product
  });
});

// @desc    Delete product (Wholesaler only - own products)
// @route   DELETE /api/products/:id
// @access  Private/Wholesaler
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found"
    });
  }

  // Check ownership
  if (product.wholesaler.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "You don't have permission to delete this product"
    });
  }

  // Soft delete - just mark as inactive
  product.isActive = false;
  await product.save();

  res.json({
    success: true,
    message: "Product deleted successfully"
  });
});

// @desc    Get wholesaler's own products
// @route   GET /api/products/my-products
// @access  Private/Wholesaler
export const getMyProducts = asyncHandler(async (req, res) => {
  const { category, inStock, page = 1, limit = 20 } = req.query;

  // Only show active (non-deleted) products
  const filter = {
    wholesaler: req.user._id,
    isActive: true  // Exclude soft-deleted products
  };

  if (category) filter.category = category;
  if (inStock === "true") filter.stock = { $gt: 0 };

  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Optimize query by excluding large image arrays (use mainImage instead)
  const products = await Product.find(filter)
    .select('-images') // Exclude full images array to speed up query
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .lean(); // Use lean() for faster queries

  const total = await Product.countDocuments(filter);

  // Get statistics (only for active products)
  const stats = await Product.aggregate([
    { $match: { wholesaler: req.user._id, isActive: true } },
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        activeProducts: {
          $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] }
        },
        totalStock: { $sum: "$stock" },
        lowStockCount: {
          $sum: { $cond: [{ $lte: ["$stock", "$lowStockThreshold"] }, 1, 0] }
        },
        outOfStockCount: {
          $sum: { $cond: [{ $eq: ["$stock", 0] }, 1, 0] }
        }
      }
    }
  ]);

  res.json({
    success: true,
    count: products.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    products,
    stats: stats.length > 0 ? stats[0] : {}
  });
});

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
  const categories = [
    "Marine Fish",
    "Fresh Water Fish",
    "Tanks",
    "Aquarium Accessories",
    "Fish Food",
    "Medicines",
    "Water Treatment",
    "Decorative Items",
    "Plants",
    "Filters & Pumps"
  ];

  // Get product count per category
  const categoryCounts = await Product.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: "$category", count: { $sum: 1 } } }
  ]);

  const categoriesWithCounts = categories.map(cat => {
    const found = categoryCounts.find(c => c._id === cat);
    return {
      name: cat,
      count: found ? found.count : 0
    };
  });

  res.json({
    success: true,
    categories: categoriesWithCounts
  });
});

// @desc    Update product stock
// @route   PUT /api/products/:id/stock
// @access  Private/Wholesaler
export const updateStock = asyncHandler(async (req, res) => {
  const { stock } = req.body;

  if (stock === undefined || stock < 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid stock quantity"
    });
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found"
    });
  }

  // Check ownership
  if (product.wholesaler.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "You don't have permission to update this product"
    });
  }

  product.stock = stock;
  await product.save();

  res.json({
    success: true,
    message: "Stock updated successfully",
    product
  });
});

export default {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts,
  getCategories,
  updateStock
};