import axios from 'axios';

const api = axios.create({
  baseURL: 'https://mechanic-finder-backend-w90e.onrender.com',
});

// Automatically add the token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
