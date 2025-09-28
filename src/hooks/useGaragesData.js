import { useState, useEffect } from 'react';
import { getAllGarages, deleteGarage } from '../api/garagesService';

export const useGaragesData = () => {
  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
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

  // Fetch garages
  const fetchGarages = async (page = 1, limit = 10, search = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getAllGarages(page, limit, search);
      
      setGarages(response.garages || []);
      setPagination({
        page: response.page || 1,
        pages: response.pages || 1,
        total: response.total || 0,
        limit: limit
      });
    } catch (err) {
      console.error('Error fetching garages:', err);
      setError(err.response?.data?.message || 'Failed to fetch garages');
      setGarages([]);
      setPagination({
        page: 1,
        pages: 1,
        total: 0,
        limit: limit
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchGarages(1, pagination.limit, debouncedSearchQuery);
  }, [debouncedSearchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle page change
  const handlePageChange = (newPage) => {
    fetchGarages(newPage, pagination.limit, debouncedSearchQuery);
  };

  // Handle limit change
  const handleLimitChange = (newLimit) => {
    fetchGarages(1, newLimit, debouncedSearchQuery);
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Delete garage
  const deleteGarageById = async (garageId) => {
    try {
      setDeleteLoading(garageId);
      
      await deleteGarage(garageId);
      
      // Refresh the list after successful delete
      await fetchGarages(pagination.page, pagination.limit, debouncedSearchQuery);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || "Failed to delete garage" 
      };
    } finally {
      setDeleteLoading(null);
    }
  };

  // Refresh data
  const refreshGarages = () => {
    fetchGarages(pagination.page, pagination.limit, debouncedSearchQuery);
  };

  return {
    garages,
    loading,
    error,
    pagination,
    searchQuery,
    deleteLoading,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    deleteGarageById,
    refreshGarages,
    fetchGarages,
    setError
  };
};