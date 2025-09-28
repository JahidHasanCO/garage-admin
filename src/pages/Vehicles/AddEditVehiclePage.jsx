import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormField from "../../components/forms/FormField";
import FileUpload from "../../components/forms/FileUpload";
import Button from "../../components/Button";
import AlertMessage from "../../components/AlertMessage";
import { useVehicleForm } from "../../hooks/useVehicleForm";
import { vehiclesService } from "../../api/vehiclesService";
import PageHeader from "../../components/PageHeader";
import ManufacturerSelector from "../../components/selectors/ManufacturerSelector";
import FuelTypeSelector from "../../components/selectors/FuelTypeSelector";

export default function AddEditVehiclePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [loadError, setLoadError] = useState(null);
  const [vehicleData, setVehicleData] = useState(null);
  
  // Modal states
  const [showManufacturerSelector, setShowManufacturerSelector] = useState(false);
  const [showFuelTypeSelector, setShowFuelTypeSelector] = useState(false);

  const {
    formData,
    selectedManufacturer,
    selectedFuelType,
    imagePreview,
    errors,
    loading,
    submitError,
    handleChange,
    handleManufacturerSelect,
    handleFuelTypeSelect,
    handleImageChange,
    handleSubmit,
    resetForm,
  } = useVehicleForm(vehicleData, id);

  // Load existing vehicle data for edit mode
  useEffect(() => {
    const loadVehicleData = async () => {
      try {
        setInitialLoading(true);
        const data = await vehiclesService.getVehicleById(id);
        setVehicleData(data);
      } catch (error) {
        setLoadError(error.message);
      } finally {
        setInitialLoading(false);
      }
    };

    if (isEditMode) {
      loadVehicleData();
    }
  }, [id, isEditMode]);

  const handleSave = async () => {
    await handleSubmit(
      () => {
        // Success callback
        navigate("/vehicles", {
          state: {
            message: `Vehicle ${isEditMode ? "updated" : "created"} successfully!`,
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
    navigate("/vehicles");
  };

  const handleReset = () => {
    resetForm();
  };

  // Transmission options
  const transmissionOptions = [
    { value: "manual", label: "Manual" },
    { value: "automatic", label: "Automatic" },
    { value: "cvt", label: "CVT" },
    { value: "semi-automatic", label: "Semi-Automatic" },
  ];

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primaryDeep"></div>
        <span className="ml-4 text-lg font-medium">Loading vehicle data...</span>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="p-6">
        <AlertMessage type="error" message={loadError} />
        <button
          onClick={() => navigate("/vehicles")}
          className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryDeep"
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back to Vehicles
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 w-full max-w-none">
      <PageHeader
        title={isEditMode ? "Edit Vehicle" : "Add New Vehicle"}
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Vehicles", path: "/vehicles" },
          { label: isEditMode ? "Edit Vehicle" : "Add New Vehicle" }
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
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Vehicle Information
              </h2>

              {/* Manufacturer Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manufacturer <span className="text-red-500">*</span>
                </label>
                {selectedManufacturer ? (
                  <div className="flex items-center p-3 border border-gray-300 rounded-lg bg-gray-50">
                    {selectedManufacturer.logo && (
                      <img
                        src={selectedManufacturer.logo}
                        alt={selectedManufacturer.name}
                        className="w-8 h-8 object-contain mr-3"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{selectedManufacturer.name}</p>
                      <p className="text-sm text-gray-500">{selectedManufacturer.country}</p>
                    </div>
                    <Button
                      text="Change"
                      variant="outlined"
                      onClick={() => setShowManufacturerSelector(true)}
                      fullWidth={false}
                    />
                  </div>
                ) : (
                  <Button
                    text="Select Manufacturer"
                    variant="outlined"
                    onClick={() => setShowManufacturerSelector(true)}
                    fullWidth={true}
                  />
                )}
                {errors.manufacturer && (
                  <p className="mt-1 text-sm text-red-600">{errors.manufacturer}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  error={errors.model}
                  placeholder="Enter model (e.g., A4, Camry)"
                  required
                />

                <FormField
                  label="Year"
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleChange}
                  error={errors.year}
                  placeholder="Enter year"
                  required
                  InputProps={{
                    min: 1900,
                    max: new Date().getFullYear() + 1
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="License Plate"
                  name="license_plate"
                  value={formData.license_plate}
                  onChange={handleChange}
                  error={errors.license_plate}
                  placeholder="Enter license plate (e.g., DHA-1234)"
                  required
                  helperText="3-10 characters, letters, numbers, and hyphens only"
                />

                <FormField
                  label="VIN"
                  name="vin"
                  value={formData.vin}
                  onChange={handleChange}
                  error={errors.vin}
                  placeholder="Enter VIN (optional)"
                  helperText="Vehicle Identification Number (11-17 characters)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  error={errors.color}
                  placeholder="Enter color (e.g., Black, White)"
                  required
                />

                <FormField
                  label="Mileage (km)"
                  name="mileage"
                  type="number"
                  value={formData.mileage}
                  onChange={handleChange}
                  error={errors.mileage}
                  placeholder="Enter mileage"
                  required
                  InputProps={{
                    min: 0
                  }}
                />
              </div>

              {/* Fuel Type Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuel Type <span className="text-red-500">*</span>
                </label>
                {selectedFuelType ? (
                  <div className="flex items-center p-3 border border-gray-300 rounded-lg bg-gray-50">
                    {selectedFuelType.image && (
                      <img
                        src={selectedFuelType.image}
                        alt={selectedFuelType.title}
                        className="w-8 h-8 object-contain mr-3"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{selectedFuelType.title}</p>
                      <p className="text-sm text-gray-500">Value: {selectedFuelType.value}</p>
                    </div>
                    <Button
                      text="Change"
                      variant="outlined"
                      onClick={() => setShowFuelTypeSelector(true)}
                      fullWidth={false}
                    />
                  </div>
                ) : (
                  <Button
                    text="Select Fuel Type"
                    variant="outlined"
                    onClick={() => setShowFuelTypeSelector(true)}
                    fullWidth={true}
                  />
                )}
                {errors.fuel_type && (
                  <p className="mt-1 text-sm text-red-600">{errors.fuel_type}</p>
                )}
              </div>

              <FormField
                label="Transmission"
                name="transmission"
                type="select"
                value={formData.transmission}
                onChange={handleChange}
                error={errors.transmission}
                options={transmissionOptions}
                required
              />

              <FormField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={errors.description}
                placeholder="Enter vehicle description (optional)"
                multiline
                rows={3}
                helperText="Additional details about the vehicle"
              />
            </div>

            {/* Right Column - Image Upload */}
            <div className="lg:col-span-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Vehicle Image
              </h2>

              <div className="flex flex-col">
                <FileUpload
                  label="Upload Image"
                  value={imagePreview}
                  onChange={handleImageChange}
                  error={errors.image}
                  helperText="Upload an image of the vehicle (optional)"
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
              text={loading ? "Saving..." : isEditMode ? "Update Vehicle" : "Create Vehicle"}
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

      {/* Manufacturer Selector Modal */}
      <ManufacturerSelector
        isOpen={showManufacturerSelector}
        onClose={() => setShowManufacturerSelector(false)}
        onSelect={handleManufacturerSelect}
        selectedManufacturer={selectedManufacturer}
      />

      {/* Fuel Type Selector Modal */}
      <FuelTypeSelector
        isOpen={showFuelTypeSelector}
        onClose={() => setShowFuelTypeSelector(false)}
        onSelect={handleFuelTypeSelect}
        selectedFuelType={selectedFuelType}
      />
    </div>
  );
}