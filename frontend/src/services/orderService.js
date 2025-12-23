import api from './authService';
const API_URL = "/api/orders";

// Place a new order
export const placeOrder = async (order) => {
    const res = await api.post(API_URL, order);
    return res.data;
};

// Get all orders for the current user
export const getOrders = async () => {
    const res = await api.get(API_URL);
    return res.data;
};

// Get order by ID
export const getOrderById = async (id) => {
    const res = await api.get(`${API_URL}/${id}`);
    return res.data;
};

// Update order status (for retailers/wholesalers)
export const updateOrderStatus = async (id, status) => {
    const res = await api.put(`${API_URL}/${id}/status`, { status });
    return res.data;
};