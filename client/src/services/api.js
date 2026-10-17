import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

//Upon rejected/expired token, clear it and go to login
API.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url || "";
    const isAuthForm = url.includes("/auth/login") || url.includes("/auth/register");
    if (err.response?.status === 401 && !isAuthForm) {
      localStorage.removeItem("token");
      if (!["/login", "/register"].includes(window.location.pathname)) {
        window.location.assign("/login");
      }
    }
    return Promise.reject(err);
  }
);

const clean = (params = {}) =>
  Object.fromEntries(Object.entries(params).filter(([, v]) => v !== "" && v != null));

// Auth
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");

// Products
export const getProducts = (params) => API.get("/products", { params: clean(params) });
export const getCategories = () => API.get("/products/categories");
export const getProduct = (id) => API.get(`/products/${id}`);
export const addProduct = (data) => API.post("/products", data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// Orders
export const placeOrder = (data) => API.post("/orders", data);
export const getMyOrders = () => API.get("/orders/my");
export const getAllOrders = () => API.get("/orders");
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { status });

export const getErrorMessage = (err) =>
  err.response?.data?.message || "Cannot reach the server :(";