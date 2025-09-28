import axios from "axios";
import { API_URL } from "../constants/api.js";

// Create axios instance with default config
const manufacturersAPI = axios.create({
  baseURL: `${API_URL}/manufacturers`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
manufacturersAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
manufacturersAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Manufacturers API methods
export const manufacturersService = {
  // Get all manufacturers
  getAllManufacturers: async (page = 1, limit = 10, search = '') => {
    try {
      const params = { page, limit };
      if (search) params.search = search;
      
      const response = await manufacturersAPI.get('/', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch manufacturers');
    }
  },

  // Get single manufacturer by ID
  getManufacturerById: async (id) => {
    try {
      const response = await manufacturersAPI.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch manufacturer');
    }
  },

  // Create new manufacturer
  createManufacturer: async (manufacturerData) => {
    try {
      const response = await manufacturersAPI.post('/', manufacturerData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create manufacturer');
    }
  },

  // Update manufacturer
  updateManufacturer: async (id, manufacturerData) => {
    try {
      const response = await manufacturersAPI.put(`/${id}`, manufacturerData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update manufacturer');
    }
  },

  // Delete manufacturer
  deleteManufacturer: async (id) => {
    try {
      const response = await manufacturersAPI.delete(`/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete manufacturer');
    }
  },

  // Upload manufacturer logo
  uploadLogo: async (file) => {
    try {
      const formData = new FormData();
      formData.append('logo', file);
      
      const response = await manufacturersAPI.post('/upload-logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to upload logo');
    }
  },
};

// Helper function to prepare form data for API submission
export const prepareManufacturerFormData = (formData, logoFile) => {
  const data = new FormData();
  
  data.append('name', formData.name);
  data.append('country', formData.country);
  
  if (formData.founded) data.append('founded', formData.founded.toString());
  if (formData.website) data.append('website', formData.website);
  if (logoFile) data.append('logo', logoFile);
  
  return data;
};