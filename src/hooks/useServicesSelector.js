import { useState, useEffect, useCallback } from 'react';
import { getAllServices } from '../api/servicesService';

/**
 * Custom hook for services multi-selector functionality
 * 
 * This hook encapsulates all business logic for service selection,
 * including data fetching, pagination, search, and selection management.
 * 
 * @param {Array} selectedServices - Currently selected service IDs
 * @param {boolean} isOpen - Whether the selector is open
 * @returns {Object} Hook state and methods
 */
export const useServicesSelector = (selectedServices = [], isOpen = false) => {
  // State management
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 12
  });
  const [tempSelectedServices, setTempSelectedServices] = useState([]);

  /**
   * Initialize temporary selection when modal opens
   */
  useEffect(() => {
    if (isOpen) {
      setTempSelectedServices([...selectedServices]);
    }
  }, [isOpen, selectedServices]);

  /**
   * Fetch services with pagination and search
   */
  const fetchServices = useCallback(async (page = 1, search = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getAllServices(page, pagination.limit, search);
      
      setServices(response.services || response.data || []);
      setPagination({
        page: response.page || 1,
        pages: response.pages || 1,
        total: response.total || 0,
        limit: pagination.limit
      });
      
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services');
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]);

  /**
   * Load services when modal opens
   */
  useEffect(() => {
    if (isOpen) {
      fetchServices(1, searchQuery);
    }
  }, [isOpen, searchQuery, fetchServices]);

  /**
   * Handle search with debouncing
   */
  useEffect(() => {
    if (isOpen) {
      const delayedSearch = setTimeout(() => {
        fetchServices(1, searchQuery);
      }, 300);

      return () => clearTimeout(delayedSearch);
    }
  }, [searchQuery, isOpen, fetchServices]);

  /**
   * Selection management methods
   */
  const selectionMethods = {
    toggleServiceSelection: (serviceId) => {
      setTempSelectedServices(prev => {
        if (prev.includes(serviceId)) {
          return prev.filter(id => id !== serviceId);
        } else {
          return [...prev, serviceId];
        }
      });
    },

    selectAll: () => {
      const allCurrentIds = services.map(service => service._id);
      const newSelection = [...new Set([...tempSelectedServices, ...allCurrentIds])];
      setTempSelectedServices(newSelection);
    },

    deselectAll: () => {
      const currentIds = services.map(service => service._id);
      setTempSelectedServices(prev => prev.filter(id => !currentIds.includes(id)));
    },

    clearAll: () => {
      setTempSelectedServices([]);
    }
  };

  /**
   * Pagination methods
   */
  const paginationMethods = {
    handlePageChange: (newPage) => {
      fetchServices(newPage, searchQuery);
    },

    handleSearchChange: (query) => {
      setSearchQuery(query);
    }
  };

  /**
   * Utility methods
   */
  const utilityMethods = {
    getSelectedCount: () => tempSelectedServices.length,
    
    getTotalSelectedCount: () => selectedServices.length,
    
    refreshServices: () => {
      fetchServices(pagination.page, searchQuery);
    },

    resetSelection: () => {
      setTempSelectedServices([...selectedServices]);
    }
  };

  return {
    // State
    services,
    loading,
    error,
    searchQuery,
    pagination,
    tempSelectedServices,
    
    // Selection methods
    ...selectionMethods,
    
    // Pagination methods  
    ...paginationMethods,
    
    // Utility methods
    ...utilityMethods
  };
};