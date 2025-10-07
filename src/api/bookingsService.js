import axios from 'axios';
import { API_URL } from '../constants/api';

const api = axios.create({
  baseURL: `${API_URL}/bookings`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const getAllBookings = async (page = 1, limit = 10, filters = {}) => {
  try {
    const params = { page, limit, ...filters };
    const response = await api.get('/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

export const getBookingById = async (id) => {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching booking:', error);
    throw error;
  }
};

export const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/', bookingData);
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const updateBooking = async (id, bookingData) => {
  try {
    const response = await api.put(`/${id}`, bookingData);
    return response.data;
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
};

export const deleteBooking = async (id) => {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
};

export const getBookingsForSelector = async (page = 1, limit = 12, search = '') => {
  try {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (search.trim()) params.append('search', search.trim());
    const response = await api.get(`/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching bookings for selector:', error);
    throw error;
  }
};
