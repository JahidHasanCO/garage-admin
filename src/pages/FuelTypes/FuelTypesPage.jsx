import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFuelTypesData } from "../../hooks/useFuelTypesData";
import PaginationControls from "../../components/PaginationControls";
import PageHeader from "../../components/PageHeader";
import FuelTypesTable from "./FuelTypesTable";
import DeleteConfirmDialog from "../../components/DeleteConfirmDialog";

export default function FuelTypesPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    fuelTypes,
    loading,
    error,
    pagination,
    searchQuery,
    deleteLoading,
    handlePageChange,
    handleLimitChange,
    deleteFuelType,
    refresh,
  } = useFuelTypesData();

  const [deleteDialog, setDeleteDialog] = useState({ open: false, fuelType: null });
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

  const handleAddFuelType = () => navigate("/fuel-types/add");
  const handleEditFuelType = (fuelTypeId) => navigate(`/fuel-types/edit/${fuelTypeId}`);
  const handleDeleteClick = (fuelType) => setDeleteDialog({ open: true, fuelType });

  const handleDeleteConfirm = async () => {
    if (deleteDialog.fuelType) {
      const result = await deleteFuelType(deleteDialog.fuelType._id);

      if (result.success) {
        setSnackbar({
          open: true,
          message: "Fuel type deleted successfully",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: result.error || "Failed to delete fuel type",
          severity: "error",
        });
      }
    }
    setDeleteDialog({ open: false, fuelType: null });
  };

  const handleDeleteCancel = () => setDeleteDialog({ open: false, fuelType: null });
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
          title="Fuel Types Management"
          breadcrumbs={[
            { label: "Dashboard", path: "/dashboard" },
            { label: "Fuel Types", path: "/fuel-types" },
          ]}
        />
      </div>

      {/* Fuel Types Table */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <FuelTypesTable
          fuelTypes={fuelTypes}
          loading={loading}
          searchQuery={searchQuery}
          deleteLoading={deleteLoading}
          onEdit={handleEditFuelType}
          onDelete={handleDeleteClick}
          onAddFuelType={handleAddFuelType}
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
        title="Delete Fuel Type"
        itemName={deleteDialog.fuelType?.title}
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