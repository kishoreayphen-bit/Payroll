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
        console.log('API Request to:', config.url);
        console.log('Token exists:', !!token);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Authorization header set:', `Bearer ${token.substring(0, 20)}...`);
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
        const status = error.response?.status;
        const currentPath = window.location.pathname;
        const token = localStorage.getItem('token');
        
        // Only redirect on 401 if it's a true auth failure (not just missing endpoint)
        // Check if the error message indicates token/auth issue specifically
        const isAuthError = error.response?.data?.message?.toLowerCase()?.includes('token') ||
                           error.response?.data?.message?.toLowerCase()?.includes('unauthorized') ||
                           error.response?.data?.message?.toLowerCase()?.includes('expired') ||
                           error.response?.data?.error?.toLowerCase()?.includes('jwt');
        
        if (status === 401 && isAuthError) {
            // Don't logout if we're already on login/signup page or if no token exists
            if (token && currentPath !== '/login' && currentPath !== '/signup') {
                console.warn('401 Unauthorized - Auth error, redirecting to login...');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('selectedOrganizationId');
                window.location.href = '/login';
            }
        } else if (status === 401) {
            // Log but don't redirect - might be endpoint-specific auth issue
            console.warn('401 received but not redirecting - may be endpoint-specific:', error.config?.url);
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
