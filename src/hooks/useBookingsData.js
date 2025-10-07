import { useState, useEffect } from 'react';
import { getAllBookings, deleteBooking } from '../api/bookingsService';

export const useBookingsData = () => {
  const [bookings, setBookings] = useState([]);
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

  const fetchBookings = async (page = 1, limit = 10, search = '') => {
    try {
      setLoading(true);
      setError(null);
      const filters = {};
      if (search && search.trim()) filters.search = search.trim();
      const response = await getAllBookings(page, limit, filters);
      setBookings(response.bookings || response.data || []);
      setPagination({ page: response.page || 1, pages: response.pages || 1, total: response.total || 0, limit });
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.response?.data?.message || 'Failed to fetch bookings');
      setBookings([]);
      setPagination({ page: 1, pages: 1, total: 0, limit });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(1, pagination.limit, debouncedSearchQuery);
  }, [debouncedSearchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageChange = (newPage) => fetchBookings(newPage, pagination.limit, debouncedSearchQuery);
  const handleLimitChange = (newLimit) => fetchBookings(1, newLimit, debouncedSearchQuery);
  const handleSearch = (q) => setSearchQuery(q);

  const deleteBookingById = async (id) => {
    try {
      setDeleteLoading(id);
      await deleteBooking(id);
      await fetchBookings(pagination.page, pagination.limit, debouncedSearchQuery);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to delete booking' };
    } finally {
      setDeleteLoading(null);
    }
  };

  const refreshBookings = () => fetchBookings(pagination.page, pagination.limit, debouncedSearchQuery);

  return { bookings, loading, error, pagination, searchQuery, deleteLoading, handlePageChange, handleLimitChange, handleSearch, deleteBookingById, refreshBookings };
};
