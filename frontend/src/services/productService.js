import axios from 'axios';
const API_URL = "http://localhost:5000/api/products";

// Add timeout and better error handling
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 second timeout (increased from 10s due to slow DB queries)
});

// Interceptor to handle errors globally
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    if (error.response) {
      // Server responded with error status
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
    } else {
      // Something else happened
      console.error('Error message:', error.message);
    }
    return Promise.reject(error);
  }
);

// Get all products
export const getProducts = async () => {
  try {
    const res = await apiClient.get('/');
    return res.data;
  } catch (error) {
    console.error('Error in getProducts:', error);
    throw new Error(`Failed to fetch products: ${error.message}`);
  }
};

// Get product by ID
export const getProductById = async (id) => {
  try {
    const res = await apiClient.get(`/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error in getProductById:', error);
    throw new Error(`Failed to fetch product: ${error.message}`);
  }
};

// Add a new product (wholesaler only)
export const addProduct = async (product) => {
  try {
    const token = sessionStorage.getItem("token");
    const res = await apiClient.post('/', product, {
      headers: {
        'Authorization': `Bearer ${token}`,
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
    const token = sessionStorage.getItem("token");
    const res = await apiClient.put(`/${id}`, product, {
      headers: {
        'Authorization': `Bearer ${token}`,
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
    const token = sessionStorage.getItem("token");
    const res = await apiClient.delete(`/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.data;
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    throw new Error(`Failed to delete product: ${error.message}`);
  }
};

// Search products
export const searchProducts = async (query, category) => {
  try {
    const res = await apiClient.get('/search', {
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
    const res = await apiClient.get(`/wholesaler/${wholesalerId}`);
    return res.data;
  } catch (error) {
    console.error('Error in getProductsByWholesaler:', error);
    throw new Error(`Failed to fetch wholesaler products: ${error.message}`);
  }
};

// Get wholesaler locations for a product
export const getWholesalerLocations = async (productId) => {
  try {
    const res = await apiClient.get(`/${productId}/locations`);
    return res.data;
  } catch (error) {
    console.error('Error in getWholesalerLocations:', error);
    throw new Error(`Failed to fetch wholesaler locations: ${error.message}`);
  }
};

// Get current user's products (for wholesalers and retailers)
export const getUserProducts = async () => {
  try {
    const token = sessionStorage.getItem("token");
    const res = await apiClient.get('/my/products', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.data;
  } catch (error) {
    console.error('Error in getUserProducts:', error);
    throw new Error(`Failed to fetch user products: ${error.message}`);
  }
};