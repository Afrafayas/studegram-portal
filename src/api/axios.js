import axios from 'axios';

// Reads backend API URL strictly from .env (VITE_API_BASE_URL)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to automatically attach Partner/Agent JWT token from localStorage
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('partner_token') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized partner request - Token may be expired.');
    }
    return Promise.reject(error);
  }
);

export default API;
