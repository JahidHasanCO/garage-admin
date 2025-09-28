import axios from 'axios';
import { API_URL } from '../constants/api';

// Create axios instance with default config
const garageAPI = axios.create({
  baseURL: `${API_URL}/garages`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
garageAPI.interceptors.request.use(
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
garageAPI.interceptors.response.use(
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


// Helper function to prepare garage form data
const prepareGarageFormData = (garageData) => {
  const formData = new FormData();
  
  // Add basic garage fields
  formData.append('name', garageData.name || '');
  formData.append('address', garageData.address || '');
  formData.append('city', garageData.city || '');
  formData.append('country', garageData.country || 'Bangladesh');
  
  // Add geo coordinates
  if (garageData.geo?.lat) {
    formData.append('geo[lat]', garageData.geo.lat);
  }
  if (garageData.geo?.lng) {
    formData.append('geo[lng]', garageData.geo.lng);
  }
  
  // Add contact information
  if (garageData.contact?.phone) {
    formData.append('contact[phone]', garageData.contact.phone);
  }
  if (garageData.contact?.email) {
    formData.append('contact[email]', garageData.contact.email);
  }
  
  // Add supported manufacturers array
  if (garageData.supportedManufacturers && Array.isArray(garageData.supportedManufacturers)) {
    garageData.supportedManufacturers.forEach(manufacturerId => {
      formData.append('supportedManufacturers[]', manufacturerId);
    });
  }
  
  // Add supported fuel types array
  if (garageData.supportedFuelTypes && Array.isArray(garageData.supportedFuelTypes)) {
    garageData.supportedFuelTypes.forEach(fuelTypeId => {
      formData.append('supportedFuelTypes[]', fuelTypeId);
    });
  }
  
  return formData;
};

// Get all garages with pagination and search
export const getAllGarages = async (page = 1, limit = 10, search = '') => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (search.trim()) {
      params.append('search', search.trim());
    }

    const response = await garageAPI.get(`/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching garages:', error);
    throw error;
  }
};

// Get garage by ID
export const getGarageById = async (id) => {
  try {
    const response = await garageAPI.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching garage:', error);
    throw error;
  }
};

// Create new garage
export const createGarage = async (garageData) => {
  try {
    const formData = prepareGarageFormData(garageData);

    const response = await garageAPI.post('/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating garage:', error);
    throw error;
  }
};

// Update garage
export const updateGarage = async (id, garageData) => {
  try {
    const formData = prepareGarageFormData(garageData);

    const response = await garageAPI.put(`/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error updating garage:', error);
    throw error;
  }
};

// Delete garage
export const deleteGarage = async (id) => {
  try {
    const response = await garageAPI.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting garage:', error);
    throw error;
  }
};

// Get garages for selector (simplified data)
export const getGaragesForSelector = async (page = 1, limit = 12, search = '') => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (search.trim()) {
      params.append('search', search.trim());
    }

    const response = await garageAPI.get(`/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching garages for selector:', error);
    throw error;
  }
};