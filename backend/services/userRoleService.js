// Role-Based User Service
// Organized queries for different user roles

import User from '../models/User.js';

// ==================== GET USERS BY ROLE ====================

export const getAllCustomers = async (filters = {}) => {
    const query = { role: 'customer', ...filters };
    return await User.find(query).select('-password');
};

export const getAllRetailers = async (filters = {}) => {
    const query = { role: 'retailer', ...filters };
    return await User.find(query).select('-password');
};

export const getAllWholesalers = async (filters = {}) => {
    const query = { role: 'wholesaler', ...filters };
    return await User.find(query).select('-password');
};

export const getAllAdmins = async (filters = {}) => {
    const query = { role: 'admin', ...filters };
    return await User.find(query).select('-password');
};

// ==================== GET USER STATISTICS BY ROLE ====================

export const getCustomerStats = async () => {
    const total = await User.countDocuments({ role: 'customer' });
    const active = await User.countDocuments({ role: 'customer', approvalStatus: 'approved' });
    const pending = await User.countDocuments({ role: 'customer', approvalStatus: 'pending' });

    return { total, active, pending };
};

export const getRetailerStats = async () => {
    const total = await User.countDocuments({ role: 'retailer' });
    const active = await User.countDocuments({ role: 'retailer', approvalStatus: 'approved' });
    const pending = await User.countDocuments({ role: 'retailer', approvalStatus: 'pending' });

    return { total, active, pending };
};

export const getWholesalerStats = async () => {
    const total = await User.countDocuments({ role: 'wholesaler' });
    const active = await User.countDocuments({ role: 'wholesaler', approvalStatus: 'approved' });
    const pending = await User.countDocuments({ role: 'wholesaler', approvalStatus: 'pending' });

    return { total, active, pending };
};

// ==================== ROLE-SPECIFIC USER CREATION ====================

export const createCustomer = async (userData) => {
    const customer = await User.create({
        ...userData,
        role: 'customer',
        approvalStatus: 'approved' // Auto-approve customers
    });
    return customer;
};

export const createRetailer = async (userData) => {
    const retailer = await User.create({
        ...userData,
        role: 'retailer',
        approvalStatus: 'pending' // Requires admin approval
    });
    return retailer;
};

export const createWholesaler = async (userData) => {
    const wholesaler = await User.create({
        ...userData,
        role: 'wholesaler',
        approvalStatus: 'pending' // Requires admin approval
    });
    return wholesaler;
};

export default {
    getAllCustomers,
    getAllRetailers,
    getAllWholesalers,
    getAllAdmins,
    getCustomerStats,
    getRetailerStats,
    getWholesalerStats,
    createCustomer,
    createRetailer,
    createWholesaler
};
