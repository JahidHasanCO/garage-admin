import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import AlertMessage from "../../components/AlertMessage";
import { useGarageForm } from "../../hooks/useGarageForm";
import { manufacturersService } from "../../api/manufacturersService";
import { fuelTypesService } from "../../api/fuelTypesService";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline";

const AddEditGaragePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  
  const [manufacturers, setManufacturers] = useState([]);
  const [fuelTypes, setFuelTypes] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const {
    formData,
    loading,
    error,
    alert,
    handleInputChange,
    handleSubmit,
    clearAlert
  } = useGarageForm(id);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [manufacturersResponse, fuelTypesResponse] = await Promise.all([
          manufacturersService.getAllManufacturers(),
          fuelTypesService.getAllFuelTypes()
        ]);
        setManufacturers(manufacturersResponse.data || []);
        setFuelTypes(fuelTypesResponse.data || []);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const success = await handleSubmit();
    if (success) {
      navigate('/garages', { 
        state: { 
          message: `Garage ${isEditing ? 'updated' : 'created'} successfully!`,
          type: 'success'
        }
      });
    }
  };

  const handleManufacturerToggle = (manufacturerId) => {
    const currentIds = formData.supportedManufacturers || [];
    const newIds = currentIds.includes(manufacturerId)
      ? currentIds.filter(id => id !== manufacturerId)
      : [...currentIds, manufacturerId];
    
    handleInputChange('supportedManufacturers', newIds);
  };

  const handleFuelTypeToggle = (fuelTypeId) => {
    const currentIds = formData.supportedFuelTypes || [];
    const newIds = currentIds.includes(fuelTypeId)
      ? currentIds.filter(id => id !== fuelTypeId)
      : [...currentIds, fuelTypeId];
    
    handleInputChange('supportedFuelTypes', newIds);
  };

  if (loadingData) {
    return (
      <div className="flex flex-col h-full">
        <PageHeader title={isEditing ? "Edit Garage" : "Add New Garage"} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="loader mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <PageHeader title={isEditing ? "Edit Garage" : "Add New Garage"} />

      {/* Breadcrumb */}
      <div className="px-4 pb-4">
        <nav className="flex items-center text-sm text-gray-500">
          <Link to="/dashboard" className="flex items-center hover:text-gray-700">
            <HomeIcon className="w-4 h-4 mr-1" />
            Dashboard
          </Link>
          <ChevronRightIcon className="w-4 h-4 mx-2" />
          <Link to="/garages" className="hover:text-gray-700">
            Garages
          </Link>
          <ChevronRightIcon className="w-4 h-4 mx-2" />
          <span className="text-gray-900">
            {isEditing ? "Edit Garage" : "Add New Garage"}
          </span>
        </nav>
      </div>

      {alert && (
        <div className="px-4 pb-4">
          <AlertMessage 
            type={alert.type} 
            message={alert.message} 
            onDismiss={clearAlert}
          />
        </div>
      )}

      {error && (
        <div className="px-4 pb-4">
          <AlertMessage 
            type="error" 
            message={error} 
          />
        </div>
      )}

      <div className="flex-1 px-4 pb-4 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column - Basic Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h3>
                
                <div className="space-y-6">
                  <InputField
                    label="Garage Name"
                    name="name"
                    value={formData.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter garage name"
                    required
                  />

                  <InputField
                    label="Address"
                    name="address"
                    value={formData.address || ""}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Enter garage address"
                    multiline
                    rows={3}
                    required
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="City"
                      name="city"
                      value={formData.city || ""}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="Enter city"
                      required
                    />

                    <InputField
                      label="Country"
                      name="country"
                      value={formData.country || ""}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      placeholder="Enter country"
                      required
                    />
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Geographic Coordinates</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        label="Latitude"
                        name="geo.lat"
                        type="number"
                        step="any"
                        value={formData.geo?.lat || ""}
                        onChange={(e) => handleInputChange("geo.lat", parseFloat(e.target.value) || "")}
                        placeholder="e.g., 23.8103"
                      />

                      <InputField
                        label="Longitude"
                        name="geo.lng"
                        type="number"
                        step="any"
                        value={formData.geo?.lng || ""}
                        onChange={(e) => handleInputChange("geo.lng", parseFloat(e.target.value) || "")}
                        placeholder="e.g., 90.4125"
                      />
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Contact Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        label="Phone"
                        name="contact.phone"
                        value={formData.contact?.phone || ""}
                        onChange={(e) => handleInputChange("contact.phone", e.target.value)}
                        placeholder="Enter phone number"
                      />

                      <InputField
                        label="Email"
                        name="contact.email"
                        type="email"
                        value={formData.contact?.email || ""}
                        onChange={(e) => handleInputChange("contact.email", e.target.value)}
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Supported Services */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Supported Services</h3>
                
                <div className="space-y-8">
                  {/* Manufacturers */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4">Supported Manufacturers</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4">
                      {manufacturers.map((manufacturer) => (
                        <label key={manufacturer._id} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(formData.supportedManufacturers || []).includes(manufacturer._id)}
                            onChange={() => handleManufacturerToggle(manufacturer._id)}
                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          />
                          <span className="text-sm text-gray-700">{manufacturer.name}</span>
                        </label>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Selected: {(formData.supportedManufacturers || []).length} manufacturers
                    </p>
                  </div>

                  {/* Fuel Types */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4">Supported Fuel Types</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4">
                      {fuelTypes.map((fuelType) => (
                        <label key={fuelType._id} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(formData.supportedFuelTypes || []).includes(fuelType._id)}
                            onChange={() => handleFuelTypeToggle(fuelType._id)}
                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          />
                          <span className="text-sm text-gray-700">{fuelType.title}</span>
                        </label>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Selected: {(formData.supportedFuelTypes || []).length} fuel types
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end space-x-4 bg-white rounded-lg shadow-sm p-6">
              <Button
                text="Cancel"
                variant="secondary"
                onClick={() => navigate('/garages')}
                disabled={loading}
              />
              <Button
                text={loading ? "Saving..." : (isEditing ? "Update Garage" : "Create Garage")}
                type="submit"
                disabled={loading}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditGaragePage;