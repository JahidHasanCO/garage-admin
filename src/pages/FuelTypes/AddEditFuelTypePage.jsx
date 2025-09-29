import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormField from "../../components/forms/FormField";
import FileUpload from "../../components/forms/FileUpload";
import Button from "../../components/Button";
import AlertMessage from "../../components/AlertMessage";
import { useFuelTypeForm } from "../../hooks/useFuelTypeForm";
import PageHeader from "../../components/PageHeader";

export default function AddEditFuelTypePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

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
  } = useFuelTypeForm(id, null); // Pass id as first parameter, null as second

  // The useFuelTypeForm hook handles loading fuel type data internally

  const handleSave = async () => {
    await handleSubmit(
      () => {
        // Success callback
        navigate("/fuel-types", {
          state: {
            message: `Fuel type ${isEditMode ? "updated" : "created"} successfully!`,
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
    navigate("/fuel-types");
  };

  const handleReset = () => {
    resetForm();
  };

  // Show loading state while the hook is fetching fuel type data in edit mode
  if (isEditMode && loading && !formData.title && !submitError) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-lg font-medium">Loading fuel type data...</span>
      </div>
    );
  }

  return (
    <div className="p-4 w-full max-w-none">
      <PageHeader
        title={isEditMode ? "Edit Fuel Type" : "Add New Fuel Type"}
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Fuel Types", path: "/fuel-types" },
          { label: isEditMode ? "Edit Fuel Type" : "Add New Fuel Type" }
        ]}
        showBackButton
        onBack={handleCancel}
      />

      {/* Error Alert */}
      {submitError && <AlertMessage type="error" message={submitError} />}

      {/* Show error if fuel type data failed to load in edit mode */}
      {isEditMode && submitError && submitError.includes('load fuel type data') && (
        <div className="mb-4">
          <button
            onClick={() => navigate("/fuel-types")}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to Fuel Types
          </button>
        </div>
      )}

      {/* Main Form Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full">
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
            {/* Left Column - Form Fields */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Fuel Type Information
              </h2>

              <FormField
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={errors.title}
                placeholder="Enter fuel type title (e.g., Petrol, Diesel)"
                required
                helperText="Display name for the fuel type"
              />

              <FormField
                label="Value"
                name="value"
                value={formData.value}
                onChange={handleChange}
                error={errors.value}
                placeholder="Enter unique identifier (e.g., petrol, diesel)"
                required
                helperText="Unique identifier used in code (lowercase, hyphens/underscores only)"
              />
            </div>

            {/* Right Column - Image Upload */}
            <div className="lg:col-span-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Fuel Type Image
              </h2>

              <div className="flex flex-col">
                <FileUpload
                  label="Upload Image"
                  value={imagePreview}
                  onChange={handleImageChange}
                  error={errors.image}
                  helperText="Upload an image for the fuel type (optional)"
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
              text={loading ? "Saving..." : isEditMode ? "Update Fuel Type" : "Create Fuel Type"}
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