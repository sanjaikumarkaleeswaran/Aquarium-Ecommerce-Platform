import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import RetailerProduct from "../models/RetailerProduct.js";
import Notification from "../models/Notification.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// @desc    Create order from cart
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod, buyerNotes } = req.body;

  // Determine items source: Direct (req.body) or Cart (DB)
  const { items: directItems } = req.body;

  let cartItems = [];
  let cartDiscount = null;
  let cart = null;


  if (directItems && Array.isArray(directItems) && directItems.length > 0) {
    // Process Direct Items
    for (const item of directItems) {
      if (!item.product) continue;

      let product = await Product.findById(item.product).populate("wholesaler");
      let productModel = "Product";
      let seller = null;
      let sellerRole = "wholesaler";
      let price = 0;

      if (product) {
        // Wholesaler Product
        seller = product.wholesaler;
        sellerRole = seller.role || "wholesaler";

        if (req.user.role === 'customer') {
          price = product.priceCustomer || product.suggestedRetailPrice || product.price;
        } else {
          // Retailer buying
          price = product.wholesalePrice || product.price;
        }

      } else {
        // Check if RetailerProduct
        product = await RetailerProduct.findById(item.product).populate("retailer");
        if (product) {
          productModel = "RetailerProduct";
          seller = product.retailer;
          sellerRole = seller.role || "retailer";
          price = product.retailPrice || product.price;
        } else {
          continue; // Not found in either
        }
      }

      // STOCK VALIDATION - Check if enough stock available
      if (!product.stock || product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock || 0}, Requested: ${item.quantity}`
        });
      }

      cartItems.push({
        product: product,
        seller: seller,
        sellerRole: sellerRole,
        quantity: item.quantity,
        price: price,
        subtotal: price * item.quantity,
        name: product.name,
        category: product.category,
        image: product.mainImage,
        productModel: productModel
      });
    }

    if (cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "No valid items found" });
    }

  } else {
    // Standard Cart Flow
    cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product")
      .populate("items.seller");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty"
      });
    }

    // Validate cart
    const validation = await cart.validateCart();
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Cart validation failed",
        errors: validation.errors
      });
    }

    cartItems = cart.items;
    cartDiscount = cart.discount;
  }

  // Group items by seller (one order per seller)
  const ordersBySeller = {};

  cartItems.forEach(item => {
    const sellerId = item.seller._id.toString();

    if (!ordersBySeller[sellerId]) {
      ordersBySeller[sellerId] = {
        seller: item.seller,
        sellerRole: item.sellerRole,
        items: []
      };
    }

    ordersBySeller[sellerId].items.push(item);
  });

  // Create orders
  const createdOrders = [];

  for (const sellerId in ordersBySeller) {
    const orderData = ordersBySeller[sellerId];

    // Calculate totals
    const subtotal = orderData.items.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = subtotal * 0.1; // 10% tax
    const shippingCost = 50; // Flat shipping cost
    const totalAmount = subtotal + tax + shippingCost - (cartDiscount?.amount || 0);

    // Create order
    const order = await Order.create({
      buyer: req.user._id,
      buyerName: req.user.name,
      buyerEmail: req.user.email,
      buyerRole: req.user.role,
      seller: orderData.seller._id,
      sellerName: orderData.seller.storeName || orderData.seller.businessName || orderData.seller.name,
      sellerEmail: orderData.seller.email,
      sellerRole: orderData.sellerRole,
      items: orderData.items.map(item => ({
        product: item.product._id,
        productModel: item.productModel,
        productId: item.product._id.toString(),
        name: item.name,
        category: item.category,
        image: item.image,
        sku: item.product.sku,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal
      })),
      subtotal,
      tax,
      taxRate: 0.1,
      shippingCost,
      discount: cartDiscount,
      totalAmount,
      shippingAddress,
      paymentMethod,
      buyerNotes,
      status: "pending",
      paymentStatus: "pending"
    });

    // Update product stock
    // Update product stock
    for (const item of orderData.items) {
      if (item.productModel === "Product") {
        const product = await Product.findById(item.product._id);
        await product.decreaseStock(item.quantity);
      } else {
        const product = await RetailerProduct.findById(item.product._id);
        await product.decreaseStock(item.quantity);
      }
    }


    // Create notifications
    // Notify buyer
    await Notification.createNotification({
      user: req.user._id,
      type: "order",
      title: "Order Placed Successfully! 🎉",
      message: `Your order #${order.orderNumber} has been placed. Total: ₹${totalAmount.toFixed(2)}`,
      link: `/orders/${order._id}`,
      priority: "high",
      icon: "shopping-bag",
      relatedEntity: {
        entityType: "Order",
        entityId: order._id
      }
    });

    // Notify seller
    await Notification.createNotification({
      user: orderData.seller._id,
      type: "order",
      title: "New Order Received! 🛒",
      message: `New order #${order.orderNumber} from ${req.user.name}. Total: ₹${totalAmount.toFixed(2)}`,
      link: `/orders/${order._id}`,
      priority: "high",
      icon: "bell",
      relatedEntity: {
        entityType: "Order",
        entityId: order._id
      }
    });

    createdOrders.push(order);
  }

  // Clear cart if used
  if (cart) {
    await cart.clearCart();
  }

  res.status(201).json({
    success: true,
    message: `${createdOrders.length} order(s) created successfully`,
    orders: createdOrders
  });
});

