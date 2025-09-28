import { useState, useEffect } from 'react';
import { getAllGarages, deleteGarage } from '../api/garagesService';

export const useGaragesData = () => {
  const [garages, setGarages] = useState([]);
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

  // Fetch garages
  const fetchGarages = async (page = 1, limit = 10, search = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getAllGarages(page, limit, search);
      
      setGarages(response.garages || []);
      setPagination({
        total: response.total || 0,
        page: response.page || 1,
        pages: response.pages || 1,
        limit: limit
      });
    } catch (err) {
      console.error('Error fetching garages:', err);
      setError(err.response?.data?.message || 'Failed to fetch garages');
      setGarages([]);
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
    fetchGarages(1, pagination.limit, debouncedSearchQuery);
  }, [debouncedSearchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle page change
  const handlePageChange = (newPage) => {
    fetchGarages(newPage, pagination.limit, debouncedSearchQuery);
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Handle delete garage
  const handleDelete = async (garageId) => {
    try {
      setError(null);
      await deleteGarage(garageId);
      
      // Refresh the current page
      await fetchGarages(pagination.page, pagination.limit, debouncedSearchQuery);
      
      return { success: true };
    } catch (err) {
      console.error('Error deleting garage:', err);
      const errorMessage = err.response?.data?.message || 'Failed to delete garage';
      setError(errorMessage);
      return { success: false, error: errorMessage };
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
    handlePageChange,
    handleSearch,
    handleDelete,
    refreshGarages,
    setError
  };
};