import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormField from "../../components/forms/FormField";
import FileUpload from "../../components/forms/FileUpload";
import Button from "../../components/Button";
import AlertMessage from "../../components/AlertMessage";
import { useManufacturerForm } from "../../hooks/useManufacturerForm";
import PageHeader from "../../components/PageHeader";

export default function AddEditManufacturerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const {
    formData,
    logoPreview,
    errors,
    loading,
    submitError,
    handleChange,
    handleLogoChange,
    handleSubmit,
    resetForm,
  } = useManufacturerForm(id, null); // Pass id as first parameter, null as second

  // The useManufacturerForm hook handles loading manufacturer data internally

  const handleSave = async () => {
    await handleSubmit(
      () => {
        // Success callback
        navigate("/manufacturers", {
          state: {
            message: `Manufacturer ${isEditMode ? "updated" : "created"} successfully!`,
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
    navigate("/manufacturers");
  };

  const handleReset = () => {
    resetForm();
  };

  // Show loading state while the hook is fetching manufacturer data in edit mode
  if (isEditMode && loading && !formData.name && !submitError) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-lg font-medium">Loading manufacturer data...</span>
      </div>
    );
  }

  return (
    <div className="p-4 w-full max-w-none">
      <PageHeader
        title={isEditMode ? "Edit Manufacturer" : "Add New Manufacturer"}
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Manufacturers", path: "/manufacturers" },
          { label: isEditMode ? "Edit Manufacturer" : "Add New Manufacturer" }
        ]}
        showBackButton
        onBack={handleCancel}
      />

      {/* Error Alert */}
      {submitError && <AlertMessage type="error" message={submitError} />}

      {/* Show error if manufacturer data failed to load in edit mode */}
      {isEditMode && submitError && submitError.includes('load manufacturer data') && (
        <div className="mb-4">
          <button
            onClick={() => navigate("/manufacturers")}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to Manufacturers
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
                Manufacturer Information
              </h2>

              <FormField
                label="Manufacturer Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="Enter manufacturer name (e.g., Toyota, BMW)"
                required
                helperText="Official name of the manufacturer"
              />

              <FormField
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                error={errors.country}
                placeholder="Enter country (e.g., Japan, Germany)"
                required
                helperText="Country where the manufacturer is based"
              />

              <FormField
                label="Founded Year"
                name="founded"
                type="number"
                value={formData.founded}
                onChange={handleChange}
                error={errors.founded}
                placeholder="Enter founded year (e.g., 1937)"
                helperText="Year when the company was founded (optional)"
                InputProps={{
                  min: 1800,
                  max: new Date().getFullYear()
                }}
              />

              <FormField
                label="Website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                error={errors.website}
                placeholder="https://www.example.com"
                helperText="Official website URL (optional)"
              />
            </div>

            {/* Right Column - Logo Upload */}
            <div className="lg:col-span-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Manufacturer Logo
              </h2>

              <div className="flex flex-col">
                <FileUpload
                  label="Upload Logo"
                  value={logoPreview}
                  onChange={handleLogoChange}
                  error={errors.logo}
                  helperText="Upload the manufacturer's logo (optional)"
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
              text={loading ? "Saving..." : isEditMode ? "Update Manufacturer" : "Create Manufacturer"}
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