// centralized API configuration
// Automatically switches between local and production URLs based on environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default API_BASE_URL;
