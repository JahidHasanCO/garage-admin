import axios from "axios";
import { API_URL } from "../constants/api.js";

// Create axios instance with default config
const fuelTypesAPI = axios.create({
  baseURL: `${API_URL}/fuel-types`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
fuelTypesAPI.interceptors.request.use(
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
fuelTypesAPI.interceptors.response.use(
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

// Fuel Types API methods
export const fuelTypesService = {
  // Get all fuel types
  getAllFuelTypes: async (page = 1, limit = 10, search = '') => {
    try {
      const params = { page, limit };
      if (search) params.search = search;
      
      const response = await fuelTypesAPI.get('/', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch fuel types');
    }
  },

  // Get single fuel type by ID
  getFuelTypeById: async (id) => {
    try {
      const response = await fuelTypesAPI.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch fuel type');
    }
  },

  // Create new fuel type
  createFuelType: async (fuelTypeData) => {
    try {
      const response = await fuelTypesAPI.post('/', fuelTypeData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create fuel type');
    }
  },

  // Update fuel type
  updateFuelType: async (id, fuelTypeData) => {
    try {
      const response = await fuelTypesAPI.put(`/${id}`, fuelTypeData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update fuel type');
    }
  },

  // Delete fuel type
  deleteFuelType: async (id) => {
    try {
      const response = await fuelTypesAPI.delete(`/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete fuel type');
    }
  },

  // Upload fuel type image
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fuelTypesAPI.post('/upload-image', formData, {
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
export const prepareFuelTypeFormData = (formData, imageFile) => {
  const data = new FormData();
  
  data.append('title', formData.title);
  data.append('value', formData.value);
  
  if (imageFile) data.append('image', imageFile);
  
  return data;
};