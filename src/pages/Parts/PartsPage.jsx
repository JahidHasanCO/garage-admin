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
import StatsGrid from "../../components/StatsGrid";
import PartsTable from "../../components/PartsTable";
import DeleteConfirmDialog from "../../components/DeleteConfirmDialog";
// Temporarily disabled search integration to fix infinite loop
// import { useSearch } from "../../contexts/useSearchContext";

export default function PartsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  // Temporarily disabled search integration to fix infinite loop
  // const { registerSearchHandler, unregisterSearchHandler } = useSearch();
  
  // Use the custom hook for parts data
  const {
    parts,
    loading,
    error,
    pagination,
    searchQuery,
    deleteLoading,
    handlePageChange,
    // Temporarily disabled search to fix infinite loop
    // handleSearch,
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

  // Create a stable search handler to prevent infinite loops
  // Temporarily disabled to fix infinite loop
  // const stableHandleSearch = useCallback((query) => {
  //   handleSearch(query);
  // }, [handleSearch]);

  // Register search handler for this page
  // Temporarily disabled to fix infinite loop
  // useEffect(() => {
  //   registerSearchHandler('parts', stableHandleSearch);
  //   
  //   return () => {
  //     unregisterSearchHandler('parts');
  //   };
  // }, [registerSearchHandler, unregisterSearchHandler, stableHandleSearch]);

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
    navigate("/dashboard/parts/add");
  };

  const handleEditPart = (partId) => {
    navigate(`/dashboard/parts/edit/${partId}`);
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

  // Prepare stats data
  const statsData = [
    {
      title: "Total Parts",
      value: pagination.total,
    },
    {
      title: "Current Page", 
      value: pagination.page,
    },
    {
      title: "Total Pages",
      value: pagination.pages,
    },
    {
      title: "Per Page",
      value: pagination.limit,
    },
  ];

  // Prepare action button for header
  const actionButton = (
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={handleAddPart}
      sx={{
        backgroundColor: "#3b82f6",
        "&:hover": {
          backgroundColor: "#2563eb",
        },
      }}
    >
      Add New Part
    </Button>
  );

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
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
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <PageHeader 
        title="Parts Management"
        actionButton={actionButton}
      />

      {/* Stats Cards */}
      <StatsGrid stats={statsData} loading={loading} />

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
          onLimitChange={() => {
            // Handle limit change - refresh the data
            refresh();
          }}
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