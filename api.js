import axios from 'axios';

// 1. Create an Axios instance pointing to your Flask Backend
// src/api.js
const API = axios.create({
  baseURL: 'http://127.0.0.1:5000/api', 
});

// 2. JWT Interceptor: Automatically attaches your "Security Pass" to every request
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 3. Reusable API Functions
export const authAPI = {
  login: (credentials) => API.post('/login', credentials),
  register: (userData) => API.post('/register', userData),
};

export const productAPI = {
  getAll: () => API.get('/products'),
};

export const checkoutAPI = {
  // Sends cart items to Flask to get the Paynow Redirect Link
  startPayment: (orderData) => API.post('/checkout', orderData),
  
  // Updated to match your backend Paynow update logic
  // This checks if the user has actually finished paying
  checkStatus: (pollUrl) => API.post('/paynow-update', { pollurl: pollUrl }),
};

export default API;
