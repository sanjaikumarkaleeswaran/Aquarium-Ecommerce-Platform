import User from "../models/User.js";
import Product from "../models/Product.js";
import RetailerProduct from "../models/RetailerProduct.js";
import Order from "../models/Order.js";
import Notification from "../models/Notification.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// @desc    Get all pending approvals (retailers and wholesalers)
// @route   GET /api/admin/approvals/pending
// @access  Private/Admin
export const getPendingApprovals = asyncHandler(async (req, res) => {
    const pendingUsers = await User.find({
        role: { $in: ["retailer", "wholesaler"] },
        approvalStatus: "pending"
    })
        .select("-password")
        .sort({ createdAt: -1 });

    res.json({
        success: true,
        count: pendingUsers.length,
        users: pendingUsers
    });
});

// @desc    Approve a retailer or wholesaler
// @route   POST /api/admin/approvals/:userId/approve
// @access  Private/Admin
export const approveUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { comments } = req.body;

    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    if (user.role !== "retailer" && user.role !== "wholesaler") {
        return res.status(400).json({
            success: false,
            message: "Only retailers and wholesalers require approval"
        });
    }

    if (user.approvalStatus === "approved") {
        return res.status(400).json({
            success: false,
            message: "User is already approved"
        });
    }

    // Approve user
    user.isApproved = true;
    user.approvalStatus = "approved";
    user.approvedBy = req.user._id;
    user.approvedAt = Date.now();
    user.rejectionReason = undefined;

    await user.save();

    // Create notification for user
    await Notification.createNotification({
        user: user._id,
        type: "approval",
        title: "Account Approved! 🎉",
        message: `Congratulations! Your ${user.role} account has been approved. You can now start ${user.role === "retailer" ? "ordering from wholesalers and selling to customers" : "adding products and selling to retailers"}.`,
        link: user.role === "retailer" ? "/retailer/dashboard" : "/wholesaler/dashboard",
        priority: "high",
        icon: "check-circle"
    });

    res.json({
        success: true,
        message: `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} approved successfully`,
        user: user.getPublicProfile()
    });
});

// @desc    Reject a retailer or wholesaler
// @route   POST /api/admin/approvals/:userId/reject
// @access  Private/Admin
export const rejectUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { reason } = req.body;

    if (!reason) {
        return res.status(400).json({
            success: false,
            message: "Please provide a rejection reason"
        });
    }

    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    if (user.role !== "retailer" && user.role !== "wholesaler") {
        return res.status(400).json({
            success: false,
            message: "Only retailers and wholesalers require approval"
        });
    }

    // Reject user
    user.isApproved = false;
    user.approvalStatus = "rejected";
    user.rejectionReason = reason;

    await user.save();

    // Create notification for user
    await Notification.createNotification({
        user: user._id,
        type: "approval",
        title: "Account Application Rejected",
        message: `Your ${user.role} account application has been rejected. Reason: ${reason}`,
        priority: "high",
        icon: "x-circle"
    });

    res.json({
        success: true,
        message: `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} rejected`,
        user: user.getPublicProfile()
    });
});

// @desc    Get all users with filters
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
    const { role, approvalStatus, isActive, search, page = 1, limit = 20 } = req.query;

    const filter = {};

    if (role) filter.role = role;
    if (approvalStatus) filter.approvalStatus = approvalStatus;
    if (isActive !== undefined) filter.isActive = isActive === "true";

    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { businessName: { $regex: search, $options: "i" } },
            { storeName: { $regex: search, $options: "i" } }
        ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
        success: true,
        count: users.length,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        users
    });
});

// @desc    Get user by ID
// @route   GET /api/admin/users/:userId
// @access  Private/Admin
export const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userId).select("-password");

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    res.json({
        success: true,
        user
    });
});

// @desc    Deactivate user account
// @route   PUT /api/admin/users/:userId/deactivate
// @access  Private/Admin
export const deactivateUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    if (user.role === "admin") {
        return res.status(403).json({
            success: false,
            message: "Cannot deactivate admin accounts"
        });
    }

    user.isActive = false;
    await user.save();

    // Notify user
    await Notification.createNotification({
        user: user._id,
        type: "system",
        title: "Account Deactivated",
        message: "Your account has been deactivated. Please contact support for more information.",
        priority: "urgent",
        icon: "alert-circle"
    });

    res.json({
        success: true,
        message: "User account deactivated successfully",
        user: user.getPublicProfile()
    });
});

