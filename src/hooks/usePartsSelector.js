import { useState, useEffect, useCallback } from 'react';
import { partsService } from '../api/partsService';

/**
 * Custom hook for parts multi-selector functionality
 * 
 * This hook encapsulates all business logic for parts selection,
 * including data fetching, pagination, search, and selection management.
 * 
 * @param {Array} selectedParts - Currently selected part IDs
 * @param {boolean} isOpen - Whether the selector is open
 * @returns {Object} Hook state and methods
 */
export const usePartsSelector = (selectedParts = [], isOpen = false) => {
  // State management
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 12
  });
  const [tempSelectedParts, setTempSelectedParts] = useState([]);

  /**
   * Initialize temporary selection when modal opens
   */
  useEffect(() => {
    if (isOpen) {
      setTempSelectedParts([...selectedParts]);
    }
  }, [isOpen, selectedParts]);

  /**
   * Fetch parts with pagination and search
   */
  const fetchParts = useCallback(async (page = 1, search = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await partsService.getAllParts(page, pagination.limit, search);
      
      setParts(response.data || []);
      setPagination({
        page: response.page || 1,
        pages: response.totalPages || response.pages || 1,
        total: response.total || 0,
        limit: pagination.limit
      });
      
    } catch (err) {
      console.error('Error fetching parts:', err);
      setError('Failed to load parts');
      setParts([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]);

  /**
   * Load parts when modal opens
   */
  useEffect(() => {
    if (isOpen) {
      fetchParts(1, searchQuery);
    }
  }, [isOpen, searchQuery, fetchParts]);

  /**
   * Handle search with debouncing
   */
  useEffect(() => {
    if (isOpen) {
      const delayedSearch = setTimeout(() => {
        fetchParts(1, searchQuery);
      }, 300);

      return () => clearTimeout(delayedSearch);
    }
  }, [searchQuery, isOpen, fetchParts]);

  /**
   * Selection management methods
   */
  const selectionMethods = {
    togglePartSelection: (partId) => {
      setTempSelectedParts(prev => {
        if (prev.includes(partId)) {
          return prev.filter(id => id !== partId);
        } else {
          return [...prev, partId];
        }
      });
    },

    selectAll: () => {
      const allCurrentIds = parts.map(part => part._id);
      const newSelection = [...new Set([...tempSelectedParts, ...allCurrentIds])];
      setTempSelectedParts(newSelection);
    },

    deselectAll: () => {
      const currentIds = parts.map(part => part._id);
      setTempSelectedParts(prev => prev.filter(id => !currentIds.includes(id)));
    },

    clearAll: () => {
      setTempSelectedParts([]);
    }
  };

  /**
   * Pagination methods
   */
  const paginationMethods = {
    handlePageChange: (newPage) => {
      fetchParts(newPage, searchQuery);
    },

    handleSearchChange: (query) => {
      setSearchQuery(query);
    }
  };

  /**
   * Utility methods
   */
  const utilityMethods = {
    getSelectedCount: () => tempSelectedParts.length,
    
    getTotalSelectedCount: () => selectedParts.length,
    
    refreshParts: () => {
      fetchParts(pagination.page, searchQuery);
    },

    resetSelection: () => {
      setTempSelectedParts([...selectedParts]);
    }
  };

  return {
    // State
    parts,
    loading,
    error,
    searchQuery,
    pagination,
    tempSelectedParts,
    
    // Selection methods
    ...selectionMethods,
    
    // Pagination methods  
    ...paginationMethods,
    
    // Utility methods
    ...utilityMethods
  };
};