import { useState, useEffect } from 'react';
import { getAllStaff, deleteStaff } from '../api/staffService';

export const useStaffsData = () => {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchStaffs = async (page = 1, limit = 10, search = '') => {
    try {
      setLoading(true);
      setError(null);

      const filters = {};
      if (search && search.trim()) filters.search = search.trim();

      const response = await getAllStaff(page, limit, filters);

      setStaffs(response.staff || response.data || []);
      setPagination({ page: response.page || 1, pages: response.pages || 1, total: response.total || 0, limit });
    } catch (err) {
      console.error('Error fetching staffs:', err);
      setError(err.response?.data?.message || 'Failed to fetch staff');
      setStaffs([]);
      setPagination({ page: 1, pages: 1, total: 0, limit });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffs(1, pagination.limit, debouncedSearchQuery);
  }, [debouncedSearchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageChange = (newPage) => {
    fetchStaffs(newPage, pagination.limit, debouncedSearchQuery);
  };

  const handleLimitChange = (newLimit) => {
    fetchStaffs(1, newLimit, debouncedSearchQuery);
  };

  const handleSearch = (query) => setSearchQuery(query);

  const deleteStaffById = async (staffId) => {
    try {
      setDeleteLoading(staffId);
      await deleteStaff(staffId);
      await fetchStaffs(pagination.page, pagination.limit, debouncedSearchQuery);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to delete staff' };
    } finally {
      setDeleteLoading(null);
    }
  };

  const refreshStaffs = () => fetchStaffs(pagination.page, pagination.limit, debouncedSearchQuery);

  return {
    staffs,
    loading,
    error,
    pagination,
    searchQuery,
    deleteLoading,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    deleteStaffById,
    refreshStaffs,
    fetchStaffs,
    setError,
  };
};
