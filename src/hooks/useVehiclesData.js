import { useState, useEffect, useCallback } from "react";
import { vehiclesService } from "../api/vehiclesService";

export const useVehiclesData = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 10
  });

  // Fetch vehicles data
  const fetchVehicles = useCallback(async (page = 1, limit = 10, search = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await vehiclesService.getAllVehicles(page, limit, search);
      
      setVehicles(response.vehicles || []);
      setPagination({
        page: response.page || 1,
        pages: response.pages || 1,
        total: response.total || 0,
        limit: limit
      });
      
    } catch (error) {
      setError(error.message);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle page change
  const handlePageChange = useCallback((newPage) => {
    fetchVehicles(newPage, pagination.limit);
  }, [fetchVehicles, pagination.limit]);

  // Handle limit change
  const handleLimitChange = useCallback((newLimit) => {
    fetchVehicles(1, newLimit);
  }, [fetchVehicles]);

  // Delete vehicle
  const deleteVehicle = useCallback(async (vehicleId) => {
    try {
      setDeleteLoading(vehicleId);
      
      await vehiclesService.deleteVehicle(vehicleId);
      
      // Refresh the list after successful delete
      await fetchVehicles(pagination.page, pagination.limit);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || "Failed to delete vehicle" 
      };
    } finally {
      setDeleteLoading(null);
    }
  }, [fetchVehicles, pagination.page, pagination.limit]);

  // Refresh data
  const refresh = useCallback(() => {
    fetchVehicles(pagination.page, pagination.limit);
  }, [fetchVehicles, pagination.page, pagination.limit]);

  // Initial load effect
  useEffect(() => {
    fetchVehicles(1, pagination.limit);
  }, [fetchVehicles, pagination.limit]);

  // Initial load on mount only
  useEffect(() => {
    fetchVehicles(1, 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty - only run on mount

  return {
    vehicles,
    loading,
    error,
    pagination,
    deleteLoading,
    handlePageChange,
    handleLimitChange,
    deleteVehicle,
    refresh,
    fetchVehicles,
  };
};