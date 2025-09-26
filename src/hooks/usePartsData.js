import { useState, useEffect, useCallback, useRef } from "react";
import { partsService } from "../api/partsService";

export const usePartsData = (initialSearch = "") => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 10,
  });
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Use ref to store current values to avoid stale closures
  const paginationRef = useRef(pagination);
  const searchQueryRef = useRef(searchQuery);
  
  // Update refs when state changes
  useEffect(() => {
    paginationRef.current = pagination;
  }, [pagination]);
  
  useEffect(() => {
    searchQueryRef.current = searchQuery;
  }, [searchQuery]);

  // Stable reference for fetchParts
  const fetchParts = useCallback(async (page = 1, limit = 10, search = "") => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await partsService.getAllParts(page, limit, search);
      
      setParts(response.parts || []);
      setPagination({
        page: response.page || 1,
        pages: response.pages || 1,
        total: response.total || 0,
        limit: limit,
      });
      
    } catch (err) {
      setError(err.message || "Failed to fetch parts");
      setParts([]);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array - this function doesn't depend on any state

  // Initial load
  useEffect(() => {
    fetchParts(1, 10, initialSearch);
  }, [fetchParts, initialSearch]);

  // Handle page change - using useCallback to prevent recreating on every render
  const handlePageChange = useCallback((newPage) => {
    fetchParts(newPage, paginationRef.current.limit, searchQueryRef.current);
  }, [fetchParts]);


  const handleLimitChange = useCallback((newLimit) => {
    fetchParts(paginationRef.current.page, newLimit, searchQueryRef.current);
  }, [fetchParts]);

  // Handle search - using useCallback to prevent recreating on every render
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    fetchParts(1, paginationRef.current.limit, query);
  }, [fetchParts]);

  // Handle delete part - using useCallback
  const deletePart = useCallback(async (partId) => {
    try {
      setDeleteLoading(partId);
      await partsService.deletePart(partId);
      
      // Refresh the parts list
      await fetchParts(paginationRef.current.page, paginationRef.current.limit, searchQueryRef.current);
      
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.message || "Failed to delete part" 
      };
    } finally {
      setDeleteLoading(null);
    }
  }, [fetchParts]);

  // Refresh data - using useCallback
  const refresh = useCallback(() => {
    fetchParts(paginationRef.current.page, paginationRef.current.limit, searchQueryRef.current);
  }, [fetchParts]);

  return {
    parts,
    loading,
    error,
    pagination,
    searchQuery,
    deleteLoading,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    deletePart,
    refresh,
  };
};