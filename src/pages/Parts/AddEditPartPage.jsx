import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormField from "../../components/forms/FormField";
import FileUpload from "../../components/forms/FileUpload";
import Button from "../../components/Button";
import AlertMessage from "../../components/AlertMessage";
import { usePartForm } from "../../hooks/usePartForm";
import { partsService } from "../../api/partsService";
import PageHeader from "../../components/PageHeader";

export default function AddEditPartPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [loadError, setLoadError] = useState(null);
  const [partData, setPartData] = useState(null);

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
  } = usePartForm(partData, id);

  // Load existing part data for edit mode
  useEffect(() => {
    const loadPartData = async () => {
      try {
        setInitialLoading(true);
        const data = await partsService.getPartById(id);
        setPartData(data);
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
        navigate("/parts", {
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
    navigate("/parts");
  };

  const handleReset = () => {
    resetForm();
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primaryDeep"></div>
        <span className="ml-4 text-lg font-medium">Loading part data...</span>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="p-6">
        <AlertMessage type="error" message={loadError} />
        <button
          onClick={() => navigate("/parts")}
          className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryDeep"
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back to Parts
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 w-full max-w-none">
      <PageHeader
        title={isEditMode ? "Edit Part" : "Add New Part"}
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Parts", path: "/parts" },
          { label: isEditMode ? "Edit Part" : "Add New Part" }
        ]}
        showBackButton
        onBack={handleCancel}
      />

      {/* Error Alert */}
      {submitError && <AlertMessage type="error" message={submitError} />}

      {/* Main Form Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full">
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
            {/* Left Column - Form Fields */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Part Information
              </h2>

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
                  startAdornment: <span className="text-gray-500 mr-2">$</span>,
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
            </div>

            {/* Right Column - Image Upload */}
            <div className="lg:col-span-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Part Image
              </h2>

              <div className="flex flex-col">
                <FileUpload
                  label="Upload Image"
                  value={imagePreview}
                  onChange={handleImageChange}
                  error={errors.image}
                  helperText="Upload an image of the part (optional)"
                  accept="image/*"
                  maxSize={5 * 1024 * 1024} // 5MB
                />
              </div>
            </div>
          </div>

          <hr className="my-8 border-gray-200" />

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button
              text="Reset"
              variant="outlined"
              onClick={handleReset}
              disabled={loading}
              fullWidth={false}
            />

            <Button
              text="Cancel"
              variant="outlined"
              onClick={handleCancel}
              disabled={loading}
              fullWidth={false}
            />

            <Button
              text={loading ? "Saving..." : isEditMode ? "Update Part" : "Create Part"}
              variant="contained"
              onClick={handleSave}
              disabled={loading}
              fullWidth={false}
              startIcon={loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}