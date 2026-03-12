import axios from 'axios';

// Use a relative base so the dev proxy or production server handles the host/port
const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem('adminToken');
  const token = localStorage.getItem('token');
  // Prefer admin token for admin operations, otherwise use volunteer token
  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  } else if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid tokens
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
      // Redirect to login if needed. Admin pages use the static admin-login.html
      if (window.location.pathname.includes('/admin')) {
        window.location.href = '/admin-login.html';
      } else {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const volunteerAPI = {
  register: (data) => api.post('/volunteers/register', data),
  login: (data) => api.post('/volunteers/login', data),
  getVolunteers: () => api.get('/volunteers'),
  getVolunteerById: (id) => api.get(`/volunteers/${id}`),
  getMe: () => api.get('/volunteers/me'),
  updateMe: (data) => api.put('/volunteers/me', data),
};

export const adminAPI = {
  login: (data) => api.post('/admin/login', data),
};

export const eventAPI = {
  getEvents: () => api.get('/events'),
  createEvent: (data) => api.post('/events', data),
  updateEvent: (id, data) => api.put(`/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/events/${id}`),
};

export const announcementAPI = {
  getAnnouncements: () => api.get('/announcements'),
  createAnnouncement: (data) => api.post('/announcements', data),
  updateAnnouncement: (id, data) => api.put(`/announcements/${id}`, data),
  deleteAnnouncement: (id) => api.delete(`/announcements/${id}`),
};

export default api;
