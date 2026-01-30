// centralized API configuration
// Automatically switches between local and production URLs based on environment variables
const BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000').replace(/\/api\/?$/, '').replace(/\/$/, '');
const API_BASE_URL = `${BASE_URL}/api`;

export default API_BASE_URL;
