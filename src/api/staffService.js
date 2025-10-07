import axios from 'axios';
import { API_URL } from '../constants/api';

// Create axios instance for staff API
const staffAPI = axios.create({
  baseURL: `${API_URL}/staff`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
staffAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for common error handling
staffAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Get all staff with pagination and optional filters
export const getAllStaff = async (page = 1, limit = 10, filters = {}) => {
  try {
    const params = { page, limit, ...filters };
    const response = await staffAPI.get('/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching staff:', error);
    throw error;
  }
};

// Get staff by ID
export const getStaffById = async (id) => {
  try {
    const response = await staffAPI.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching staff:', error);
    throw error;
  }
};

// Create new staff (accepts JSON body)
export const createStaff = async (staffData) => {
  try {
    const response = await staffAPI.post('/', staffData, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating staff:', error);
    throw error;
  }
};

// Update staff
export const updateStaff = async (id, staffData) => {
  try {
    const response = await staffAPI.put(`/${id}`, staffData, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating staff:', error);
    throw error;
  }
};

// Delete staff
export const deleteStaff = async (id) => {
  try {
    const response = await staffAPI.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting staff:', error);
    throw error;
  }
};

// Get staff for selector (simplified data)
export const getStaffForSelector = async (page = 1, limit = 12, search = '') => {
  try {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (search.trim()) params.append('search', search.trim());
    const response = await staffAPI.get(`/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching staff for selector:', error);
    throw error;
  }
};
