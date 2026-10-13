import axios from 'axios';

/**
 * Dynamically resolves the API base URL:
 * 1. Checks VITE_API_BASE_URL (configured in Render Static Site environment variables)
 * 2. Falls back to localhost in Vite DEV mode
 * 3. Falls back to relative '/api' in production
 */
const getBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    const raw = import.meta.env.VITE_API_BASE_URL.trim().replace(/\/+$/, '');
    return raw.endsWith('/api') ? raw : `${raw}/api`;
  }
  if (import.meta.env.DEV) {
    return 'http://localhost:8080/api';
  }
  return '/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT token if present
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

// Response interceptor: extract clean message from server
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      // 401 Unauthorized: token expired or invalid
      if (error.response.status === 401) {
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }

      const serverMsg = error.response.data?.message || 'An unexpected error occurred';
      return Promise.reject(new Error(serverMsg));
    }
    return Promise.reject(new Error('Network error: Unable to connect to backend server.'));
  }
);

export default api;
