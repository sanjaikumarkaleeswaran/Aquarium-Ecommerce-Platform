import axios from 'axios';

const API_URL = '/api/reviews';

const getAuthHeader = () => {
    const token = sessionStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getProductReviews = async (productId) => {
    try {
        const response = await axios.get(`${API_URL}/product/${productId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const createReview = async (productId, rating, comment) => {
    try {
        const response = await axios.post(
            API_URL,
            { productId, rating, comment },
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const deleteReview = async (reviewId) => {
    try {
        const response = await axios.delete(
            `${API_URL}/${reviewId}`,
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
