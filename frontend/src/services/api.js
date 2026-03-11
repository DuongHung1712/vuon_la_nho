import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

// Create axios instance with default config
const api = axios.create({
  baseURL: backendUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.token = token;
  }
  return config;
});

// ==================== USER APIs ====================
export const userApi = {
  register: (data) => api.post("/api/user/register", data),
  login: (data) => api.post("/api/user/login", data),
  profile: () => api.get("/api/user/profile"),
  updateProfile: (data) => {
    const headers =
      data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {};
    return api.put("/api/user/profile", data, { headers });
  },
  adminLogin: (data) => api.post("/api/user/admin", data),
  sendVerificationEmail: () => api.post("/api/user/send-verification"),
  verifyEmail: (token) => api.post("/api/user/verify-email", { token }),
  forgotPassword: (email) => api.post("/api/user/forgot-password", { email }),
  resetPassword: (token, password) =>
    api.post("/api/user/reset-password", { token, password }),
};

// ==================== PRODUCT APIs ====================
export const productApi = {
  list: () => api.get("/api/product/list"),
  single: (productId) => api.post("/api/product/single", { productId }),
  add: (data) => api.post("/api/product/add", data),
  remove: (id) => api.post("/api/product/remove", { id }),
  suggest: (data) => api.post("/api/product/suggest", data),
};

// ==================== CART APIs ====================
export const cartApi = {
  get: () => api.post("/api/cart/get", {}),
  add: (itemId, quantity, size) =>
    api.post("/api/cart/add", { itemId, quantity, size }),
  update: (itemId, quantity, size) =>
    api.post("/api/cart/update", { itemId, quantity, size }),
};

// ==================== ORDER APIs ====================
export const orderApi = {
  place: (data) => api.post("/api/order/place", data),
  userOrders: () => api.post("/api/order/userorders", {}),
  allOrders: () => api.post("/api/order/list", {}),
  updateStatus: (orderId, status) =>
    api.post("/api/order/status", { orderId, status }),
};

// ==================== DISEASE DETECTION APIs ====================
export const diseaseApi = {
  detect: (formData) =>
    api.post("/api/disease-detection/detect", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

// ==================== REVIEW APIs ====================
export const reviewApi = {
  list: (productId, page = 1, limit = 10) =>
    api.post(`/api/review/list?page=${page}&limit=${limit}`, { productId }),
  add: (data) => api.post("/api/review/add", data),
  update: (data) => api.post("/api/review/update", data),
  delete: (reviewId) => api.post("/api/review/delete", { reviewId }),
  check: (productId) => api.post("/api/review/check", { productId }),
};

export default api;
