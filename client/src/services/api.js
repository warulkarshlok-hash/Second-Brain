import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' && window.location.port === '5173'
    ? 'http://localhost:5000/api'
    : '/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let tokenGetter = null;
let userGetter = null;

export const setAuthTokenGetter = (fn, userFn) => {
  tokenGetter = fn;
  userGetter = userFn;
};

// Request interceptor to attach Bearer token and user info
api.interceptors.request.use(
  async (config) => {
    try {
      if (tokenGetter) {
        const token = await tokenGetter();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      if (userGetter) {
        const user = userGetter();
        if (user) {
          config.headers['x-user-id'] = user.sub;
          config.headers['x-user-email'] = user.email || '';
          config.headers['x-user-name'] = user.name || '';
          config.headers['x-user-picture'] = user.picture || '';
        }
      }
    } catch (err) {
      // Continue even if token fetch fails
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for clear errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
