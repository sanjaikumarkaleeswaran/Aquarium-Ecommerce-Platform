import api from './authService';

const API_URL = "/api/retailer-products";

// Purchase products from a delivered order (Add to Inventory)
export const purchaseFromWholesaler = async (orderId) => {
    try {
        const res = await api.post(`${API_URL}/purchase`, { orderId });
        return res.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Add product to catalog from wholesaler (without purchase)
export const addCatalogItem = async (productId) => {
    try {
        const res = await api.post(`${API_URL}/add-catalog-item`, { productId });
        return res.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get Retailer's Inventory (items bought from wholesalers)
export const getMyInventory = async (params = {}) => {
    try {
        // Convert params to query string
        const query = new URLSearchParams(params).toString();
        const url = query ? `${API_URL}/my-inventory/list?${query}` : `${API_URL}/my-inventory/list`;

        const res = await api.get(url);
        return res.data;
    } catch (error) {
        console.error('Get inventory error:', error);
        throw error.response?.data || error.message;
    }
};

// Update Retailer Product (Price, Stock, Active status)
export const updateRetailerProduct = async (id, data) => {
    try {
        const res = await api.put(`${API_URL}/${id}`, data);
        return res.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Delete Retailer Product (Soft delete)
export const deleteRetailerProduct = async (id) => {
    try {
        const res = await api.delete(`${API_URL}/${id}`);
        return res.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get Retailer Analytics
export const getRetailerAnalytics = async (period = 'all') => {
    try {
        const res = await api.get(`${API_URL}/analytics?period=${period}`);
        return res.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get ALL Retailer Products (for customers to browse)
export const getAllRetailerProducts = async () => {
    try {
        const res = await api.get(`${API_URL}/browse`);
        return res.data;
    } catch (error) {
        console.error('Get all retailer products error:', error);
        throw error.response?.data || error.message;
    }
};

// Get Single Retailer Product by ID (for customer details page)
export const getRetailerProductById = async (id) => {
    try {
        const res = await api.get(`${API_URL}/${id}`);
        return res.data;
    } catch (error) {
        console.error('Get retailer product by ID error:', error);
        throw error.response?.data || error.message;
    }
};
