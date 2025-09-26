import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
} from "@mui/material";
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import { usePartsData } from "../../hooks/usePartsData";
import PaginationControls from "../../components/PaginationControls";
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
  React.useEffect(() => {
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

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
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          Parts Management
        </Typography>
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
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Parts
              </Typography>
              <Typography variant="h4" component="div">
                {loading ? <CircularProgress size={30} /> : pagination.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Current Page
              </Typography>
              <Typography variant="h4" component="div">
                {loading ? <CircularProgress size={30} /> : pagination.page}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Pages
              </Typography>
              <Typography variant="h4" component="div">
                {loading ? <CircularProgress size={30} /> : pagination.pages}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Per Page
              </Typography>
              <Typography variant="h4" component="div">
                {loading ? <CircularProgress size={30} /> : pagination.limit}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Parts Table */}
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" component="h2">
              Parts Inventory
            </Typography>
            {searchQuery && (
              <Typography variant="body2" color="text.secondary">
                Search results for: "{searchQuery}"
              </Typography>
            )}
          </Box>

          <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Image</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Part Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>SKU</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Created</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <CircularProgress size={40} />
                      <Typography variant="body2" sx={{ mt: 2 }}>
                        Loading parts...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : parts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography variant="h6" color="text.secondary">
                        {searchQuery ? "No parts found matching your search" : "No parts available"}
                      </Typography>
                      {!searchQuery && (
                        <Button
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={handleAddPart}
                          sx={{ mt: 2 }}
                        >
                          Add Your First Part
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  parts.map((part) => (
                    <TableRow key={part._id} hover>
                      <TableCell>
                        {part.image ? (
                          <Avatar
                            src={part.image}
                            alt={part.name}
                            sx={{ width: 50, height: 50 }}
                            variant="rounded"
                          />
                        ) : (
                          <Avatar sx={{ width: 50, height: 50 }} variant="rounded">
                            <ImageIcon />
                          </Avatar>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: "medium", mb: 0.5 }}>
                          {part.name}
                        </Typography>
                        {part.description && (
                          <Typography variant="body2" color="text.secondary">
                            {part.description.length > 50
                              ? `${part.description.substring(0, 50)}...`
                              : part.description}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {part.sku ? (
                          <Chip
                            label={part.sku}
                            size="small"
                            sx={{
                              backgroundColor: "#e0f2fe",
                              color: "#0277bd",
                              fontWeight: "medium",
                            }}
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No SKU
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: "medium", color: "#10b981" }}>
                          {formatPrice(part.price)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(part.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() => handleEditPart(part._id)}
                            sx={{ minWidth: "auto" }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            startIcon={
                              deleteLoading === part._id ? (
                                <CircularProgress size={16} />
                              ) : (
                                <DeleteIcon />
                              )
                            }
                            onClick={() => handleDeleteClick(part)}
                            disabled={deleteLoading === part._id}
                            sx={{ minWidth: "auto" }}
                          >
                            Delete
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
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
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Part</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{deleteDialog.part?.name}"?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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