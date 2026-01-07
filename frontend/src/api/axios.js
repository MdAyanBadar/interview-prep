import axios from "axios";

// Support both VITE_API_URL and VITE_API_BASE_URL for compatibility
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
                     import.meta.env.VITE_API_URL || 
                     "http://localhost:5050/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Return successful responses as-is
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error("Network error:", error.message);
      return Promise.reject({
        response: {
          data: { message: "Network error. Please check your connection." },
          status: 0
        }
      });
    }

    // Handle 401 Unauthorized (token expired/invalid)
    if (error.response?.status === 401) {
      // Optionally clear token and redirect to login
      localStorage.removeItem("token");
    }

    // Return error response for component-level handling
    return Promise.reject(error);
  }
);

export default api;