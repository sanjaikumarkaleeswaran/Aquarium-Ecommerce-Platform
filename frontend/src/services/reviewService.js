import api from './authService';

const API_URL = '/api/reviews';

export const getProductReviews = async (productId) => {
    try {
        const response = await api.get(`${API_URL}/product/${productId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const createReview = async (productId, rating, comment) => {
    try {
        const response = await api.post(
            API_URL,
            { productId, rating, comment }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const deleteReview = async (reviewId) => {
    try {
        const response = await api.delete(
            `${API_URL}/${reviewId}`
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
