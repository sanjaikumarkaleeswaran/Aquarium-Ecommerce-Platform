// Helper functions for the application

// Generate unique SKU
export const generateSKU = (category, name) => {
    const categoryCode = category.substring(0, 3).toUpperCase();
    const nameCode = name.substring(0, 3).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${categoryCode}-${nameCode}-${randomNum}`;
};

// Calculate profit margin
export const calculateProfitMargin = (sellingPrice, costPrice) => {
    return sellingPrice - costPrice;
};

// Calculate profit percentage
export const calculateProfitPercentage = (sellingPrice, costPrice) => {
    const margin = calculateProfitMargin(sellingPrice, costPrice);
    return ((margin / costPrice) * 100).toFixed(2);
};

// Format currency
export const formatCurrency = (amount, currency = "INR") => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currency
    }).format(amount);
};

// Format date
export const formatDate = (date, format = "long") => {
    const options = {
        short: { year: "numeric", month: "2-digit", day: "2-digit" },
        long: { year: "numeric", month: "long", day: "numeric" },
        full: { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    };

    return new Intl.DateTimeFormat("en-IN", options[format] || options.long).format(new Date(date));
};

// Validate email
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate phone number (Indian format)
export const isValidPhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ""));
};

// Generate random string
export const generateRandomString = (length = 10) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

// Paginate results
export const paginate = (page = 1, limit = 20) => {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    return {
        page: pageNum,
        limit: limitNum,
        skip
    };
};

// Calculate pagination metadata
export const getPaginationMetadata = (total, page, limit) => {
    const totalPages = Math.ceil(total / limit);

    return {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
    };
};

// Sanitize user input
export const sanitizeInput = (input) => {
    if (typeof input !== "string") return input;

    return input
        .trim()
        .replace(/[<>]/g, ""); // Remove < and > to prevent XSS
};

// Calculate estimated delivery date
export const calculateDeliveryDate = (daysToAdd = 7) => {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    return date;
};

// Get order status color
export const getOrderStatusColor = (status) => {
    const colors = {
        pending: "#f59e0b",
        confirmed: "#3b82f6",
        processing: "#8b5cf6",
        shipped: "#06b6d4",
        delivered: "#10b981",
        cancelled: "#ef4444",
        refunded: "#f97316"
    };

    return colors[status] || "#6b7280";
};

// Get approval status color
export const getApprovalStatusColor = (status) => {
    const colors = {
        pending: "#f59e0b",
        approved: "#10b981",
        rejected: "#ef4444"
    };

    return colors[status] || "#6b7280";
};

// Calculate tax
export const calculateTax = (amount, taxRate = 0.1) => {
    return amount * taxRate;
};

// Calculate discount
export const calculateDiscount = (amount, discountPercentage) => {
    return (amount * discountPercentage) / 100;
};

// Check if stock is low
export const isLowStock = (stock, threshold = 10) => {
    return stock <= threshold && stock > 0;
};

// Check if out of stock
export const isOutOfStock = (stock) => {
    return stock === 0;
};

// Generate order number
export const generateOrderNumber = () => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.floor(10000 + Math.random() * 90000);
    return `ORD-${dateStr}-${random}`;
};

// Sleep function for delays
export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

// Chunk array into smaller arrays
export const chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
};

// Remove duplicates from array
export const removeDuplicates = (array, key) => {
    if (!key) {
        return [...new Set(array)];
    }

    const seen = new Set();
    return array.filter(item => {
        const value = item[key];
        if (seen.has(value)) {
            return false;
        }
        seen.add(value);
        return true;
    });
};

// Sort array of objects
export const sortBy = (array, key, order = "asc") => {
    return array.sort((a, b) => {
        if (order === "asc") {
            return a[key] > b[key] ? 1 : -1;
        } else {
            return a[key] < b[key] ? 1 : -1;
        }
    });
};

// Group array by key
export const groupBy = (array, key) => {
    return array.reduce((result, item) => {
        const group = item[key];
        if (!result[group]) {
            result[group] = [];
        }
        result[group].push(item);
        return result;
    }, {});
};

export default {
    generateSKU,
    calculateProfitMargin,
    calculateProfitPercentage,
    formatCurrency,
    formatDate,
    isValidEmail,
    isValidPhone,
    generateRandomString,
    paginate,
    getPaginationMetadata,
    sanitizeInput,
    calculateDeliveryDate,
    getOrderStatusColor,
    getApprovalStatusColor,
    calculateTax,
    calculateDiscount,
    isLowStock,
    isOutOfStock,
    generateOrderNumber,
    sleep,
    chunkArray,
    removeDuplicates,
    sortBy,
    groupBy
};
