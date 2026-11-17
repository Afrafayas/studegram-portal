import { normalizeDisplayIds } from '../utils/displayId';
import axios from 'axios';
import { loadingManager } from '../utils/loadingManager';

// Reads backend API URL strictly from .env (VITE_API_BASE_URL)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to automatically attach Partner/Agent JWT token from localStorage and coordinate Unigather loading
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('partner_token') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (!config.silent && !config.headers?.['x-silent-loader']) {
      const url = String(config.url || '');
      const method = String(config.method || 'get').toLowerCase();
      const isMutation = ['post', 'put', 'patch', 'delete'].includes(method);
      const isAuth = url.includes('/login') || url.includes('/register');
      const shouldShowGlobalLoader = isMutation || isAuth || Boolean(config.fullscreen);

      if (shouldShowGlobalLoader) {
        let label = 'Processing request...';
        if (config.loadingText) {
          label = config.loadingText;
        } else if (url.includes('/partners/login') || url.includes('/login')) {
          label = 'Signing in to Agent Portal...';
        } else if (url.includes('/partners/register') || url.includes('/register')) {
          label = 'Creating partner account...';
        } else if (url.includes('/applications')) {
          label = 'Updating application...';
        } else if (url.includes('/commissions')) {
          label = 'Processing commission...';
        } else if (method === 'post') {
          label = 'Saving information...';
        } else if (method === 'put' || method === 'patch') {
          label = 'Updating records...';
        } else if (method === 'delete') {
          label = 'Removing record...';
        }
        config._loaderKey = loadingManager.start(null, label);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => {
    if (response.config?._loaderKey) {
      loadingManager.stop(response.config._loaderKey);
    }
    response.data = normalizeDisplayIds(response.data);
    return response;
  },
  (error) => {
    if (error.config?._loaderKey) {
      loadingManager.stop(error.config._loaderKey);
    }
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized partner request - Token may be expired.');
      const isAuthRequest = error.config && (
        error.config.url.includes('/login') || 
        error.config.url.includes('/register')
      );
      if (!isAuthRequest) {
        localStorage.removeItem('partner_token');
        localStorage.removeItem('partner_data');
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

export default API;
