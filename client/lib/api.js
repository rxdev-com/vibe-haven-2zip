const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const authToken = {
  get: () => localStorage.getItem("auth_token"),
  set: (token) => localStorage.setItem("auth_token", token),
  remove: () => localStorage.removeItem("auth_token"),
};

export const userData = {
  get: () => {
    const u = localStorage.getItem("user_data");
    return u ? JSON.parse(u) : null;
  },
  set: (u) => localStorage.setItem("user_data", JSON.stringify(u)),
  remove: () => localStorage.removeItem("user_data"),
};

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = authToken.get();
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };
  let response;
  try {
    response = await fetch(url, config);
  } catch (e) {
    const err = new Error("Network error - is the backend running?");
    err.isNetworkError = true;
    throw err;
  }
  let data = null;
  try {
    data = await response.json();
  } catch (e) {
    data = {};
  }
  if (!response.ok) {
    const err = new Error(data?.error || data?.message || `Request failed (${response.status})`);
    err.status = response.status;
    err.payload = data;
    throw err;
  }
  return data;
}

const qs = (params = {}) => {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") sp.append(k, String(v));
  });
  const s = sp.toString();
  return s ? `?${s}` : "";
};

export const authAPI = {
  register: (data) => apiRequest("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data) => apiRequest("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  me: () => apiRequest("/auth/me"),
  updateProfile: (updates) => apiRequest("/auth/profile", { method: "PUT", body: JSON.stringify(updates) }),
  logout: () => apiRequest("/auth/logout", { method: "POST" }),
  resendVerification: () => apiRequest("/auth/resend-verification", { method: "POST" }),
};

export const materialsAPI = {
  getAll: (params) => apiRequest(`/materials${qs(params)}`),
  getById: (id) => apiRequest(`/materials/${id}`),
  getBySupplier: (supplierId, params) => apiRequest(`/materials/supplier/${supplierId}${qs(params)}`),
  create: (data) => apiRequest("/materials", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/materials/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/materials/${id}`, { method: "DELETE" }),
};

export const ordersAPI = {
  getAll: (params) => apiRequest(`/orders${qs(params)}`),
  getById: (id) => apiRequest(`/orders/${id}`),
  create: (data) => apiRequest("/orders", { method: "POST", body: JSON.stringify(data) }),
  updateStatus: (id, status, note) =>
    apiRequest(`/orders/${id}/status`, { method: "PUT", body: JSON.stringify({ status, note, supplierNotes: note }) }),
  cancel: (id, cancellationReason) =>
    apiRequest(`/orders/${id}/cancel`, { method: "PUT", body: JSON.stringify({ cancellationReason }) }),
  rate: (id, rating) => apiRequest(`/orders/${id}/rate`, { method: "PUT", body: JSON.stringify(rating) }),
  getStats: () => apiRequest("/orders/stats/summary"),
};

export const notificationsAPI = {
  getAll: () => apiRequest("/notifications"),
  markRead: (id) => apiRequest(`/notifications/${id}/read`, { method: "PUT" }),
  markAllRead: () => apiRequest("/notifications/read-all", { method: "PUT" }),
  remove: (id) => apiRequest(`/notifications/${id}`, { method: "DELETE" }),
  clear: () => apiRequest("/notifications/clear", { method: "DELETE" }),
};

export const cartAPI = {
  get: () => apiRequest("/cart"),
  add: (materialId, quantity = 1) =>
    apiRequest("/cart", { method: "POST", body: JSON.stringify({ materialId, quantity }) }),
  update: (materialId, quantity) =>
    apiRequest(`/cart/${materialId}`, { method: "PUT", body: JSON.stringify({ quantity }) }),
  remove: (materialId) => apiRequest(`/cart/${materialId}`, { method: "DELETE" }),
  clear: () => apiRequest("/cart", { method: "DELETE" }),
};

export const savedAPI = {
  getAll: () => apiRequest("/saved"),
  add: (materialId) => apiRequest(`/saved/${materialId}`, { method: "POST" }),
  remove: (materialId) => apiRequest(`/saved/${materialId}`, { method: "DELETE" }),
};

export const usersAPI = {
  suppliers: (params) => apiRequest(`/users/suppliers${qs(params)}`),
  getById: (id) => apiRequest(`/users/${id}`),
};

export const paymentsAPI = {
  createIntent: (data) => apiRequest("/payments/create-intent", { method: "POST", body: JSON.stringify(data) }),
  confirm: (paymentIntentId) => apiRequest("/payments/confirm", { method: "POST", body: JSON.stringify({ paymentIntentId }) }),
};

export const healthAPI = {
  ping: () => apiRequest("/ping"),
};

export default {
  auth: authAPI,
  materials: materialsAPI,
  orders: ordersAPI,
  notifications: notificationsAPI,
  cart: cartAPI,
  saved: savedAPI,
  users: usersAPI,
  payments: paymentsAPI,
  health: healthAPI,
};
