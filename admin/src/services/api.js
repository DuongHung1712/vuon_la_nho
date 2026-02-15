import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

// Create axios instance
const api = axios.create({
    baseURL: backendUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.token = token;
    }
    return config;
});

// ==================== PRODUCT APIs ====================
export const productApi = {
    list: () => api.get('/api/product/list'),
    single: (productId) => api.post('/api/product/single', { productId }),
    add: (formData) => {
        const token = localStorage.getItem('token');
        return api.post('/api/product/add', formData, {
            headers: { 
                'Content-Type': 'multipart/form-data',
                'token': token
            }
        });
    },
    update: (formData) => {
        const token = localStorage.getItem('token');
        return api.post('/api/product/update', formData, {
            headers: { 
                'Content-Type': 'multipart/form-data',
                'token': token
            }
        });
    },
    remove: (id) => api.post('/api/product/remove', { id }),
};

// ==================== ORDER APIs ====================
export const orderApi = {
    list: () => api.post('/api/order/list', {}),
    updateStatus: (orderId, status) => api.post('/api/order/status', { orderId, status }),
};

// ==================== AUTH APIs ====================
export const authApi = {
    adminLogin: (email, password) => api.post('/api/user/admin', { email, password }),
};

export default api;
