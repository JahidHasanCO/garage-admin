import { useState, useEffect, useCallback } from "react";
import { fuelTypesService } from "../api/fuelTypesService";

export const useFuelTypesData = () => {
  const [fuelTypes, setFuelTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 10
  });

  // Fetch fuel types data
  const fetchFuelTypes = useCallback(async (page = 1, limit = 10, search = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fuelTypesService.getAllFuelTypes(page, limit, search);
      
      setFuelTypes(response.data || []);
      setPagination({
        page: response.page || 1,
        pages: response.pages || 1,
        total: response.total || 0,
        limit: limit
      });
      
    } catch (error) {
      setError(error.message);
      setFuelTypes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle page change
  const handlePageChange = useCallback((newPage) => {
    fetchFuelTypes(newPage, pagination.limit);
  }, [fetchFuelTypes, pagination.limit]);

  // Handle limit change
  const handleLimitChange = useCallback((newLimit) => {
    fetchFuelTypes(1, newLimit);
  }, [fetchFuelTypes]);

  // Delete fuel type
  const deleteFuelType = useCallback(async (fuelTypeId) => {
    try {
      setDeleteLoading(fuelTypeId);
      
      await fuelTypesService.deleteFuelType(fuelTypeId);
      
      // Refresh the list after successful delete
      await fetchFuelTypes(pagination.page, pagination.limit);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || "Failed to delete fuel type" 
      };
    } finally {
      setDeleteLoading(null);
    }
  }, [fetchFuelTypes, pagination.page, pagination.limit]);

  // Refresh data
  const refresh = useCallback(() => {
    fetchFuelTypes(pagination.page, pagination.limit);
  }, [fetchFuelTypes, pagination.page, pagination.limit]);

  // Search query effect - reset to page 1 when search changes
  useEffect(() => {
    fetchFuelTypes(1, pagination.limit);
  }, [fetchFuelTypes, pagination.limit]);

  // Initial load on mount only
  useEffect(() => {
    fetchFuelTypes(1, 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty - only run on mount

  return {
    fuelTypes,
    loading,
    error,
    pagination,
    deleteLoading,
    handlePageChange,
    handleLimitChange,
    deleteFuelType,
    refresh,
    fetchFuelTypes,
  };
};