// @desc    Get all orders for current user
// @route   GET /api/orders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const { status, role, page = 1, limit = 20 } = req.query;

  const filter = {};

  // Determine if user is buyer or seller
  if (role === "buyer") {
    filter.buyer = req.user._id;
  } else if (role === "seller") {
    filter.seller = req.user._id;
  } else if (req.user.role === "customer") {
    filter.buyer = req.user._id;
  } else if (req.user.role === "wholesaler") {
    filter.seller = req.user._id;
  } else if (req.user.role === "retailer") {
    // Retailers can be both buyers (from wholesalers) and sellers (to customers)
    filter.$or = [
      { buyer: req.user._id },
      { seller: req.user._id }
    ];
  }

  if (status) filter.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const orders = await Order.find(filter)
    .populate("buyer", "name email role")
    .populate("seller", "name email role storeName businessName")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Order.countDocuments(filter);

  // Get order statistics
  const stats = await Order.aggregate([
    { $match: filter },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalAmount: { $sum: "$totalAmount" }
      }
    }
  ]);

  res.json({
    success: true,
    count: orders.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    orders,
    stats
  });
});

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("buyer", "name email phone role address")
    .populate("seller", "name email phone role storeName businessName storeAddress warehouseLocation")
    .populate("items.product");

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found"
    });
  }

  // Check if user has access to this order
  const isBuyer = order.buyer._id.toString() === req.user._id.toString();
  const isSeller = order.seller._id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isBuyer && !isSeller && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: "You don't have permission to view this order"
    });
  }

  res.json({
    success: true,
    order
  });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Seller or Admin)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found"
    });
  }

  // Check permission
  const isSeller = order.seller.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isSeller && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: "You don't have permission to update this order"
    });
  }

  // Update status
  await order.updateStatus(status, note, req.user._id);

  // Notify buyer
  const statusMessages = {
    confirmed: "Your order has been confirmed and is being prepared.",
    processing: "Your order is being processed.",
    shipped: "Your order has been shipped!",
    delivered: "Your order has been delivered. Thank you!",
    cancelled: "Your order has been cancelled."
  };

  if (statusMessages[status]) {
    await Notification.createNotification({
      user: order.buyer,
      type: "shipping",
      title: `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Order #${order.orderNumber}: ${statusMessages[status]}`,
      link: `/orders/${order._id}`,
      priority: status === "delivered" || status === "cancelled" ? "high" : "medium",
      icon: "truck",
      relatedEntity: {
        entityType: "Order",
        entityId: order._id
      }
    });
  }

  res.json({
    success: true,
    message: "Order status updated",
    order
  });
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found"
    });
  }

  // Check permission
  const isBuyer = order.buyer.toString() === req.user._id.toString();
  const isSeller = order.seller.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isBuyer && !isSeller && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: "You don't have permission to cancel this order"
    });
  }

  // Cannot cancel delivered orders
  if (order.status === "delivered") {
    return res.status(400).json({
      success: false,
      message: "Cannot cancel delivered orders"
    });
  }

  // Cancel order
  await order.cancelOrder(reason, req.user._id);

  // Restore stock
  for (const item of order.items) {
    if (item.productModel === "Product") {
      const product = await Product.findById(item.product);
      if (product) {
        await product.increaseStock(item.quantity);
      }
    } else {
      const product = await RetailerProduct.findById(item.product);
      if (product) {
        await product.increaseStock(item.quantity, item.subtotal, item.subtotal - (item.price * item.quantity));
      }
    }
  }

  // Notify both parties
  await Notification.createNotification({
    user: order.buyer,
    type: "order",
    title: "Order Cancelled",
    message: `Order #${order.orderNumber} has been cancelled. ${reason || ''}`,
    link: `/orders/${order._id}`,
    priority: "high",
    icon: "x-circle"
  });

  await Notification.createNotification({
    user: order.seller,
    type: "order",
    title: "Order Cancelled",
    message: `Order #${order.orderNumber} has been cancelled by ${isBuyer ? 'buyer' : 'seller'}. ${reason || ''}`,
    link: `/orders/${order._id}`,
    priority: "high",
    icon: "x-circle"
  });

  res.json({
    success: true,
    message: "Order cancelled successfully",
    order
  });
});

// @desc    Add tracking information
// @route   PUT /api/orders/:id/tracking
// @access  Private (Seller or Admin)
export const addTracking = asyncHandler(async (req, res) => {
  const { trackingNumber, carrier } = req.body;

  if (!trackingNumber) {
    return res.status(400).json({
      success: false,
      message: "Tracking number is required"
    });
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found"
    });
  }

  // Check permission
  const isSeller = order.seller.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isSeller && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: "You don't have permission to update this order"
    });
  }

  await order.addTracking(trackingNumber, carrier);

  // Notify buyer
  await Notification.createNotification({
    user: order.buyer,
    type: "shipping",
    title: "Tracking Information Added",
    message: `Your order #${order.orderNumber} is on its way! Tracking: ${trackingNumber}`,
    link: `/orders/${order._id}`,
    priority: "high",
    icon: "truck"
  });

  res.json({
    success: true,
    message: "Tracking information added",
    order
  });
});

// @desc    Mark order as paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const markAsPaid = asyncHandler(async (req, res) => {
  const { transactionId, paymentIntentId } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found"
    });
  }

  await order.markAsPaid(transactionId, paymentIntentId);

  // Notify seller
  await Notification.createNotification({
    user: order.seller,
    type: "payment",
    title: "Payment Received",
    message: `Payment received for order #${order.orderNumber}. Amount: ₹${order.totalAmount}`,
    link: `/orders/${order._id}`,
    priority: "high",
    icon: "dollar-sign"
  });

  res.json({
    success: true,
    message: "Order marked as paid",
    order
  });
});

export default {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  addTracking,
  markAsPaid
};