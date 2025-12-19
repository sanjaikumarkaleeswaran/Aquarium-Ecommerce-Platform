import RetailerProduct from "../models/RetailerProduct.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Notification from "../models/Notification.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// @desc    Purchase product from wholesaler and add to retailer inventory
// @route   POST /api/retailer-products/purchase
// @access  Private/Retailer
export const purchaseFromWholesaler = asyncHandler(async (req, res) => {
    const { orderId } = req.body;

    if (!orderId) {
        return res.status(400).json({
            success: false,
            message: "Order ID is required"
        });
    }

    // Get the order
    const order = await Order.findById(orderId)
        .populate("items.product");

    if (!order) {
        return res.status(404).json({
            success: false,
            message: "Order not found"
        });
    }

    // Verify order belongs to this retailer
    if (order.buyer.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            success: false,
            message: "Unauthorized access to this order"
        });
    }

    // Verify order is delivered
    if (order.status !== "delivered") {
        return res.status(400).json({
            success: false,
            message: "Can only add products from delivered orders to inventory"
        });
    }

    // Check if already added
    if (order.isInventoryAdded) {
        return res.status(400).json({
            success: false,
            message: "Products from this order have already been added to inventory"
        });
    }

    const retailerProducts = [];

    // Process each item in the order
    for (const item of order.items) {
        if (item.productModel === "Product") {
            const originalProduct = await Product.findById(item.product);

            if (!originalProduct) continue;

            // Check if retailer already has this product
            let retailerProduct = await RetailerProduct.findOne({
                retailer: req.user._id,
                originalProduct: originalProduct._id
            });

            if (retailerProduct) {
                // Add to existing stock
                await retailerProduct.addStock(item.quantity, item.price);
            } else {
                // Create new retailer product
                retailerProduct = await RetailerProduct.create({
                    originalProduct: originalProduct._id,
                    wholesaler: originalProduct.wholesaler,
                    retailer: req.user._id,
                    name: originalProduct.name,
                    category: originalProduct.category,
                    description: originalProduct.description,
                    images: originalProduct.images,
                    mainImage: originalProduct.mainImage,
                    sku: originalProduct.sku,
                    purchasePrice: item.price,
                    retailPrice: originalProduct.suggestedRetailPrice,
                    stock: item.quantity,
                    initialQuantity: item.quantity,
                    purchaseOrderId: order._id,
                    specifications: originalProduct.specifications,
                    tags: originalProduct.tags
                });
            }

            retailerProducts.push(retailerProduct);
        }
    }

    // Mark order as inventory added
    order.isInventoryAdded = true;
    await order.save();

    res.json({
        success: true,
        message: `${retailerProducts.length} product(s) added to your inventory`,
        products: retailerProducts
    });
});

// @desc    Add product from wholesaler to retailer catalog (without purchase/stock)
// @route   POST /api/retailer-products/add-catalog-item
// @access  Private/Retailer
export const addCatalogItem = asyncHandler(async (req, res) => {
    const { productId } = req.body;

    if (!productId) {
        return res.status(400).json({
            success: false,
            message: "Product ID is required"
        });
    }

    const originalProduct = await Product.findById(productId);

    if (!originalProduct) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    // Check if retailer already has this product
    let retailerProduct = await RetailerProduct.findOne({
        retailer: req.user._id,
        originalProduct: originalProduct._id
    });

    if (retailerProduct) {
        return res.status(400).json({
            success: false,
            message: "Product already exists in your inventory"
        });
    }

    // Create new retailer product with 0 stock
    retailerProduct = await RetailerProduct.create({
        originalProduct: originalProduct._id,
        wholesaler: originalProduct.wholesaler,
        retailer: req.user._id,
        name: originalProduct.name,
        category: originalProduct.category,
        description: originalProduct.description,
        images: originalProduct.images,
        mainImage: originalProduct.mainImage,
        sku: originalProduct.sku,
        purchasePrice: originalProduct.wholesalePrice, // Default to current wholesale price
        retailPrice: originalProduct.suggestedRetailPrice,
        stock: 0,
        initialQuantity: 0,
        specifications: originalProduct.specifications,
        tags: originalProduct.tags,
        isActive: true // Active but out of stock
    });

    res.json({
        success: true,
        message: "Product added to your catalog successfully",
        product: retailerProduct
    });
});

