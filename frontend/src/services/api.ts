import axios from 'axios';

// Store reference to the current token
let currentToken = localStorage.getItem('token') || '';

// Function to get the current token from Redux store
export const getToken = () => {
  return currentToken;
};

// Function to update the token
export const setToken = (token: string) => {
  currentToken = token;
};

// Create an axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    console.log('API Request Interceptor - Token:', token);
    console.log('API Request Config:', config);
    
    if (token) {
      config.headers = config.headers || {};
      // Ensure we don't override existing headers
      if (!config.headers['Authorization']) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Added Authorization header to request');
      }
    } else {
      console.warn('No token found in request interceptor');
    }
    return config;
  },
  (error) => {
    console.error('Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 Unauthorized responses
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.status);
    return response;
  },
  async (error) => {
    console.error('API Error:', error.config?.url, error.response?.status, error.message);
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post('/api/auth/refresh-token', { refreshToken });
          const { token, user } = response.data;
          
          // Update tokens and user data
          setToken(token);
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          // Update the Authorization header
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          
          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh token fails, clear storage and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    } else if (error.response?.status === 401) {
      // If we already tried to refresh the token but still got 401, redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;
