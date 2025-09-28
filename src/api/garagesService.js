// Garage API service
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
    console.log('Garage API request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('Garage API request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
garageAPI.interceptors.response.use(
  (response) => {
    console.log('Garage API response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Garage API response error:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);


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
    console.log('Creating garage with data:', garageData);
    
    const response = await garageAPI.post('/', garageData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Create garage response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating garage:', error);
    throw error;
  }
};

// Update garage
export const updateGarage = async (id, garageData) => {
  try {
    console.log('Updating garage with data:', garageData);
    
    const response = await garageAPI.put(`/${id}`, garageData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Update garage response:', response.data);
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