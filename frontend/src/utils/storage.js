// Storage utility to use sessionStorage for per-tab sessions
// This allows multiple users to be logged in different tabs simultaneously

export const storage = {
    setItem: (key, value) => {
        sessionStorage.setItem(key, value);
    },

    getItem: (key) => {
        return sessionStorage.getItem(key);
    },

    removeItem: (key) => {
        sessionStorage.removeItem(key);
    },

    clear: () => {
        sessionStorage.clear();
    }
};

// Helper to get auth token
export const getAuthToken = () => {
    return storage.getItem('token');
};

// Helper to get user data
export const getUserData = () => {
    const user = storage.getItem('user');
    return user ? JSON.parse(user) : null;
};

// Helper to set user session
export const setUserSession = (token, user) => {
    storage.setItem('token', token);
    storage.setItem('user', JSON.stringify(user));
};

// Helper to clear user session
export const clearUserSession = () => {
    storage.removeItem('token');
    storage.removeItem('user');
};

export default storage;