// @desc    Activate user account
// @route   PUT /api/admin/users/:userId/activate
// @access  Private/Admin
export const activateUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    user.isActive = true;
    await user.save();

    // Notify user
    await Notification.createNotification({
        user: user._id,
        type: "system",
        title: "Account Activated",
        message: "Your account has been reactivated. Welcome back!",
        priority: "high",
        icon: "check-circle"
    });

    res.json({
        success: true,
        message: "User account activated successfully",
        user: user.getPublicProfile()
    });
});

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
export const getDashboardStats = asyncHandler(async (req, res) => {
    // User statistics
    const totalUsers = await User.countDocuments();
    const customerCount = await User.countDocuments({ role: "customer", isActive: true });
    const retailerCount = await User.countDocuments({ role: "retailer", isActive: true, isApproved: true });
    const wholesalerCount = await User.countDocuments({ role: "wholesaler", isActive: true, isApproved: true });
    const pendingApprovals = await User.countDocuments({
        role: { $in: ["retailer", "wholesaler"] },
        approvalStatus: "pending"
    });

    // Product statistics
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalRetailerProducts = await RetailerProduct.countDocuments({ isActive: true });
    const lowStockProducts = await Product.countDocuments({
        isActive: true,
        $expr: { $lte: ["$stock", "$lowStockThreshold"] }
    });

    // Order statistics
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const processingOrders = await Order.countDocuments({ status: { $in: ["confirmed", "processing"] } });
    const shippedOrders = await Order.countDocuments({ status: "shipped" });
    const deliveredOrders = await Order.countDocuments({ status: "delivered" });

    // Revenue statistics
    const revenueData = await Order.aggregate([
        { $match: { paymentStatus: "completed" } },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$totalAmount" },
                averageOrderValue: { $avg: "$totalAmount" }
            }
        }
    ]);

    const revenue = revenueData.length > 0 ? revenueData[0] : { totalRevenue: 0, averageOrderValue: 0 };

    // Recent activity
    const recentOrders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("buyer", "name email role")
        .populate("seller", "name email role");

    const recentUsers = await User.find()
        .select("-password")
        .sort({ createdAt: -1 })
        .limit(5);

    res.json({
        success: true,
        stats: {
            users: {
                total: totalUsers,
                customers: customerCount,
                retailers: retailerCount,
                wholesalers: wholesalerCount,
                pendingApprovals
            },
            products: {
                total: totalProducts,
                retailerProducts: totalRetailerProducts,
                lowStock: lowStockProducts
            },
            orders: {
                total: totalOrders,
                pending: pendingOrders,
                processing: processingOrders,
                shipped: shippedOrders,
                delivered: deliveredOrders
            },
            revenue: {
                total: revenue.totalRevenue,
                average: revenue.averageOrderValue
            }
        },
        recentActivity: {
            orders: recentOrders,
            users: recentUsers
        }
    });
});

// @desc    Get all orders (admin view)
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(filter)
        .populate("buyer", "name email role")
        .populate("seller", "name email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
        success: true,
        count: orders.length,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        orders
    });
});

// @desc    Get all products (admin view)
// @route   GET /api/admin/products
// @access  Private/Admin
export const getAllProducts = asyncHandler(async (req, res) => {
    const { category, isActive, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === "true";

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find(filter)
        .populate("wholesaler", "name email businessName")
        .sort({ createdAt: -1 })
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

// @desc    Delete a user
// @route   DELETE /api/admin/users/:userId
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    // Prevent deleting admin users
    if (user.role === "admin") {
        return res.status(403).json({
            success: false,
            message: "Cannot delete admin users"
        });
    }

    // Delete user's related data
    if (user.role === "wholesaler") {
        // Delete all products by this wholesaler
        await Product.deleteMany({ wholesaler: userId });
    }

    if (user.role === "retailer") {
        // Delete all retailer products
        await RetailerProduct.deleteMany({ retailer: userId });
    }

    // Delete user's orders
    await Order.deleteMany({ user: userId });

    // Delete user's notifications
    await Notification.deleteMany({ user: userId });

    // Delete the user
    await user.deleteOne();

    res.json({
        success: true,
        message: `User ${user.name} has been permanently deleted`
    });
});

// @desc    Update user information
// @route   PUT /api/admin/users/:userId
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const {
        name,
        email,
        role,
        phone,
        address,
        businessName,
        storeName,
        storeAddress,
        isActive
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({
                success: false,
                message: "Email already in use"
            });
        }
        user.email = email;
    }

    // Update basic fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (isActive !== undefined) user.isActive = isActive;

    // Update role-specific fields
    if (user.role === "retailer" || role === "retailer") {
        if (storeName) user.storeName = storeName;
        if (storeAddress) user.storeAddress = storeAddress;
        if (businessName) user.businessName = businessName;
    }

    if (user.role === "wholesaler" || role === "wholesaler") {
        if (businessName) user.businessName = businessName;
    }

    // Update role if changed (be careful with this)
    if (role && role !== user.role) {
        // Validate role change
        const validRoles = ["customer", "retailer", "wholesaler", "admin"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role"
            });
        }
        user.role = role;

        // If changing to retailer/wholesaler, set approval to pending
        if (role === "retailer" || role === "wholesaler") {
            user.approvalStatus = "pending";
            user.isApproved = false;
        }
    }

    await user.save();

    res.json({
        success: true,
        message: "User updated successfully",
        user: user.getPublicProfile()
    });
});

export default {
    getPendingApprovals,
    approveUser,
    rejectUser,
    getAllUsers,
    getUserById,
    deactivateUser,
    activateUser,
    getDashboardStats,
    getAllOrders,
    getAllProducts,
    deleteUser,
    updateUser
};
