import axios from 'axios';
import { API_URL } from '../constants/api';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: API_URL,
});


// Request interceptor to add auth token
api.interceptors.request.use(
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
api.interceptors.response.use(
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

// Helper function to prepare service form data
const prepareServiceFormData = (serviceData) => {
    const formData = new FormData();

    // Add basic service fields
    formData.append('name', serviceData.name || '');
    formData.append('description', serviceData.description || '');
    formData.append('price', serviceData.price || 0);
    formData.append('estimated_time', serviceData.estimated_time || 0);
    formData.append('discount', serviceData.discount || 0);

    // Add parts_needed array
    if (serviceData.parts_needed && Array.isArray(serviceData.parts_needed)) {
        serviceData.parts_needed.forEach(partId => {
            formData.append('parts_needed[]', partId);
        });
    }

    // Add image if provided
    if (serviceData.image instanceof File) {
        formData.append('image', serviceData.image);
    }

    return formData;
};

// Get all services with pagination and search
export const getAllServices = async (page = 1, limit = 10, search = '') => {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (search.trim()) {
            params.append('search', search.trim());
        }

        const response = await api.get(`/services?${params.toString()}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching services:', error);
        throw error;
    }
};

// Get service by ID
export const getServiceById = async (id) => {
    try {
        const response = await api.get(`/services/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching service:', error);
        throw error;
    }
};

// Create new service
export const createService = async (serviceData) => {
    try {
        const formData = prepareServiceFormData(serviceData);

        const response = await api.post('/services', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error creating service:', error);
        throw error;
    }
};

// Update service
export const updateService = async (id, serviceData) => {
    try {
        const formData = prepareServiceFormData(serviceData);

        const response = await api.put(`/services/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error updating service:', error);
        throw error;
    }
};

// Delete service
export const deleteService = async (id) => {
    try {
        const response = await api.delete(`/services/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting service:', error);
        throw error;
    }
};

// Get services for selector (simplified data)
export const getServicesForSelector = async (page = 1, limit = 12, search = '') => {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (search.trim()) {
            params.append('search', search.trim());
        }

        const response = await api.get(`/services?${params.toString()}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching services for selector:', error);
        throw error;
    }
};