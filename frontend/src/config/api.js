// centralized API configuration
// In dev the Vite proxy forwards /api -> local backend (same-origin, works in
// cloud previews). In production set VITE_BACKEND_URL to the deployed backend.
const explicit = import.meta.env.VITE_BACKEND_URL;

const API_BASE_URL = explicit
    ? `${explicit.replace(/\/api\/?$/, '').replace(/\/$/, '')}/api`
    : '/api';

export default API_BASE_URL;