// @desc    Get all retailer products (retailer's inventory)
// @route   GET /api/retailer-products
// @access  Private/Retailer
export const getMyInventory = asyncHandler(async (req, res) => {
    const { category, inStock, page = 1, limit = 20 } = req.query;

    const filter = { retailer: req.user._id };

    if (category) filter.category = category;
    if (inStock === "true") filter.stock = { $gt: 0 };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await RetailerProduct.find(filter)
        .populate("originalProduct", "name category")
        .populate("wholesaler", "name businessName")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await RetailerProduct.countDocuments(filter);

    // Get statistics
    const stats = await RetailerProduct.aggregate([
        { $match: { retailer: req.user._id } },
        {
            $group: {
                _id: null,
                totalProducts: { $sum: 1 },
                activeProducts: {
                    $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] }
                },
                totalStock: { $sum: "$stock" },
                totalRevenue: { $sum: "$totalRevenue" },
                totalProfit: { $sum: "$totalProfit" },
                lowStockCount: {
                    $sum: { $cond: [{ $lte: ["$stock", "$lowStockThreshold"] }, 1, 0] }
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

// @desc    Get all active retailer products (for customers to browse)
// @route   GET /api/retailer-products/browse
// @access  Public
export const browseRetailerProducts = asyncHandler(async (req, res) => {
    const {
        category,
        search,
        minPrice,
        maxPrice,
        retailer,
        inStock,
        sort,
        page = 1,
        limit = 20
    } = req.query;

    const filter = { isActive: true, stock: { $gt: 0 } };

    if (category) filter.category = category;
    if (retailer) filter.retailer = retailer;

    // Price range filter
    if (minPrice || maxPrice) {
        filter.retailPrice = {};
        if (minPrice) filter.retailPrice.$gte = parseFloat(minPrice);
        if (maxPrice) filter.retailPrice.$lte = parseFloat(maxPrice);
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
    let sortOption = { createdAt: -1 };
    if (sort === "price-asc") sortOption = { retailPrice: 1 };
    if (sort === "price-desc") sortOption = { retailPrice: -1 };
    if (sort === "name") sortOption = { name: 1 };
    if (sort === "popular") sortOption = { orderCount: -1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await RetailerProduct.find(filter)
        .populate("retailer", "name storeName email phone storeAddress")
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit));

    const total = await RetailerProduct.countDocuments(filter);

    res.json({
        success: true,
        count: products.length,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        products
    });
});

// @desc    Get single retailer product
// @route   GET /api/retailer-products/:id
// @access  Public
export const getRetailerProductById = asyncHandler(async (req, res) => {
    const product = await RetailerProduct.findById(req.params.id)
        .populate("retailer", "name storeName email phone storeAddress")
        .populate("originalProduct", "name category specifications")
        .populate("wholesaler", "name businessName");

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

// @desc    Update retailer product (price, stock, etc.)
// @route   PUT /api/retailer-products/:id
// @access  Private/Retailer
export const updateRetailerProduct = asyncHandler(async (req, res) => {
    const product = await RetailerProduct.findById(req.params.id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    // Check ownership
    if (product.retailer.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            success: false,
            message: "You don't have permission to update this product"
        });
    }

    const { retailPrice, stock, isActive, isFeatured, lowStockThreshold } = req.body;

    if (retailPrice !== undefined) {
        await product.updateRetailPrice(retailPrice);
    }

    if (stock !== undefined) product.stock = stock;
    if (isActive !== undefined) product.isActive = isActive;
    if (isFeatured !== undefined) product.isFeatured = isFeatured;
    if (lowStockThreshold !== undefined) product.lowStockThreshold = lowStockThreshold;

    await product.save();

    res.json({
        success: true,
        message: "Product updated successfully",
        product
    });
});

// @desc    Delete retailer product
// @route   DELETE /api/retailer-products/:id
// @access  Private/Retailer
export const deleteRetailerProduct = asyncHandler(async (req, res) => {
    const product = await RetailerProduct.findById(req.params.id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    // Check ownership
    if (product.retailer.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            success: false,
            message: "You don't have permission to delete this product"
        });
    }

    // Soft delete
    product.isActive = false;
    await product.save();

    res.json({
        success: true,
        message: "Product deleted successfully"
    });
});

// @desc    Get retailer sales analytics
// @route   GET /api/retailer-products/analytics
// @access  Private/Retailer
export const getRetailerAnalytics = asyncHandler(async (req, res) => {
    const { period = "all" } = req.query;

    let dateFilter = {};
    const now = new Date();

    if (period === "today") {
        dateFilter = {
            createdAt: {
                $gte: new Date(now.setHours(0, 0, 0, 0))
            }
        };
    } else if (period === "week") {
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        dateFilter = { createdAt: { $gte: weekAgo } };
    } else if (period === "month") {
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        dateFilter = { createdAt: { $gte: monthAgo } };
    }

    // Overall stats
    const overallStats = await RetailerProduct.aggregate([
        { $match: { retailer: req.user._id } },
        {
            $group: {
                _id: null,
                totalProducts: { $sum: 1 },
                totalStock: { $sum: "$stock" },
                totalRevenue: { $sum: "$totalRevenue" },
                totalProfit: { $sum: "$totalProfit" },
                totalSales: { $sum: "$totalSales" },
                averageProfit: { $avg: "$profitMargin" }
            }
        }
    ]);

    // Top selling products
    const topProducts = await RetailerProduct.find({ retailer: req.user._id })
        .sort({ orderCount: -1 })
        .limit(5)
        .select("name orderCount totalRevenue totalProfit");

    // Category-wise sales
    const categoryStats = await RetailerProduct.aggregate([
        { $match: { retailer: req.user._id } },
        {
            $group: {
                _id: "$category",
                count: { $sum: 1 },
                revenue: { $sum: "$totalRevenue" },
                profit: { $sum: "$totalProfit" }
            }
        },
        { $sort: { revenue: -1 } }
    ]);

    res.json({
        success: true,
        analytics: {
            overall: overallStats.length > 0 ? overallStats[0] : {},
            topProducts,
            categoryStats
        }
    });
});

export default {
    purchaseFromWholesaler,
    addCatalogItem,
    getMyInventory,
    browseRetailerProducts,
    getRetailerProductById,
    updateRetailerProduct,
    deleteRetailerProduct,
    getRetailerAnalytics
};
