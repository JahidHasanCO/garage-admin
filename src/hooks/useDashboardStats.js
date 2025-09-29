import { useState, useEffect } from 'react';
import { statisticsService } from '../services/statisticsService';

/**
 * Custom hook for dashboard statistics
 * Handles state management and API calls for dashboard data
 */
export const useDashboardStats = () => {
  const [state, setState] = useState({
    // Basic statistics state
    stats: {
      parts: { count: 0, loading: true },
      vehicles: { count: 0, loading: true },
      garages: { count: 0, loading: true },
      services: { count: 0, loading: true },
      servicePackages: { count: 0, loading: true },
      manufacturers: { count: 0, loading: true },
      fuelTypes: { count: 0, loading: true }
    },
    // Detailed insights state
    insights: {
      data: null,
      loading: true
    },
    // Error state
    error: null,
    // Overall loading state
    loading: true
  });

  /**
   * Transform basic statistics API response to component state format
   * @param {Object} basicData - API response data
   * @returns {Object} Transformed statistics object
   */
  const transformBasicStats = (basicData) => {
    if (!basicData) {
      return {
        parts: { count: 0, loading: false },
        vehicles: { count: 0, loading: false },
        garages: { count: 0, loading: false },
        services: { count: 0, loading: false },
        servicePackages: { count: 0, loading: false },
        manufacturers: { count: 0, loading: false },
        fuelTypes: { count: 0, loading: false }
      };
    }

    return {
      parts: { count: basicData.totalParts || 0, loading: false },
      vehicles: { count: basicData.totalVehicles || 0, loading: false },
      garages: { count: basicData.totalGarages || 0, loading: false },
      services: { count: basicData.totalServices || 0, loading: false },
      servicePackages: { count: basicData.totalServicePackages || 0, loading: false },
      manufacturers: { count: basicData.totalManufacturers || 0, loading: false },
      fuelTypes: { count: basicData.totalFuelTypes || 0, loading: false }
    };
  };

  /**
   * Fetch and update dashboard statistics
   */
  const fetchStats = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const { basic, detailed, errors } = await statisticsService.getAllStatistics();
      
      // Update state with fetched data
      setState(prev => ({
        ...prev,
        stats: transformBasicStats(basic),
        insights: {
          data: detailed?.insights || null,
          loading: false
        },
        error: errors.basic || errors.detailed || null,
        loading: false
      }));

    } catch (error) {
      console.error('Error in useDashboardStats:', error);
      
      setState(prev => ({
        ...prev,
        stats: transformBasicStats(null),
        insights: { data: null, loading: false },
        error: error.message || 'Failed to fetch statistics',
        loading: false
      }));
    }
  };

  /**
   * Refresh statistics data
   */
  const refreshStats = () => {
    fetchStats();
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchStats();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    ...state,
    refreshStats,
    // Computed values
    hasError: !!state.error,
    hasInsights: !!state.insights.data,
    isLoading: state.loading
  };
};