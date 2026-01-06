import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Base API URL - update this with your backend URL
const API_URL = import.meta.env.VITE_API_URL || 'https://payroll-ppmh.onrender.com/api/v1';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Create separate axios instance for auth endpoints (no token)
const authApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if it exists (for regular API calls)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle token expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const token = localStorage.getItem('token');
            const currentPath = window.location.pathname;
            
            // Don't logout if we're already on login page or if no token exists
            if (token && currentPath !== '/login') {
                console.warn('401 Unauthorized - Token may be expired or invalid');
                // Only logout and redirect after multiple 401s to avoid false positives
                // For now, just log the error and let the user continue
                // authService.logout();
                // window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

const authService = {
    // User Signup
    async signup(userData) {
        try {
            const response = await authApi.post('/auth/signup', userData);
            if (response.data.token) {
                this.setToken(response.data.token);
                this.setUser(response.data.user);
            }
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    },

    // User Login
    async login(credentials) {
        try {
            const response = await authApi.post('/auth/login', credentials);
            if (response.data.token) {
                this.setToken(response.data.token);
                this.setUser(response.data.user);
            }
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    },

    // Logout
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Set token
    setToken(token) {
        localStorage.setItem('token', token);
    },

    // Get token
    getToken() {
        return localStorage.getItem('token');
    },

    // Set user data
    setUser(user) {
        if (user && typeof user === 'object') {
            localStorage.setItem('user', JSON.stringify(user));
        }
    },

    // Get user data
    getUser() {
        const user = localStorage.getItem('user');
        if (!user || user === 'undefined' || user === 'null') {
            return null;
        }
        try {
            return JSON.parse(user);
        } catch (error) {
            console.error('Error parsing user data:', error);
            localStorage.removeItem('user');
            return null;
        }
    },

    // Check if user is authenticated
    isAuthenticated() {
        const token = this.getToken();
        if (!token) return false;

        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            return decoded.exp > currentTime;
        } catch (error) {
            return false;
        }
    },

    // Get decoded token
    getDecodedToken() {
        const token = this.getToken();
        if (!token) return null;

        try {
            return jwtDecode(token);
        } catch (error) {
            return null;
        }
    },

    // Handle API errors
    handleError(error) {
        if (error.response) {
            // Server responded with error
            const message = error.response.data?.message || error.response.data?.error || 'An error occurred';
            return new Error(message);
        } else if (error.request) {
            // Request made but no response
            return new Error('No response from server. Please check your connection.');
        } else {
            // Something else happened
            return new Error(error.message || 'An unexpected error occurred');
        }
    },
};

export default authService;
export { api };
