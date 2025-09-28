import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import FormField from "../../components/forms/FormField";
import FileUpload from "../../components/forms/FileUpload";
import Button from "../../components/Button";
import AlertMessage from "../../components/AlertMessage";
import ServicesMultiSelector from "../../components/selectors/ServicesMultiSelector";
import GaragesMultiSelector from "../../components/selectors/GaragesMultiSelector";
import ManufacturerMultiSelector from "../../components/selectors/ManufacturerMultiSelector";
import FuelTypeMultiSelector from "../../components/selectors/FuelTypeMultiSelector";
import { useServicePackageForm } from "../../hooks/useServicePackageForm";
import { getAllServices } from "../../api/servicesService";
import { getAllGarages } from "../../api/garagesService";
import { manufacturersService } from "../../api/manufacturersService";
import { fuelTypesService } from "../../api/fuelTypesService";
import { CubeIcon, WrenchScrewdriverIcon, BuildingStorefrontIcon, FireIcon, BuildingOffice2Icon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

const AddEditServicePackagePage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    const [services, setServices] = useState([]);
    const [garages, setGarages] = useState([]);
    const [manufacturers, setManufacturers] = useState([]);
    const [fuelTypes, setFuelTypes] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);

    // Modal states
    const [servicesSelectorOpen, setServicesSelectorOpen] = useState(false);
    const [garagesSelectorOpen, setGaragesSelectorOpen] = useState(false);
    const [manufacturerSelectorOpen, setManufacturerSelectorOpen] = useState(false);
    const [fuelTypeSelectorOpen, setFuelTypeSelectorOpen] = useState(false);

    // Selected items details for display
    const [selectedServicesDetails, setSelectedServicesDetails] = useState([]);
    const [selectedGaragesDetails, setSelectedGaragesDetails] = useState([]);
    const [selectedManufacturersDetails, setSelectedManufacturersDetails] = useState([]);
    const [selectedFuelTypesDetails, setSelectedFuelTypesDetails] = useState([]);

    const {
        formData,
        imageFile: _imageFile,
        imagePreview,
        errors,
        loading,
        error,
        alert,
        handleInputChange,
        handleImageChange,
        handleFieldBlur,
        handleSubmit,
        clearAlert
    } = useServicePackageForm(id);

    useEffect(() => {
        const loadData = async () => {
            try {
                setInitialLoading(true);
                // Fetch all required data without pagination
                const [servicesResponse, garagesResponse, manufacturersResponse, fuelTypesResponse] = await Promise.all([
                    getAllServices(1, 1000),
                    getAllGarages(1, 1000),
                    manufacturersService.getAllManufacturers(1, 1000),
                    fuelTypesService.getAllFuelTypes(1, 1000)
                ]);

                setServices(servicesResponse.services || servicesResponse.data || []);
                setGarages(garagesResponse.garages || garagesResponse.data || []);
                setManufacturers(manufacturersResponse.data || []);
                setFuelTypes(fuelTypesResponse.data || []);
            } catch (err) {
                console.error('Error loading data:', err);
                setLoadError(err.message);
            } finally {
                setInitialLoading(false);
            }
        };

        loadData();
    }, []);

    // Update selected items details when selection changes
    useEffect(() => {
        const selectedServiceIds = formData.services || [];
        const selectedGarageIds = formData.garages || [];
        const selectedManufacturerIds = formData.applicableManufacturers || [];
        const selectedFuelTypeIds = formData.applicableFuelTypes || [];

        const selectedServDetails = services.filter(s => selectedServiceIds.includes(s._id));
        const selectedGarDetails = garages.filter(g => selectedGarageIds.includes(g._id));
        const selectedMfgDetails = manufacturers.filter(m => selectedManufacturerIds.includes(m._id));
        const selectedFuelDetails = fuelTypes.filter(f => selectedFuelTypeIds.includes(f._id));

        setSelectedServicesDetails(selectedServDetails);
        setSelectedGaragesDetails(selectedGarDetails);
        setSelectedManufacturersDetails(selectedMfgDetails);
        setSelectedFuelTypesDetails(selectedFuelDetails);
    }, [formData.services, formData.garages, formData.applicableManufacturers, formData.applicableFuelTypes, services, garages, manufacturers, fuelTypes]);

    const handleSave = async () => {
        const success = await handleSubmit();
        if (success) {
            navigate('/service-packages', {
                state: {
                    message: `Service package ${isEditing ? 'updated' : 'created'} successfully!`,
                    severity: 'success'
                }
            });
        }
    };

    const handleCancel = () => {
        navigate('/service-packages');
    };

    // Handle services selection from modal
    const handleServicesSelect = (selectedIds) => {
        handleInputChange('services', selectedIds);
    };

    // Handle garages selection from modal
    const handleGaragesSelect = (selectedIds) => {
        handleInputChange('garages', selectedIds);
    };

    // Handle manufacturer selection from modal
    const handleManufacturerSelect = (selectedIds) => {
        handleInputChange('applicableManufacturers', selectedIds);
    };

    // Handle fuel type selection from modal
    const handleFuelTypeSelect = (selectedIds) => {
        handleInputChange('applicableFuelTypes', selectedIds);
    };

    // Remove selected service
    const handleRemoveService = (serviceId) => {
        const currentIds = formData.services || [];
        const newIds = currentIds.filter(id => id !== serviceId);
        handleInputChange('services', newIds);
    };

    // Remove selected garage
    const handleRemoveGarage = (garageId) => {
        const currentIds = formData.garages || [];
        const newIds = currentIds.filter(id => id !== garageId);
        handleInputChange('garages', newIds);
    };

    if (initialLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primaryDeep"></div>
                <span className="ml-4 text-lg font-medium">Loading service package data...</span>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="p-6">
                <AlertMessage type="error" message={loadError} />
                <Button
                    text="Back to Service Packages"
                    variant="outlined"
                    onClick={handleCancel}
                    fullWidth={false}
                    className="mt-4"
                />
            </div>
        );
    }

    return (
        <div className="p-4 w-full max-w-none">
            <PageHeader
                title={isEditing ? "Edit Service Package" : "Add New Service Package"}
                breadcrumbs={[
                    { label: "Dashboard", path: "/dashboard" },
                    { label: "Service Packages", path: "/service-packages" },
                    { label: isEditing ? "Edit Package" : "Add New Package" }
                ]}
                showBackButton
                onBack={handleCancel}
            />

            {/* Error Alert */}
            {error && <AlertMessage type="error" message={error} />}

            {alert && (
                <AlertMessage
                    type={alert.type}
                    message={alert.message}
                    onDismiss={clearAlert}
                />
            )}

            {/* Main Form Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full">
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
                        {/* Left Column - Basic Information */}
                        <div className="lg:col-span-2 space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">
                                Package Information
                            </h2>

                            <FormField
                                label="Package Name"
                                name="name"
                                value={formData.name || ""}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                onBlur={() => handleFieldBlur("name")}
                                placeholder="Enter package name"
                                error={errors?.name}
                                required
                            />

                            <FormField
                                label="Description"
                                name="description"
                                value={formData.description || ""}
                                onChange={(e) => handleInputChange("description", e.target.value)}
                                placeholder="Enter package description"
                                error={errors?.description}
                                multiline
                                rows={4}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    label="Price"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.price || ""}
                                    onChange={(e) => handleInputChange("price", e.target.value)}
                                    onBlur={() => handleFieldBlur("price")}
                                    placeholder="0.00"
                                    error={errors?.price}
                                    required
                                />

                                <FormField
                                    label="Duration (minutes)"
                                    name="duration"
                                    type="number"
                                    min="0"
                                    value={formData.duration || ""}
                                    onChange={(e) => handleInputChange("duration", e.target.value)}
                                    placeholder="Optional duration"
                                    error={errors?.duration}
                                />
                            </div>

                            {/* Package Image */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Package Image
                                </label>
                                <FileUpload
                                    label="Upload Image"
                                    value={imagePreview}
                                    onChange={handleImageChange}
                                    error={errors?.image}
                                    helperText="Upload an image of the service package (optional)"
                                    accept="image/*"
                                    maxSize={5 * 1024 * 1024} // 5MB
                                />
                            </div>
                        </div>

                        {/* Right Column - Image Upload and Selections */}
                        <div className="lg:col-span-1">
                            <div className="space-y-8">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                                    Package Configuration
                                </h2>
                                {/* Services Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Services <span className="text-red-500">*</span>
                                    </label>
                                    {errors?.services && (
                                        <p className="text-red-500 text-sm mb-2">{errors.services}</p>
                                    )}

                                    {selectedServicesDetails.length > 0 ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center p-3 border border-gray-300 rounded-lg bg-gray-50">
                                                <WrenchScrewdriverIcon className="w-8 h-8 text-gray-400 mr-3" />
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">
                                                        {selectedServicesDetails.length} services selected
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {selectedServicesDetails.slice(0, 2).map(s => s.name).join(', ')}
                                                        {selectedServicesDetails.length > 2 && ` +${selectedServicesDetails.length - 2} more`}
                                                    </p>
                                                </div>
                                                <Button
                                                    text="Change"
                                                    variant="outlined"
                                                    onClick={() => setServicesSelectorOpen(true)}
                                                    fullWidth={false}
                                                />
                                            </div>

                                            {/* Selected Services List */}
                                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-64 overflow-y-auto">
                                                <h4 className="text-sm font-medium text-gray-800 mb-3">
                                                    Selected Services ({selectedServicesDetails.length})
                                                </h4>

                                                <div className="space-y-2">
                                                    {selectedServicesDetails.map((service) => (
                                                        <div
                                                            key={service._id}
                                                            className="flex items-center justify-between bg-white p-3 rounded border border-gray-200"
                                                        >
                                                            <div className="flex items-center space-x-3">
                                                                <WrenchScrewdriverIcon className="w-5 h-5 text-gray-400" />
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-900">{service.name}</p>
                                                                    <p className="text-xs text-green-600">${service.price}</p>
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveService(service._id)}
                                                                className="text-red-500 hover:text-red-600 transition-colors"
                                                            >
                                                                <XMarkIcon className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <Button
                                            text="Select Services"
                                            variant="outlined"
                                            onClick={() => setServicesSelectorOpen(true)}
                                            fullWidth={true}
                                            startIcon={<PlusIcon className="w-5 h-5" />}
                                        />
                                    )}
                                </div>

                                {/* Garages Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Available Garages <span className="text-red-500">*</span>
                                    </label>
                                    {errors?.garages && (
                                        <p className="text-red-500 text-sm mb-2">{errors.garages}</p>
                                    )}

                                    {selectedGaragesDetails.length > 0 ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center p-3 border border-gray-300 rounded-lg bg-gray-50">
                                                <BuildingStorefrontIcon className="w-8 h-8 text-gray-400 mr-3" />
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">
                                                        {selectedGaragesDetails.length} garages selected
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {selectedGaragesDetails.slice(0, 2).map(g => g.name).join(', ')}
                                                        {selectedGaragesDetails.length > 2 && ` +${selectedGaragesDetails.length - 2} more`}
                                                    </p>
                                                </div>
                                                <Button
                                                    text="Change"
                                                    variant="outlined"
                                                    onClick={() => setGaragesSelectorOpen(true)}
                                                    fullWidth={false}
                                                />
                                            </div>

                                            {/* Selected Garages List */}
                                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-64 overflow-y-auto">
                                                <h4 className="text-sm font-medium text-gray-800 mb-3">
                                                    Selected Garages ({selectedGaragesDetails.length})
                                                </h4>

                                                <div className="space-y-2">
                                                    {selectedGaragesDetails.map((garage) => (
                                                        <div
                                                            key={garage._id}
                                                            className="flex items-center justify-between bg-white p-3 rounded border border-gray-200"
                                                        >
                                                            <div className="flex items-center space-x-3">
                                                                <BuildingStorefrontIcon className="w-5 h-5 text-gray-400" />
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-900">{garage.name}</p>
                                                                    <p className="text-xs text-gray-500">{garage.city}, {garage.country}</p>
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveGarage(garage._id)}
                                                                className="text-red-500 hover:text-red-600 transition-colors"
                                                            >
                                                                <XMarkIcon className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <Button
                                            text="Select Garages"
                                            variant="outlined"
                                            onClick={() => setGaragesSelectorOpen(true)}
                                            fullWidth={true}
                                            startIcon={<PlusIcon className="w-5 h-5" />}
                                        />
                                    )}
                                </div>

                                {/* Manufacturers Selection (Optional) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Applicable Manufacturers (Optional)
                                    </label>
                                    <p className="text-xs text-gray-500 mb-3">Leave empty to apply to all manufacturers</p>

                                    {selectedManufacturersDetails.length > 0 ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center p-3 border border-gray-300 rounded-lg bg-gray-50">
                                                <BuildingOffice2Icon className="w-8 h-8 text-gray-400 mr-3" />
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">
                                                        {selectedManufacturersDetails.length} manufacturers selected
                                                    </p>
                                                </div>
                                                <Button
                                                    text="Change"
                                                    variant="outlined"
                                                    onClick={() => setManufacturerSelectorOpen(true)}
                                                    fullWidth={false}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <Button
                                            text="Select Manufacturers"
                                            variant="outlined"
                                            onClick={() => setManufacturerSelectorOpen(true)}
                                            fullWidth={true}
                                            startIcon={<PlusIcon className="w-5 h-5" />}
                                        />
                                    )}
                                </div>

                                {/* Fuel Types Selection (Optional) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Applicable Fuel Types (Optional)
                                    </label>
                                    <p className="text-xs text-gray-500 mb-3">Leave empty to apply to all fuel types</p>

                                    {selectedFuelTypesDetails.length > 0 ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center p-3 border border-gray-300 rounded-lg bg-gray-50">
                                                <FireIcon className="w-8 h-8 text-gray-400 mr-3" />
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">
                                                        {selectedFuelTypesDetails.length} fuel types selected
                                                    </p>
                                                </div>
                                                <Button
                                                    text="Change"
                                                    variant="outlined"
                                                    onClick={() => setFuelTypeSelectorOpen(true)}
                                                    fullWidth={false}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <Button
                                            text="Select Fuel Types"
                                            variant="outlined"
                                            onClick={() => setFuelTypeSelectorOpen(true)}
                                            fullWidth={true}
                                            startIcon={<PlusIcon className="w-5 h-5" />}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="my-8 border-gray-200" />

                    {/* Action Buttons */}
                    <div className="flex gap-3 justify-end">
                        <Button
                            text="Cancel"
                            variant="outlined"
                            onClick={handleCancel}
                            disabled={loading}
                            fullWidth={false}
                        />

                        <Button
                            text={loading ? "Saving..." : (isEditing ? "Update Package" : "Create Package")}
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

            {/* Modal Selectors */}
            <ServicesMultiSelector
                isOpen={servicesSelectorOpen}
                onClose={() => setServicesSelectorOpen(false)}
                onSelect={handleServicesSelect}
                selectedServices={formData.services || []}
                title="Select Services for Package"
            />

            <GaragesMultiSelector
                isOpen={garagesSelectorOpen}
                onClose={() => setGaragesSelectorOpen(false)}
                onSelect={handleGaragesSelect}
                selectedGarages={formData.garages || []}
                title="Select Available Garages"
            />

            <ManufacturerMultiSelector
                isOpen={manufacturerSelectorOpen}
                onClose={() => setManufacturerSelectorOpen(false)}
                onSelect={handleManufacturerSelect}
                selectedManufacturers={formData.applicableManufacturers || []}
                title="Select Applicable Manufacturers"
            />

            <FuelTypeMultiSelector
                isOpen={fuelTypeSelectorOpen}
                onClose={() => setFuelTypeSelectorOpen(false)}
                onSelect={handleFuelTypeSelect}
                selectedFuelTypes={formData.applicableFuelTypes || []}
                title="Select Applicable Fuel Types"
            />
        </div>
    );
};

export default AddEditServicePackagePage;