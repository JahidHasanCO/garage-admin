import axios from "axios";
import { API_URL } from "../constants/api.js";

// Create axios instance with default config
const partsAPI = axios.create({
  baseURL: `${API_URL}/parts`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
partsAPI.interceptors.request.use(
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
partsAPI.interceptors.response.use(
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

// Parts API methods
export const partsService = {
  // Get all parts
  getAllParts: async (page = 1, limit = 10, search = '') => {
    try {
      const params = { page, limit };
      if (search) params.search = search;
      
      const response = await partsAPI.get('/', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch parts');
    }
  },

  // Get single part by ID
  getPartById: async (id) => {
    try {
      const response = await partsAPI.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch part');
    }
  },

  // Create new part
  createPart: async (partData) => {
    try {
      const response = await partsAPI.post('/', partData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create part');
    }
  },

  // Update part
  updatePart: async (id, partData) => {
    try {
      const response = await partsAPI.put(`/${id}`, partData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update part');
    }
  },

  // Delete part
  deletePart: async (id) => {
    try {
      const response = await partsAPI.delete(`/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete part');
    }
  },

  // Upload part image
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await partsAPI.post('/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to upload image');
    }
  },
};

// Helper function to prepare form data for API submission
export const preparePartFormData = (formData, imageFile) => {
  const data = new FormData();
  
  data.append('name', formData.name);
  data.append('price', formData.price);
  
  if (formData.sku) data.append('sku', formData.sku);
  if (formData.description) data.append('description', formData.description);
  if (imageFile) data.append('image', imageFile);
  
  return data;
};