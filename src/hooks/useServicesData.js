import { useState, useEffect } from 'react';
import { getAllServices, deleteService } from '../api/servicesService';

export const useServicesData = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 10
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Fetch services
  const fetchServices = async (page = 1, limit = 10, search = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getAllServices(page, limit, search);
      
      setServices(response.services || []);
      setPagination({
        total: response.total || 0,
        page: response.page || 1,
        pages: response.pages || 1,
        limit: limit
      });
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err.response?.data?.message || 'Failed to fetch services');
      setServices([]);
      setPagination({
        total: 0,
        page: 1,
        pages: 1,
        limit: limit
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchServices(1, pagination.limit, debouncedSearchQuery);
  }, [debouncedSearchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle page change
  const handlePageChange = (newPage) => {
    fetchServices(newPage, pagination.limit, debouncedSearchQuery);
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Handle delete service
  const handleDelete = async (serviceId) => {
    try {
      setError(null);
      await deleteService(serviceId);
      
      // Refresh the current page
      await fetchServices(pagination.page, pagination.limit, debouncedSearchQuery);
      
      return { success: true };
    } catch (err) {
      console.error('Error deleting service:', err);
      const errorMessage = err.response?.data?.message || 'Failed to delete service';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Refresh data
  const refreshServices = () => {
    fetchServices(pagination.page, pagination.limit, debouncedSearchQuery);
  };

  return {
    services,
    loading,
    error,
    pagination,
    searchQuery,
    handlePageChange,
    handleSearch,
    handleDelete,
    refreshServices,
    setError
  };
};