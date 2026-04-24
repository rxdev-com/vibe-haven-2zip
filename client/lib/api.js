const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
// Auth token management
export const authToken = {
    get: ()=>localStorage.getItem("auth_token"),
    set: (token)=>localStorage.setItem("auth_token", token),
    remove: ()=>localStorage.removeItem("auth_token")
};
// User data management
export const userData = {
    get: ()=>{
        const user = localStorage.getItem("user_data");
        return user ? JSON.parse(user) : null;
    },
    set: (user)=>localStorage.setItem("user_data", JSON.stringify(user)),
    remove: ()=>localStorage.removeItem("user_data")
};
// API request wrapper
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = authToken.get();
    const config = {
        headers: {
            "Content-Type": "application/json",
            ...token && {
                Authorization: `Bearer ${token}`
            },
            ...options.headers
        },
        ...options
    };
    try {
        const response = await fetch(url, config);
        const data = await response.json();
        if (!response.ok) {
            // Check if it's a database unavailable error
            if (response.status === 503 && data.error === "Database not available") {
                const dbError = new Error("Database features not available in development mode");
                dbError.isDatabaseError = true;
                throw dbError;
            }
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }
        return data;
    } catch (error) {
        console.error("API request failed:", error);
        throw error;
    }
}
// Auth API
export const authAPI = {
    register: (userData)=>apiRequest("/auth/register", {
            method: "POST",
            body: JSON.stringify(userData)
        }),
    login: (credentials)=>apiRequest("/auth/login", {
            method: "POST",
            body: JSON.stringify(credentials)
        }),
    getProfile: ()=>apiRequest("/auth/me"),
    updateProfile: (updates)=>apiRequest("/auth/profile", {
            method: "PUT",
            body: JSON.stringify(updates)
        })
};
// Materials API
export const materialsAPI = {
    getAll: (params = {})=>{
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value])=>{
            if (value !== undefined && value !== null) {
                searchParams.append(key, value.toString());
            }
        });
        return apiRequest(`/materials?${searchParams.toString()}`);
    },
    getById: (id)=>apiRequest(`/materials/${id}`),
    create: (materialData)=>apiRequest("/materials", {
            method: "POST",
            body: JSON.stringify(materialData)
        }),
    update: (id, updates)=>apiRequest(`/materials/${id}`, {
            method: "PUT",
            body: JSON.stringify(updates)
        }),
    delete: (id)=>apiRequest(`/materials/${id}`, {
            method: "DELETE"
        }),
    getBySupplier: (supplierId, params = {})=>{
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value])=>{
            if (value !== undefined && value !== null) {
                searchParams.append(key, value.toString());
            }
        });
        return apiRequest(`/materials/supplier/${supplierId}?${searchParams.toString()}`);
    }
};
// Orders API
export const ordersAPI = {
    getAll: (params = {})=>{
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value])=>{
            if (value !== undefined && value !== null) {
                searchParams.append(key, value.toString());
            }
        });
        return apiRequest(`/orders?${searchParams.toString()}`);
    },
    getById: (id)=>apiRequest(`/orders/${id}`),
    create: (orderData)=>apiRequest("/orders", {
            method: "POST",
            body: JSON.stringify(orderData)
        }),
    updateStatus: (id, status, supplierNotes)=>apiRequest(`/orders/${id}/status`, {
            method: "PUT",
            body: JSON.stringify({
                status,
                supplierNotes
            })
        }),
    cancel: (id, cancellationReason)=>apiRequest(`/orders/${id}/cancel`, {
            method: "PUT",
            body: JSON.stringify({
                cancellationReason
            })
        }),
    rate: (id, rating)=>apiRequest(`/orders/${id}/rate`, {
            method: "PUT",
            body: JSON.stringify(rating)
        })
};
// Health check
export const healthAPI = {
    ping: ()=>apiRequest("/ping")
};
export default {
    auth: authAPI,
    materials: materialsAPI,
    orders: ordersAPI,
    health: healthAPI
};
