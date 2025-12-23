import api from './authService';
const API_URL = "/api/products";

// Helper for long timeout requests
const config = {
  timeout: 30000
};

// Get all products
export const getProducts = async () => {
  try {
    const res = await api.get(`${API_URL}/`, config);
    return res.data;
  } catch (error) {
    console.error('Error in getProducts:', error);
    throw new Error(`Failed to fetch products: ${error.message}`);
  }
};

// Get product by ID
export const getProductById = async (id) => {
  try {
    const res = await api.get(`${API_URL}/${id}`, config);
    return res.data;
  } catch (error) {
    console.error('Error in getProductById:', error);
    throw new Error(`Failed to fetch product: ${error.message}`);
  }
};

// Add a new product (wholesaler only)
export const addProduct = async (product) => {
  try {
    const res = await api.post(`${API_URL}/`, product, {
      ...config,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return res.data;
  } catch (error) {
    console.error('Error in addProduct:', error);
    throw new Error(`Failed to add product: ${error.message}`);
  }
};

// Update a product (wholesaler only)
export const updateProduct = async (id, product) => {
  try {
    const res = await api.put(`${API_URL}/${id}`, product, {
      ...config,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return res.data;
  } catch (error) {
    console.error('Error in updateProduct:', error);
    throw new Error(`Failed to update product: ${error.message}`);
  }
};

// Delete a product (wholesaler only)
export const deleteProduct = async (id) => {
  try {
    const res = await api.delete(`${API_URL}/${id}`, config);
    return res.data;
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    throw new Error(`Failed to delete product: ${error.message}`);
  }
};

// Search products
export const searchProducts = async (query, category) => {
  try {
    const res = await api.get(`${API_URL}/search`, {
      ...config,
      params: { query, category }
    });
    return res.data;
  } catch (error) {
    console.error('Error in searchProducts:', error);
    throw new Error(`Failed to search products: ${error.message}`);
  }
};

// Get products by wholesaler
export const getProductsByWholesaler = async (wholesalerId) => {
  try {
    const res = await api.get(`${API_URL}/wholesaler/${wholesalerId}`, config);
    return res.data;
  } catch (error) {
    console.error('Error in getProductsByWholesaler:', error);
    throw new Error(`Failed to fetch wholesaler products: ${error.message}`);
  }
};

// Get wholesaler locations for a product
export const getWholesalerLocations = async (productId) => {
  try {
    const res = await api.get(`${API_URL}/${productId}/locations`, config);
    return res.data;
  } catch (error) {
    console.error('Error in getWholesalerLocations:', error);
    throw new Error(`Failed to fetch wholesaler locations: ${error.message}`);
  }
};

// Get current user's products (for wholesalers and retailers)
export const getUserProducts = async () => {
  try {
    const res = await api.get(`${API_URL}/my/products`, config);
    return res.data;
  } catch (error) {
    console.error('Error in getUserProducts:', error);
    throw new Error(`Failed to fetch user products: ${error.message}`);
  }
};