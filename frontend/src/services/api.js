import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';
// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
});

// Attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// ─── Auth ────────────────────────────────────────

export const registerUser = (username, password) =>
  api.post('/register/', { username, password });

export const loginUser = (username, password) =>
  api.post('/login/', { username, password });

// ─── Subscriptions ───────────────────────────────

export const getSubscriptions = () => api.get('/subscriptions/');

export const createSubscription = (data) => api.post('/subscriptions/', data);

export const updateSubscription = (id, data) => api.put(`/subscriptions/${id}/`, data);

export const deleteSubscription = (id) => api.delete(`/subscriptions/${id}/`);

export const getSummary = () => api.get('/subscriptions/summary/');

export default api;
