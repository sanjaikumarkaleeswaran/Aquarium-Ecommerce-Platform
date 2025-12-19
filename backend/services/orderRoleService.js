// Role-Based Order Service
// Organized queries for orders by different roles

import Order from '../models/Order.js';

// ==================== GET ORDERS BY BUYER ROLE ====================

export const getCustomerOrders = async (customerId = null) => {
    const query = { buyerRole: 'customer' };
    if (customerId) query.buyer = customerId;

    return await Order.find(query)
        .populate('buyer', 'name email')
        .populate('seller', 'name businessName')
        .sort({ createdAt: -1 });
};

export const getRetailerOrders = async (retailerId = null) => {
    const query = { buyerRole: 'retailer' };
    if (retailerId) query.buyer = retailerId;

    return await Order.find(query)
        .populate('buyer', 'name businessName email')
        .populate('seller', 'name businessName')
        .sort({ createdAt: -1 });
};

// ==================== GET ORDERS BY SELLER ROLE ====================

export const getOrdersForWholesaler = async (wholesalerId) => {
    // Orders where wholesaler is the seller
    return await Order.find({ seller: wholesalerId })
        .populate('buyer', 'name businessName email role')
        .sort({ createdAt: -1 });
};

export const getOrdersForRetailer = async (retailerId) => {
    // Orders where retailer is the seller (sold to customers)
    return await Order.find({ seller: retailerId, buyerRole: 'customer' })
        .populate('buyer', 'name email')
        .sort({ createdAt: -1 });
};

// ==================== GET PURCHASE ORDERS (As Buyer) ====================

export const getRetailerPurchases = async (retailerId) => {
    // Orders where retailer is the buyer (bought from wholesalers)
    return await Order.find({ buyer: retailerId, buyerRole: 'retailer' })
        .populate('seller', 'name businessName')
        .sort({ createdAt: -1 });
};

// ==================== ORDER STATISTICS BY ROLE ====================

export const getCustomerOrderStats = async () => {
    const total = await Order.countDocuments({ buyerRole: 'customer' });
    const pending = await Order.countDocuments({ buyerRole: 'customer', status: 'pending' });
    const completed = await Order.countDocuments({ buyerRole: 'customer', status: 'delivered' });
    const totalRevenue = await Order.aggregate([
        { $match: { buyerRole: 'customer', status: 'delivered' } },
        { $group: { _id: null, revenue: { $sum: '$totalAmount' } } }
    ]);

    return {
        total,
        pending,
        completed,
        revenue: totalRevenue[0]?.revenue || 0
    };
};

export const getRetailerOrderStats = async () => {
    const total = await Order.countDocuments({ buyerRole: 'retailer' });
    const pending = await Order.countDocuments({ buyerRole: 'retailer', status: 'pending' });
    const completed = await Order.countDocuments({ buyerRole: 'retailer', status: 'delivered' });
    const totalRevenue = await Order.aggregate([
        { $match: { buyerRole: 'retailer', status: 'delivered' } },
        { $group: { _id: null, revenue: { $sum: '$totalAmount' } } }
    ]);

    return {
        total,
        pending,
        completed,
        revenue: totalRevenue[0]?.revenue || 0
    };
};

export const getWholesalerSalesStats = async (wholesalerId) => {
    const total = await Order.countDocuments({ seller: wholesalerId });
    const pending = await Order.countDocuments({ seller: wholesalerId, status: 'pending' });
    const completed = await Order.countDocuments({ seller: wholesalerId, status: 'delivered' });

    const revenueData = await Order.aggregate([
        { $match: { seller: wholesalerId, status: 'delivered' } },
        { $group: { _id: null, revenue: { $sum: '$totalAmount' } } }
    ]);

    // Breakdown by buyer role
    const retailerOrders = await Order.countDocuments({
        seller: wholesalerId,
        buyerRole: 'retailer'
    });
    const customerOrders = await Order.countDocuments({
        seller: wholesalerId,
        buyerRole: 'customer'
    });

    return {
        total,
        pending,
        completed,
        revenue: revenueData[0]?.revenue || 0,
        retailerOrders,
        customerOrders
    };
};

// ==================== COMPLETE USER ORDER VIEW ====================

export const getUserOrders = async (userId, userRole) => {
    let asBuyer, asSeller;

    // Orders where user is buyer
    asBuyer = await Order.find({ buyer: userId })
        .populate('seller', 'name businessName')
        .sort({ createdAt: -1 });

    // Orders where user is seller (only for retailers and wholesalers)
    if (userRole === 'retailer' || userRole === 'wholesaler') {
        asSeller = await Order.find({ seller: userId })
            .populate('buyer', 'name businessName email role')
            .sort({ createdAt: -1 });
    } else {
        asSeller = [];
    }

    return {
        purchases: asBuyer,      // Orders I placed
        sales: asSeller,         // Orders placed with me
        totalPurchases: asBuyer.length,
        totalSales: asSeller.length
    };
};

export default {
    getCustomerOrders,
    getRetailerOrders,
    getOrdersForWholesaler,
    getOrdersForRetailer,
    getRetailerPurchases,
    getCustomerOrderStats,
    getRetailerOrderStats,
    getWholesalerSalesStats,
    getUserOrders
};
