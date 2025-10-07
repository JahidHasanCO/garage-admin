import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import DeleteConfirmDialog from '../../components/DeleteConfirmDialog';
import BookingsTable from './BookingsTable';
import PaginationControls from '../../components/PaginationControls';
import { useBookingsData } from '../../hooks/useBookingsData';
import { useStaffsData } from '../../hooks/useStaffsData';
import { updateBooking } from '../../api/bookingsService';

const BookingsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { bookings, loading, error, pagination, searchQuery, deleteLoading, handleSearch, handlePageChange, handleLimitChange, deleteBookingById, refreshBookings } = useBookingsData();

  const [deleteDialog, setDeleteDialog] = useState({ open: false, booking: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [assignDialog, setAssignDialog] = useState({ open: false, booking: null });
  const { staffs } = useStaffsData();
  const [assignState, setAssignState] = useState({ staffId: '', status: 'assigned' });

  useEffect(() => {
    if (location.state?.message && !location.state.cleared) {
      setSnackbar({ open: true, message: location.state.message, severity: location.state.severity || 'success' });
      navigate(location.pathname, { replace: true, state: { cleared: true } });
    }
  }, [location, navigate]);

  const handleEdit = (id) => navigate(`/bookings/edit/${id}`);
  const handleAdd = () => navigate('/bookings/add');
  const handleDeleteClick = (booking) => setDeleteDialog({ open: true, booking });

  const handleDeleteConfirm = async () => {
    if (deleteDialog.booking) {
      const result = await deleteBookingById(deleteDialog.booking._id);
      if (result.success) setSnackbar({ open: true, message: 'Booking deleted', severity: 'success' });
      else setSnackbar({ open: true, message: result.error || 'Failed to delete booking', severity: 'error' });
    }
    setDeleteDialog({ open: false, booking: null });
  };

  const handleAssignClick = (booking) => {
    setAssignDialog({ open: true, booking });
    setAssignState({ staffId: booking.assignedStaff?._id || '', status: booking.status || 'assigned' });
  };

  const handleAssignCancel = () => setAssignDialog({ open: false, booking: null });

  const handleAssignSubmit = async () => {
    if (!assignDialog.booking) return;
    try {
      const payload = { assignedStaff: assignState.staffId || null, status: assignState.status };
  await updateBooking(assignDialog.booking._id, payload);
      await refreshBookings();
      setSnackbar({ open: true, message: 'Booking updated', severity: 'success' });
      setAssignDialog({ open: false, booking: null });
    } catch (err) {
      console.error('Assign error', err);
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to assign staff', severity: 'error' });
    }
  };

  if (error) return (
    <div className="p-4">
      <div className="mb-2 p-3 border border-red-300 rounded bg-red-50 text-red-700 flex items-center justify-between">
        <span>{error}</span>
        <button onClick={refreshBookings} className="ml-4 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">Retry</button>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col bg-gray-50">
      <div className="p-4 pb-0 flex-shrink-0">
        <PageHeader title="Booking Management" breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Bookings', path: '/bookings' }]} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <BookingsTable bookings={bookings} loading={loading} searchQuery={searchQuery} deleteLoading={deleteLoading} onEdit={handleEdit} onDelete={handleDeleteClick} onAddBooking={handleAdd} onSearch={handleSearch} onAssign={handleAssignClick} />
      </div>

      <div className="px-4 py-3 flex-shrink-0 border-t border-gray-200 bg-white">
        <PaginationControls page={pagination.page} pages={pagination.pages} total={pagination.total} limit={pagination.limit} onPageChange={handlePageChange} onLimitChange={handleLimitChange} disabled={loading} />
      </div>

      <DeleteConfirmDialog open={deleteDialog.open} title="Delete Booking" itemName={deleteDialog.booking?._id?.slice(-8)} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteDialog({ open: false, booking: null })} />

      {/* Assign dialog - simple inline modal */}
      {assignDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg w-96 p-4">
            <h3 className="text-lg font-semibold mb-3">Assign Staff</h3>
            <div className="mb-3">
              <label className="text-sm text-gray-700">Select Staff</label>
              <select className="w-full mt-1 p-2 border rounded" value={assignState.staffId} onChange={(e) => setAssignState({ ...assignState, staffId: e.target.value })}>
                <option value="">-- Unassigned --</option>
                {staffs.map(s => (
                  <option key={s._id} value={s._id}>{s.user_id?.name || s.name || s._id?.slice(-8)}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="text-sm text-gray-700">Status</label>
              <select className="w-full mt-1 p-2 border rounded" value={assignState.status} onChange={(e) => setAssignState({ ...assignState, status: e.target.value })}>
                <option value="assigned">assigned</option>
                <option value="in_progress">in_progress</option>
                <option value="completed">completed</option>
                <option value="cancelled">cancelled</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button className="px-3 py-1 rounded bg-gray-200" onClick={handleAssignCancel}>Cancel</button>
              <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={handleAssignSubmit}>Save</button>
            </div>
          </div>
        </div>
      )}

      {snackbar.open && (
        <div className="fixed bottom-5 right-5 z-50">
          <div className={`px-4 py-2 rounded shadow-lg text-white ${snackbar.severity === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            <div className="flex items-center justify-between space-x-4">
              <span>{snackbar.message}</span>
              <button onClick={() => setSnackbar({ ...snackbar, open: false })} className="text-white font-bold">✕</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
