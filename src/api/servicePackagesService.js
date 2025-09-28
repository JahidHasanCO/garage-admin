// Service Package API service
import axios from 'axios';
import { API_URL } from '../constants/api';

// Create axios instance with default config
const servicePackageAPI = axios.create({
  baseURL: `${API_URL}/service-packages`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
servicePackageAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Set appropriate content type based on data
    if (config.data instanceof FormData) {
      // Let the browser set Content-Type for FormData (includes boundary)
      delete config.headers['Content-Type'];
    }
    
    console.log('Service Package API request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('Service Package API request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
servicePackageAPI.interceptors.response.use(
  (response) => {
    console.log('Service Package API response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Service Package API response error:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Get all service packages with pagination and search
export const getAllServicePackages = async (page = 1, limit = 10, search = '') => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (search.trim()) {
      params.append('search', search.trim());
    }

    const response = await servicePackageAPI.get(`/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching service packages:', error);
    throw error;
  }
};

// Get single service package by ID
export const getServicePackageById = async (id) => {
  try {
    const response = await servicePackageAPI.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching service package:', error);
    throw error;
  }
};

// Create service package
export const createServicePackage = async (servicePackageData) => {
  try {
    console.log('Creating service package with data:', servicePackageData);
    const response = await servicePackageAPI.post('/', servicePackageData);
    console.log('Service package created successfully:', response.data);
    return response;
  } catch (error) {
    console.error('Error creating service package:', error);
    throw error;
  }
};

// Update service package
export const updateServicePackage = async (id, servicePackageData) => {
  try {
    console.log(`Updating service package ${id} with data:`, servicePackageData);
    const response = await servicePackageAPI.put(`/${id}`, servicePackageData);
    console.log('Service package updated successfully:', response.data);
    return response;
  } catch (error) {
    console.error(`Error updating service package ${id}:`, error);
    throw error;
  }
};

// Delete service package
export const deleteServicePackage = async (id) => {
  try {
    const response = await servicePackageAPI.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting service package:', error);
    throw error;
  }
};

// Helper function to prepare form data for API submission
export const prepareServicePackageFormData = (formData, imageFile) => {
  const data = new FormData();
  
  data.append('name', formData.name);
  data.append('price', formData.price.toString());
  data.append('services', JSON.stringify(formData.services));
  data.append('garages', JSON.stringify(formData.garages));
  data.append('applicableManufacturers', JSON.stringify(formData.applicableManufacturers));
  data.append('applicableFuelTypes', JSON.stringify(formData.applicableFuelTypes));
  
  if (formData.description) data.append('description', formData.description);
  if (formData.duration) data.append('duration', formData.duration.toString());
  if (imageFile) data.append('image', imageFile);
  
  return data;
};

// Get service packages for selector (simplified data)
export const getServicePackagesForSelector = async (page = 1, limit = 12, search = '') => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (search.trim()) {
      params.append('search', search.trim());
    }

    const response = await servicePackageAPI.get(`/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching service packages for selector:', error);
    throw error;
  }
};