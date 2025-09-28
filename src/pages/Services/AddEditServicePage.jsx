import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, PhotoIcon } from '@heroicons/react/24/outline';
import PageHeader from '../../components/PageHeader';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import FileUpload from '../../components/forms/FileUpload';
import AlertMessage from '../../components/AlertMessage';
import PartsSelector from '../../components/selectors/PartsSelector';
import { useServiceForm } from '../../hooks/useServiceForm';
import { partsService } from '../../api/partsService';
import { RouteNames } from '../../routes/RouteNames';

const AddEditServicePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
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
    setSubmitError
  } = useServiceForm(id);

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

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 5000);
  };

  const handleBackToServices = () => {
    navigate(RouteNames.SERVICES);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    const result = await handleSubmit();

    if (result.success) {
      showAlert(result.message, 'success');
      setTimeout(() => {
        navigate(RouteNames.SERVICES);
      }, 2000);
    } else {
      showAlert(result.error || 'An error occurred', 'error');
    }
  };

  const handlePartsSelect = (selectedPartIds) => {
    handlePartsChange(selectedPartIds);
  };

  const handleRemovePart = (partIdToRemove) => {
    const updatedParts = formData.parts_needed.filter(id => id !== partIdToRemove);
    handlePartsChange(updatedParts);
  };

  const handleAlertClose = () => {
    setAlert({ show: false, message: '', type: 'success' });
    setSubmitError(null);
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

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditing ? 'Edit Service' : 'Add New Service'}
        subtitle={isEditing ? 'Update service information' : 'Create a new service for your garage'}
      />

      {/* Alert Messages */}
      {(alert.show || submitError) && (
        <AlertMessage
          type={submitError ? 'error' : alert.type}
          message={submitError || alert.message}
          onClose={handleAlertClose}
        />
      )}

      <div className="bg-white shadow rounded-lg p-6">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            onClick={handleBackToServices}
            variant="outline"
            size="sm"
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Services
          </Button>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Service Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Image
            </label>
            <FileUpload
              onFileSelect={handleImageChange}
              accept="image/*"
              maxSize={5 * 1024 * 1024} // 5MB
              preview={formData.imagePreview}
              error={errors.image}
              className="max-w-md"
            />
          </div>

          {/* Service Name */}
          <InputField
            label="Service Name"
            name="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
            required
            placeholder="Enter service name"
          />

          {/* Service Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter service description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Price and Estimated Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Price ($)"
              name="price"
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              error={errors.price}
              required
              min="0"
              step="0.01"
              placeholder="0.00"
            />

            <InputField
              label="Estimated Time (minutes)"
              name="estimated_time"
              type="number"
              value={formData.estimated_time}
              onChange={(e) => handleInputChange('estimated_time', e.target.value)}
              error={errors.estimated_time}
              required
              min="0"
              placeholder="Enter time in minutes"
            />
          </div>

          {/* Discount */}
          <div className="max-w-md">
            <InputField
              label="Discount (%)"
              name="discount"
              type="number"
              value={formData.discount}
              onChange={(e) => handleInputChange('discount', e.target.value)}
              error={errors.discount}
              min="0"
              max="100"
              step="0.01"
              placeholder="0.00"
            />
          </div>

          {/* Parts Needed Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parts Needed
            </label>
            
            <div className="space-y-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPartsSelector({ open: true })}
                className="w-full sm:w-auto"
              >
                <PhotoIcon className="h-4 w-4 mr-2" />
                Select Parts ({formData.parts_needed.length})
              </Button>

              {/* Selected Parts Display */}
              {selectedPartsDetails.length > 0 && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Selected Parts ({selectedPartsDetails.length})
                  </h4>
                  
                  <div className="space-y-2 mb-3">
                    {selectedPartsDetails.map((part) => (
                      <div
                        key={part._id}
                        className="flex items-center justify-between bg-white p-3 rounded border"
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
                              <span className="text-gray-400 text-xs">No Image</span>
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
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemovePart(part._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total Parts Cost */}
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Total Parts Cost:</span>
                      <span className="text-sm font-bold text-green-600">
                        {formatCurrency(calculateTotalPartsPrice())}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {errors.parts_needed && (
                <p className="text-sm text-red-600">{errors.parts_needed}</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleBackToServices}
              disabled={loading}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : isEditing ? 'Update Service' : 'Create Service'}
            </Button>
          </div>
        </form>
      </div>

      {/* Parts Selector Modal */}
      <PartsSelector
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