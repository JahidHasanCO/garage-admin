import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Alert,
  Breadcrumbs,
  Link,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import FormField from "../../components/forms/FormField";
import FileUpload from "../../components/forms/FileUpload";
import { usePartForm } from "../../hooks/usePartForm";
import { partsService } from "../../api/partsService";

export default function AddEditPartPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [loadError, setLoadError] = useState(null);

  const {
    formData,
    imagePreview,
    errors,
    loading,
    submitError,
    handleChange,
    handleImageChange,
    handleSubmit,
    resetForm,
  } = usePartForm(null, id);

  // Load existing part data for edit mode
  useEffect(() => {
    const loadPartData = async () => {
      try {
        setInitialLoading(true);
        await partsService.getPartById(id);
        
        // The usePartForm hook will handle setting the form data
        // We need to pass it through the hook's initialization
        window.location.reload(); // Temporary solution - in production, you'd handle this better
        
      } catch (error) {
        setLoadError(error.message);
      } finally {
        setInitialLoading(false);
      }
    };

    if (isEditMode) {
      loadPartData();
    }
  }, [id, isEditMode]);

  const handleSave = async () => {
    await handleSubmit(
      () => {
        // Success callback
        navigate("/dashboard/parts", {
          state: {
            message: `Part ${isEditMode ? "updated" : "created"} successfully!`,
            severity: "success"
          }
        });
      },
      (error) => {
        // Error callback - handled by the hook
        console.error("Save error:", error);
      }
    );
  };

  const handleCancel = () => {
    navigate("/dashboard/parts");
  };

  const handleReset = () => {
    resetForm();
  };

  if (initialLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading part data...
        </Typography>
      </Box>
    );
  }

  if (loadError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {loadError}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/dashboard/parts")}
        >
          Back to Parts
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate("/dashboard");
          }}
          sx={{ textDecoration: "none" }}
        >
          Dashboard
        </Link>
        <Link
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate("/dashboard/parts");
          }}
          sx={{ textDecoration: "none" }}
        >
          Parts
        </Link>
        <Typography color="text.primary">
          {isEditMode ? "Edit Part" : "Add New Part"}
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Button
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={handleCancel}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          {isEditMode ? "Edit Part" : "Add New Part"}
        </Typography>
      </Box>

      {/* Error Alert */}
      {submitError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {submitError}
        </Alert>
      )}

      {/* Main Form Card */}
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={4}>
            {/* Left Column - Form Fields */}
            <Grid item xs={12} md={8}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold" }}>
                Part Information
              </Typography>

              <FormField
                label="Part Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="Enter part name"
                required
              />

              <FormField
                label="SKU"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                error={errors.sku}
                placeholder="Enter SKU (optional)"
                helperText="Unique identifier for inventory tracking"
              />

              <FormField
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                error={errors.price}
                placeholder="0.00"
                required
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                }}
              />

              <FormField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={errors.description}
                placeholder="Enter part description"
                multiline
                rows={4}
                helperText="Detailed description of the part"
              />
            </Grid>

            {/* Right Column - Image Upload */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold" }}>
                Part Image
              </Typography>

              <FileUpload
                label="Upload Image"
                value={imagePreview}
                onChange={handleImageChange}
                error={errors.image}
                helperText="Upload an image of the part (optional)"
                accept="image/*"
                maxSize={5 * 1024 * 1024} // 5MB
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              onClick={handleReset}
              disabled={loading}
              sx={{ minWidth: 120 }}
            >
              Reset
            </Button>

            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={loading}
              sx={{ minWidth: 120 }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
              onClick={handleSave}
              disabled={loading}
              sx={{
                minWidth: 120,
                backgroundColor: "#3b82f6",
                "&:hover": {
                  backgroundColor: "#2563eb",
                },
              }}
            >
              {loading ? "Saving..." : isEditMode ? "Update Part" : "Create Part"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}