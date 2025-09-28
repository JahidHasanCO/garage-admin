import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useManufacturersData } from "../../hooks/useManufacturersData";
import PaginationControls from "../../components/PaginationControls";
import PageHeader from "../../components/PageHeader";
import ManufacturersTable from "./ManufacturersTable";
import DeleteConfirmDialog from "../../components/DeleteConfirmDialog";

export default function ManufacturersPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    manufacturers,
    loading,
    error,
    pagination,
    deleteLoading,
    handlePageChange,
    handleLimitChange,
    deleteManufacturer,
    refresh,
  } = useManufacturersData();

  const [deleteDialog, setDeleteDialog] = useState({ open: false, manufacturer: null });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (location.state?.message && !location.state.cleared) {
      setSnackbar({
        open: true,
        message: location.state.message,
        severity: location.state.severity || "success",
      });
      navigate(location.pathname, { replace: true, state: { cleared: true } });
    }
  }, [location, navigate]);

  const handleAddManufacturer = () => navigate("/manufacturers/add");
  const handleEditManufacturer = (manufacturerId) => navigate(`/manufacturers/edit/${manufacturerId}`);
  const handleDeleteClick = (manufacturer) => setDeleteDialog({ open: true, manufacturer });

  const handleDeleteConfirm = async () => {
    if (deleteDialog.manufacturer) {
      const result = await deleteManufacturer(deleteDialog.manufacturer._id);

      if (result.success) {
        setSnackbar({
          open: true,
          message: "Manufacturer deleted successfully",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: result.error || "Failed to delete manufacturer",
          severity: "error",
        });
      }
    }
    setDeleteDialog({ open: false, manufacturer: null });
  };

  const handleDeleteCancel = () => setDeleteDialog({ open: false, manufacturer: null });
  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  if (error) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="p-4">
          <div className="mb-2 p-3 border border-red-300 rounded bg-red-50 text-red-700 flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={refresh}
              className="ml-4 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-4 pb-0 flex-shrink-0">
        <PageHeader
          title="Manufacturers Management"
          breadcrumbs={[
            { label: "Dashboard", path: "/dashboard" },
            { label: "Manufacturers", path: "/manufacturers" },
          ]}
        />
      </div>

      {/* Manufacturers Table */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ManufacturersTable
          manufacturers={manufacturers}
          loading={loading}
          deleteLoading={deleteLoading}
          onEdit={handleEditManufacturer}
          onDelete={handleDeleteClick}
          onAddManufacturer={handleAddManufacturer}
        />
      </div>

      {/* Pagination */}
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

      {/* Delete Dialog */}
      <DeleteConfirmDialog
        open={deleteDialog.open}
        title="Delete Manufacturer"
        itemName={deleteDialog.manufacturer?.name}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      {/* Snackbar */}
      {snackbar.open && (
        <div className="fixed bottom-5 right-5 z-50">
          <div
            className={`px-4 py-2 rounded shadow-lg text-white ${
              snackbar.severity === "success"
                ? "bg-green-600"
                : "bg-red-600"
            }`}
          >
            <div className="flex items-center justify-between space-x-4">
              <span>{snackbar.message}</span>
              <button
                onClick={handleSnackbarClose}
                className="text-white font-bold"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}