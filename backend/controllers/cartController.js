import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import RetailerProduct from "../models/RetailerProduct.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = asyncHandler(async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id })
        .populate("items.product")
        .populate("items.seller", "name storeName businessName email");

    if (!cart) {
        // Create empty cart if doesn't exist
        cart = await Cart.create({
            user: req.user._id,
            items: []
        });
    }

    res.json({
        success: true,
        cart
    });
});

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
export const addToCart = asyncHandler(async (req, res) => {
    const { productId, productType, quantity } = req.body;

    // Validate product type
    if (!["Product", "RetailerProduct"].includes(productType)) {
        return res.status(400).json({
            success: false,
            message: "Invalid product type"
        });
    }

    // Get product details
    let product, seller, sellerRole, price;

    if (productType === "Product") {
        // Wholesaler product
        product = await Product.findById(productId).populate("wholesaler");

        if (!product || !product.isActive) {
            return res.status(404).json({
                success: false,
                message: "Product not found or inactive"
            });
        }

        // Only retailers can buy from wholesalers
        if (req.user.role !== "retailer") {
            return res.status(403).json({
                success: false,
                message: "Only retailers can purchase from wholesalers"
            });
        }

        seller = product.wholesaler;
        sellerRole = "wholesaler";
        price = product.wholesalePrice;

    } else {
        // Retailer product
        product = await RetailerProduct.findById(productId).populate("retailer");

        if (!product || !product.isActive) {
            return res.status(404).json({
                success: false,
                message: "Product not found or inactive"
            });
        }

        // Only customers can buy from retailers
        if (req.user.role !== "customer") {
            return res.status(403).json({
                success: false,
                message: "Only customers can purchase from retailers"
            });
        }

        seller = product.retailer;
        sellerRole = "retailer";
        price = product.retailPrice;
    }

    // Check stock availability
    if (product.stock < quantity) {
        return res.status(400).json({
            success: false,
            message: `Only ${product.stock} items available in stock`
        });
    }

    // Check minimum order quantity
    if (quantity < product.minimumOrderQuantity) {
        return res.status(400).json({
            success: false,
            message: `Minimum order quantity is ${product.minimumOrderQuantity}`
        });
    }

    // Get or create cart
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        cart = await Cart.create({
            user: req.user._id,
            items: []
        });
    }

    // Add item to cart
    await cart.addItem({
        product: productId,
        productModel: productType,
        name: product.name,
        image: product.mainImage || (product.images && product.images[0]),
        category: product.category,
        price: price,
        quantity: quantity,
        seller: seller._id,
        sellerName: seller.storeName || seller.businessName || seller.name,
        sellerRole: sellerRole,
        availableStock: product.stock,
        minimumOrderQuantity: product.minimumOrderQuantity || 1
    });

    // Populate cart for response
    cart = await Cart.findById(cart._id)
        .populate("items.product")
        .populate("items.seller", "name storeName businessName");

    res.json({
        success: true,
        message: "Item added to cart",
        cart
    });
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:productId
// @access  Private
export const updateCartItem = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { quantity, productType } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        return res.status(404).json({
            success: false,
            message: "Cart not found"
        });
    }

    // Validate quantity
    if (quantity < 0) {
        return res.status(400).json({
            success: false,
            message: "Quantity cannot be negative"
        });
    }

    // If quantity is 0, remove item
    if (quantity === 0) {
        await cart.removeItem(productId, productType);
    } else {
        // Check stock availability
        let product;
        if (productType === "Product") {
            product = await Product.findById(productId);
        } else {
            product = await RetailerProduct.findById(productId);
        }

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: `Only ${product.stock} items available`
            });
        }

        await cart.updateItemQuantity(productId, productType, quantity);
    }

    // Populate and return updated cart
    const updatedCart = await Cart.findById(cart._id)
        .populate("items.product")
        .populate("items.seller", "name storeName businessName");

    res.json({
        success: true,
        message: "Cart updated",
        cart: updatedCart
    });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:productId
// @access  Private
export const removeFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { productType } = req.query;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        return res.status(404).json({
            success: false,
            message: "Cart not found"
        });
    }

    await cart.removeItem(productId, productType);

    // Populate and return updated cart
    const updatedCart = await Cart.findById(cart._id)
        .populate("items.product")
        .populate("items.seller", "name storeName businessName");

    res.json({
        success: true,
        message: "Item removed from cart",
        cart: updatedCart
    });
});

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        return res.status(404).json({
            success: false,
            message: "Cart not found"
        });
    }

    await cart.clearCart();

    res.json({
        success: true,
        message: "Cart cleared",
        cart
    });
});

// @desc    Validate cart before checkout
// @route   POST /api/cart/validate
// @access  Private
export const validateCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart || cart.items.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Cart is empty"
        });
    }

    const validation = await cart.validateCart();

    if (!validation.isValid) {
        return res.status(400).json({
            success: false,
            message: "Cart validation failed",
            errors: validation.errors
        });
    }

    res.json({
        success: true,
        message: "Cart is valid",
        cart
    });
});

// @desc    Apply discount code
// @route   POST /api/cart/discount
// @access  Private
export const applyDiscount = asyncHandler(async (req, res) => {
    const { code } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        return res.status(404).json({
            success: false,
            message: "Cart not found"
        });
    }

    // TODO: Implement discount code validation
    // For now, just apply a sample 10% discount
    const discountPercentage = 10;
    await cart.applyDiscount(code, null, discountPercentage);

    const updatedCart = await Cart.findById(cart._id)
        .populate("items.product")
        .populate("items.seller", "name storeName businessName");

    res.json({
        success: true,
        message: "Discount applied",
        cart: updatedCart
    });
});

// @desc    Remove discount
// @route   DELETE /api/cart/discount
// @access  Private
export const removeDiscount = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        return res.status(404).json({
            success: false,
            message: "Cart not found"
        });
    }

    await cart.removeDiscount();

    const updatedCart = await Cart.findById(cart._id)
        .populate("items.product")
        .populate("items.seller", "name storeName businessName");

    res.json({
        success: true,
        message: "Discount removed",
        cart: updatedCart
    });
});

export default {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    validateCart,
    applyDiscount,
    removeDiscount
};
