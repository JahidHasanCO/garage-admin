import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { usePartsData } from "../../hooks/usePartsData";
import PaginationControls from "../../components/PaginationControls";
import PageHeader from "../../components/PageHeader";
import PartsTable from "./PartsTable";
import DeleteConfirmDialog from "../../components/DeleteConfirmDialog";

export default function PartsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    parts,
    loading,
    error,
    pagination,
    searchQuery,
    deleteLoading,
    handlePageChange,
    handleLimitChange,
    deletePart,
    refresh,
  } = usePartsData();

  const [deleteDialog, setDeleteDialog] = useState({ open: false, part: null });
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

  const handleAddPart = () => navigate("/parts/add");
  const handleEditPart = (partId) => navigate(`/parts/edit/${partId}`);
  const handleDeleteClick = (part) => setDeleteDialog({ open: true, part });

  const handleDeleteConfirm = async () => {
    if (deleteDialog.part) {
      const result = await deletePart(deleteDialog.part._id);

      if (result.success) {
        setSnackbar({
          open: true,
          message: "Part deleted successfully",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: result.error || "Failed to delete part",
          severity: "error",
        });
      }
    }
    setDeleteDialog({ open: false, part: null });
  };

  const handleDeleteCancel = () => setDeleteDialog({ open: false, part: null });
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
          title="Parts Management"
          breadcrumbs={[
            { label: "Dashboard", path: "/dashboard" },
            { label: "Parts", path: "/parts" },
          ]}
        />
      </div>

      {/* Parts Table */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <PartsTable
          parts={parts}
          loading={loading}
          searchQuery={searchQuery}
          deleteLoading={deleteLoading}
          onEdit={handleEditPart}
          onDelete={handleDeleteClick}
          onAddPart={handleAddPart}
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
        title="Delete Part"
        itemName={deleteDialog.part?.name}
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
