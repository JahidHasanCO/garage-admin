import { useState, useEffect, useCallback } from "react";
import { getAllServicePackages, deleteServicePackage } from "../api/servicePackagesService";

export const useServicePackagesData = () => {
  const [servicePackages, setServicePackages] = useState([]);
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

  // Fetch service packages
  const fetchServicePackages = useCallback(async (page = 1, limit = 10, search = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getAllServicePackages(page, limit, search);
      console.log('Service Packages API Response:', response);
      
      const packages = response.packages || response.servicePackages || response.data || [];
      console.log('Extracted packages:', packages);
      setServicePackages(packages);
      setPagination({
        page: response.page || 1,
        pages: response.pages || 1,
        total: response.total || 0,
        limit: limit
      });
      
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch service packages');
      setServicePackages([]);
      setPagination({
        page: 1,
        pages: 1,
        total: 0,
        limit: limit
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchServicePackages(1, pagination.limit, debouncedSearchQuery);
  }, [debouncedSearchQuery, fetchServicePackages]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle page change
  const handlePageChange = useCallback((newPage) => {
    fetchServicePackages(newPage, pagination.limit, debouncedSearchQuery);
  }, [fetchServicePackages, pagination.limit, debouncedSearchQuery]);

  // Handle limit change
  const handleLimitChange = useCallback((newLimit) => {
    fetchServicePackages(1, newLimit, debouncedSearchQuery);
  }, [fetchServicePackages, debouncedSearchQuery]);

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Delete service package
  const deleteServicePackageById = async (servicePackageId) => {
    try {
      setDeleteLoading(servicePackageId);
      
      await deleteServicePackage(servicePackageId);
      
      // Refresh the list after successful delete
      await fetchServicePackages(pagination.page, pagination.limit, debouncedSearchQuery);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || "Failed to delete service package" 
      };
    } finally {
      setDeleteLoading(null);
    }
  };

  // Refresh data
  const refreshServicePackages = () => {
    fetchServicePackages(pagination.page, pagination.limit, debouncedSearchQuery);
  };

  return {
    servicePackages,
    loading,
    error,
    pagination,
    searchQuery,
    deleteLoading,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    deleteServicePackageById,
    refreshServicePackages,
    fetchServicePackages,
    setError
  };
};