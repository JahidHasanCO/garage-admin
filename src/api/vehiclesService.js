import axios from "axios";
import { API_URL } from "../constants/api.js";

// Create axios instance with default config
const vehiclesAPI = axios.create({
  baseURL: `${API_URL}/vehicles`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
vehiclesAPI.interceptors.request.use(
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
vehiclesAPI.interceptors.response.use(
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

// Vehicles API methods
export const vehiclesService = {
  // Get all vehicles
  getAllVehicles: async (page = 1, limit = 10, search = '') => {
    try {
      const params = { page, limit };
      if (search) params.search = search;
      
      const response = await vehiclesAPI.get('/', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch vehicles');
    }
  },

  // Get single vehicle by ID
  getVehicleById: async (id) => {
    try {
      const response = await vehiclesAPI.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch vehicle');
    }
  },

  // Create new vehicle
  createVehicle: async (vehicleData) => {
    try {
      const response = await vehiclesAPI.post('/', vehicleData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create vehicle');
    }
  },

  // Update vehicle
  updateVehicle: async (id, vehicleData) => {
    try {
      const response = await vehiclesAPI.put(`/${id}`, vehicleData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update vehicle');
    }
  },

  // Delete vehicle
  deleteVehicle: async (id) => {
    try {
      const response = await vehiclesAPI.delete(`/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete vehicle');
    }
  },

  // Upload vehicle image
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await vehiclesAPI.post('/upload-image', formData, {
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
export const prepareVehicleFormData = (formData, imageFile) => {
  const data = new FormData();
  
  data.append('manufacturer', formData.manufacturer);
  data.append('model', formData.model);
  data.append('year', formData.year.toString());
  data.append('license_plate', formData.license_plate);
  data.append('color', formData.color);
  data.append('mileage', formData.mileage.toString());
  data.append('fuel_type', formData.fuel_type);
  data.append('transmission', formData.transmission);
  
  if (formData.vin) data.append('vin', formData.vin);
  if (formData.description) data.append('description', formData.description);
  if (imageFile) data.append('image', imageFile);
  
  return data;
};