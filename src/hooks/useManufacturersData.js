import { useState, useEffect, useCallback } from "react";
import { manufacturersService } from "../api/manufacturersService";

export const useManufacturersData = () => {
  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 10
  });

  // Fetch manufacturers data
  const fetchManufacturers = useCallback(async (page = 1, limit = 10, search = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await manufacturersService.getAllManufacturers(page, limit, search);
      
      setManufacturers(response.data || []);
      setPagination({
        page: response.page || 1,
        pages: response.totalPages || response.pages || 1,
        total: response.total || 0,
        limit: limit
      });
      
    } catch (error) {
      setError(error.message);
      setManufacturers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle page change
  const handlePageChange = useCallback((newPage) => {
    fetchManufacturers(newPage, pagination.limit);
  }, [fetchManufacturers, pagination.limit]);

  // Handle limit change
  const handleLimitChange = useCallback((newLimit) => {
    fetchManufacturers(1, newLimit);
  }, [fetchManufacturers]);

  // Delete manufacturer
  const deleteManufacturer = useCallback(async (manufacturerId) => {
    try {
      setDeleteLoading(manufacturerId);
      
      await manufacturersService.deleteManufacturer(manufacturerId);
      
      // Refresh the list after successful delete
      await fetchManufacturers(pagination.page, pagination.limit);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || "Failed to delete manufacturer" 
      };
    } finally {
      setDeleteLoading(null);
    }
  }, [fetchManufacturers, pagination.page, pagination.limit]);

  // Refresh data
  const refresh = useCallback(() => {
    fetchManufacturers(pagination.page, pagination.limit);
  }, [fetchManufacturers, pagination.page, pagination.limit]);

  // Initial load effect
  useEffect(() => {
    fetchManufacturers(1, pagination.limit);
  }, [fetchManufacturers, pagination.limit]);

  // Initial load on mount only
  useEffect(() => {
    fetchManufacturers(1, 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty - only run on mount

  return {
    manufacturers,
    loading,
    error,
    pagination,
    deleteLoading,
    handlePageChange,
    handleLimitChange,
    deleteManufacturer,
    refresh,
    fetchManufacturers,
  };
};