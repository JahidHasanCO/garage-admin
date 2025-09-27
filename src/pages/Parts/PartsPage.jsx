import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Alert,
  Snackbar,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { usePartsData } from "../../hooks/usePartsData";
import PaginationControls from "../../components/PaginationControls";
import PageHeader from "../../components/PageHeader";
import PartsTable from "./PartsTable";
import DeleteConfirmDialog from "../../components/DeleteConfirmDialog";


export default function PartsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  // Use the custom hook for parts data
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

  // Local state for UI
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    part: null,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  // Check for success message from navigation state
  useEffect(() => {
    if (location.state?.message && !location.state.cleared) {
      setSnackbar({
        open: true,
        message: location.state.message,
        severity: location.state.severity || "success",
      });
      // Clear the state to prevent showing the message again
      navigate(location.pathname, { replace: true, state: { cleared: true } });
    }
  }, [location, navigate]);

  const handleAddPart = () => {
    navigate("/parts/add");
  };

  const handleEditPart = (partId) => {
    navigate(`/parts/edit/${partId}`);
  };

  const handleDeleteClick = (part) => {
    setDeleteDialog({
      open: true,
      part,
    });
  };

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

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, part: null });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };


  if (error) {
    return (
      <Box sx={{ p: 3, width: "100%", minHeight: "100vh", flex: 1 }}>
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={refresh}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, width: "100%", minHeight: "100vh", flex: 1 }}>
      {/* Header */}
      <PageHeader
        title="Parts Management"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Parts", path: "/parts" },
        ]}
      />

      {/* Parts Table */}
      <PartsTable
        parts={parts}
        loading={loading}
        searchQuery={searchQuery}
        deleteLoading={deleteLoading}
        onEdit={handleEditPart}
        onDelete={handleDeleteClick}
        onAddPart={handleAddPart}
      />

      {/* Pagination */}
      <Box sx={{ mt: 2 }}>
        <PaginationControls
          page={pagination.page}
          pages={pagination.pages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          disabled={loading}
        />
      </Box>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialog.open}
        title="Delete Part"
        itemName={deleteDialog.part?.name}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}