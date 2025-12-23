import axios from 'axios';

const API_URL = "/api/auth";

// Create a custom axios instance to handle interceptors
const api = axios.create({
    baseURL: API_URL
});

// Request interceptor to add token to headers
api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("token");
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = sessionStorage.getItem("refreshToken");

                if (!refreshToken) {
                    logout();
                    window.location.href = '/login';
                    return Promise.reject(error);
                }

                // Call refresh token endpoint (Note: verify the correct endpoint path)
                // The backend middleware/auth.js defines 'refreshToken' function, 
                // but we need to check where it's mounted in routes/auth.js
                // Assuming it will be mounted at /refresh
                const res = await axios.post(`/api/auth/refresh`, { refreshToken });

                if (res.data.success) {
                    const { token, refreshToken: newRefreshToken } = res.data;

                    // Update storage
                    sessionStorage.setItem("token", token);
                    if (newRefreshToken) {
                        sessionStorage.setItem("refreshToken", newRefreshToken);
                    }

                    // Update default headers
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    originalRequest.headers['Authorization'] = `Bearer ${token}`;

                    // Retry original request
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                logout();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export const login = async (email, password) => {
    const res = await api.post(`/login`, { email, password });

    // Store tokens
    sessionStorage.setItem("token", res.data.token);
    if (res.data.refreshToken) {
        sessionStorage.setItem("refreshToken", res.data.refreshToken);
    }
    sessionStorage.setItem("user", JSON.stringify(res.data.user));

    return res.data;
};

export const signup = async (name, email, password, role, businessName = null) => {
    const payload = { name, email, password, role };

    // Add businessName for wholesalers and retailers
    if (role === 'wholesaler' || role === 'retailer') {
        if (businessName) {
            payload.businessName = businessName;
        }
        // For retailers, also set storeName to businessName if not provided
        if (role === 'retailer' && businessName) {
            payload.storeName = businessName;
        }
    }

    const res = await api.post(`/signup`, payload);

    // Helper to store session if signup automatically logs in (common pattern)
    if (res.data.token) {
        sessionStorage.setItem("token", res.data.token);
        if (res.data.refreshToken) {
            sessionStorage.setItem("refreshToken", res.data.refreshToken);
        }
        sessionStorage.setItem("user", JSON.stringify(res.data.user));
    }

    return res.data;
};

export const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("user");
};

export const updateProfile = async (userData) => {
    // Uses the intercepted 'api' instance, so headers are auto-injected
    const res = await api.put(`/me`, userData);

    // Update local storage if successful
    if (res.data.success) {
        sessionStorage.setItem("user", JSON.stringify(res.data.user));
    }
    return res.data;
};

export default api;
