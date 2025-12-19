import axios from 'axios';
const API_URL = "http://localhost:5000/api/orders";

// Place a new order
export const placeOrder = async (order) => {
    const token = sessionStorage.getItem("token");

    // Validate token exists
    if (!token) {
        throw new Error("Authentication required. Please login again.");
    }

    const res = await axios.post(API_URL, order, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

// Get all orders for the current user
export const getOrders = async () => {
    const token = sessionStorage.getItem("token");
    const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

// Get order by ID
export const getOrderById = async (id) => {
    const token = sessionStorage.getItem("token");
    const res = await axios.get(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

// Update order status (for retailers/wholesalers)
export const updateOrderStatus = async (id, status) => {
    const token = sessionStorage.getItem("token");
    const res = await axios.put(`${API_URL}/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};