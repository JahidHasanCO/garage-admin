import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CubeIcon } from '@heroicons/react/24/outline';
import PageHeader from '../../components/PageHeader';
import FormField from '../../components/forms/FormField';
import Button from '../../components/Button';
import FileUpload from '../../components/forms/FileUpload';
import AlertMessage from '../../components/AlertMessage';
import PartsMultiSelector from '../../components/selectors/PartsMultiSelector';
import { useServiceForm } from '../../hooks/useServiceForm';
import { partsService } from '../../api/partsService';

const AddEditServicePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [loadError, setLoadError] = useState(null);
  const [serviceData, setServiceData] = useState(null);
  const [partsSelector, setPartsSelector] = useState({ open: false });
  const [selectedPartsDetails, setSelectedPartsDetails] = useState([]);

  const {
    formData,
    errors,
    loading,
    submitError,
    handleInputChange,
    handleImageChange,
    handlePartsChange,
    handleSubmit,
    resetForm
  } = useServiceForm(serviceData, id);

  // Load existing service data for edit mode
  useEffect(() => {
    const loadServiceData = async () => {
      if (isEditing && id) {
        try {
          setInitialLoading(true);
          // Use the hook's built-in loading instead of separate API call
          setServiceData({ _id: id });
        } catch (error) {
          setLoadError(error.message);
        } finally {
          setInitialLoading(false);
        }
      }
    };

    loadServiceData();
  }, [id, isEditing]);

  // Fetch selected parts details when parts selection changes
  useEffect(() => {
    const fetchPartsDetails = async () => {
      if (formData.parts_needed.length === 0) {
        setSelectedPartsDetails([]);
        return;
      }

      try {
        // Fetch all parts to find the selected ones
        const response = await partsService.getAllParts(1, 100); // Get enough to cover selections
        const allParts = response.parts || [];
        
        const selectedParts = allParts.filter(part => 
          formData.parts_needed.includes(part._id)
        );
        
        setSelectedPartsDetails(selectedParts);
      } catch (err) {
        console.error('Error fetching parts details:', err);
      }
    };

    fetchPartsDetails();
  }, [formData.parts_needed]);

  const handleSave = async () => {
    const result = await handleSubmit();
    
    if (result && result.success) {
      // Success - navigate to services list with success message
      navigate("/services", {
        state: {
          message: `Service ${isEditing ? "updated" : "created"} successfully!`,
          severity: "success"
        }
      });
    } else if (result && !result.success) {
      // Error is already handled by the hook and displayed via submitError
      console.error("Save error:", result.error);
    }
  };

  const handleCancel = () => {
    navigate("/services");
  };

  const handleReset = () => {
    resetForm();
  };

  const handlePartsSelect = (selectedPartIds) => {
    handlePartsChange(selectedPartIds);
  };

  const handleRemovePart = (partIdToRemove) => {
    const updatedParts = formData.parts_needed.filter(id => id !== partIdToRemove);
    handlePartsChange(updatedParts);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const calculateTotalPartsPrice = () => {
    return selectedPartsDetails.reduce((total, part) => total + (part.price || 0), 0);
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primaryDeep"></div>
        <span className="ml-4 text-lg font-medium">Loading service data...</span>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="p-6">
        <AlertMessage type="error" message={loadError} />
        <button
          onClick={() => navigate("/services")}
          className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryDeep"
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back to Services
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 w-full max-w-none">
      <PageHeader
        title={isEditing ? "Edit Service" : "Add New Service"}
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Services", path: "/services" },
          { label: isEditing ? "Edit Service" : "Add New Service" }
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
                Service Information
              </h2>

              <FormField
                label="Service Name"
                name="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={errors.name}
                placeholder="Enter service name"
                required
              />

              <FormField
                label="Description"
                name="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                error={errors.description}
                placeholder="Enter service description"
                multiline
                rows={4}
                helperText="Detailed description of the service"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Price ($)"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  error={errors.price}
                  required
                  placeholder="0.00"
                  InputProps={{
                    min: 0,
                    step: 0.01
                  }}
                />

                <FormField
                  label="Estimated Time (minutes)"
                  name="estimated_time"
                  type="number"
                  value={formData.estimated_time}
                  onChange={(e) => handleInputChange('estimated_time', e.target.value)}
                  error={errors.estimated_time}
                  required
                  placeholder="Enter time in minutes"
                  InputProps={{
                    min: 0
                  }}
                />
              </div>

              <div className="max-w-md">
                <FormField
                  label="Discount (%)"
                  name="discount"
                  type="number"
                  value={formData.discount}
                  onChange={(e) => handleInputChange('discount', e.target.value)}
                  error={errors.discount}
                  placeholder="0.00"
                  helperText="Optional discount percentage"
                  InputProps={{
                    min: 0,
                    max: 100,
                    step: 0.01
                  }}
                />
              </div>

              {/* Parts Needed Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parts Needed
                </label>
                {selectedPartsDetails.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center p-3 border border-gray-300 rounded-lg bg-gray-50">
                      <CubeIcon className="w-8 h-8 text-gray-400 mr-3" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{selectedPartsDetails.length} parts selected</p>
                        <p className="text-sm text-gray-500">Total cost: {formatCurrency(calculateTotalPartsPrice())}</p>
                      </div>
                      <Button
                        text="Change Parts"
                        variant="outlined"
                        onClick={() => setPartsSelector({ open: true })}
                        fullWidth={false}
                      />
                    </div>
                    
                    {/* Selected Parts List */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-64 overflow-y-auto">
                      <h4 className="text-sm font-medium text-gray-800 mb-3">
                        Selected Parts ({selectedPartsDetails.length})
                      </h4>
                      
                      <div className="space-y-2">
                        {selectedPartsDetails.map((part) => (
                          <div
                            key={part._id}
                            className="flex items-center justify-between bg-white p-3 rounded border border-gray-200"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                                {part.image ? (
                                  <img
                                    src={part.image}
                                    alt={part.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <CubeIcon className="w-5 h-5 text-gray-400" />
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{part.name}</p>
                                <p className="text-xs text-gray-500">SKU: {part.sku || 'N/A'}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-semibold text-green-600">
                                {formatCurrency(part.price)}
                              </span>
                              <Button
                                text="Remove"
                                variant="outlined"
                                onClick={() => handleRemovePart(part._id)}
                                fullWidth={false}
                                className="text-red-600 hover:text-red-800"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button
                    text="Select Parts"
                    variant="outlined"
                    onClick={() => setPartsSelector({ open: true })}
                    fullWidth={true}
                  />
                )}
                {errors.parts_needed && (
                  <p className="mt-1 text-sm text-red-600">{errors.parts_needed}</p>
                )}
              </div>
            </div>

            {/* Right Column - Image Upload */}
            <div className="lg:col-span-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Service Image
              </h2>

              <div className="flex flex-col">
                <FileUpload
                  label="Upload Image"
                  value={formData.imagePreview}
                  onChange={handleImageChange}
                  error={errors.image}
                  helperText="Upload an image of the service (optional)"
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
              text={loading ? "Saving..." : isEditing ? "Update Service" : "Create Service"}
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

      {/* Parts Selector Modal */}
      <PartsMultiSelector
        isOpen={partsSelector.open}
        onClose={() => setPartsSelector({ open: false })}
        onSelect={handlePartsSelect}
        selectedParts={formData.parts_needed}
        title="Select Parts Needed"
      />
    </div>
  );
};

export default AddEditServicePage;