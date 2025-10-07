import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useStaffsData } from "../../hooks/useStaffsData";
import PageHeader from "../../components/PageHeader";
import DeleteConfirmDialog from "../../components/DeleteConfirmDialog";
import StaffsTable from "./StaffsTable";
import PaginationControls from "../../components/PaginationControls";

const StaffsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    staffs,
    loading,
    error,
    pagination,
    searchQuery,
    deleteLoading,
    handleSearch,
    handlePageChange,
    handleLimitChange,
    deleteStaffById,
    refreshStaffs,
  } = useStaffsData();

  const [deleteDialog, setDeleteDialog] = useState({ open: false, staff: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (location.state?.message && !location.state.cleared) {
      setSnackbar({ open: true, message: location.state.message, severity: location.state.severity || "success" });
      navigate(location.pathname, { replace: true, state: { cleared: true } });
    }
  }, [location, navigate]);

  const handleEdit = (staffId) => {
    navigate(`/staff/edit/${staffId}`);
  };

  const handleAdd = () => {
    navigate('/staff/add');
  };

  const handleDeleteClick = (staff) => {
    setDeleteDialog({ open: true, staff });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.staff) {
      const result = await deleteStaffById(deleteDialog.staff._id);

      if (result.success) {
        setSnackbar({ open: true, message: "Staff deleted successfully", severity: "success" });
      } else {
        setSnackbar({ open: true, message: result.error || "Failed to delete staff", severity: "error" });
      }
    }
    setDeleteDialog({ open: false, staff: null });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, staff: null });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (error) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="p-4">
          <div className="mb-2 p-3 border border-red-300 rounded bg-red-50 text-red-700 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={refreshStaffs} className="ml-4 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">Retry</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-gray-50">
      <div className="p-4 pb-0 flex-shrink-0">
        <PageHeader
          title="Staff Management"
          breadcrumbs={[{ label: "Dashboard", path: "/dashboard" }, { label: "Staff", path: "/staff" }]}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <StaffsTable
          staffs={staffs}
          loading={loading}
          searchQuery={searchQuery}
          deleteLoading={deleteLoading}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onAddStaff={handleAdd}
          onSearch={handleSearch}
        />
      </div>

      <div className="px-4 py-3 flex-shrink-0 border-t border-gray-200 bg-white">
        <PaginationControls
          page={pagination.page}
          pages={pagination.pages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          disabled={loading}
        />
      </div>

      <DeleteConfirmDialog
        open={deleteDialog.open}
        title="Delete Staff"
        itemName={deleteDialog.staff?.user_id?.name || deleteDialog.staff?.user_id?.email}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      {snackbar.open && (
        <div className="fixed bottom-5 right-5 z-50">
          <div className={`px-4 py-2 rounded shadow-lg text-white ${snackbar.severity === "success" ? "bg-green-600" : "bg-red-600"}`}>
            <div className="flex items-center justify-between space-x-4">
              <span>{snackbar.message}</span>
              <button onClick={handleSnackbarClose} className="text-white font-bold">✕</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffsPage;
