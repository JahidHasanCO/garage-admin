import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import FormField from "../../components/forms/FormField";
import Button from "../../components/Button";
import AlertMessage from "../../components/AlertMessage";
import ManufacturerMultiSelector from "../../components/selectors/ManufacturerMultiSelector";
import FuelTypeMultiSelector from "../../components/selectors/FuelTypeMultiSelector";
import { useGarageForm } from "../../hooks/useGarageForm";
import { manufacturersService } from "../../api/manufacturersService";
import { fuelTypesService } from "../../api/fuelTypesService";
import { BuildingOffice2Icon, FireIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

const AddEditGaragePage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    const [manufacturers, setManufacturers] = useState([]);
    const [fuelTypes, setFuelTypes] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);

    // Modal states
    const [manufacturerSelectorOpen, setManufacturerSelectorOpen] = useState(false);
    const [fuelTypeSelectorOpen, setFuelTypeSelectorOpen] = useState(false);

    // Selected items details for display
    const [selectedManufacturersDetails, setSelectedManufacturersDetails] = useState([]);
    const [selectedFuelTypesDetails, setSelectedFuelTypesDetails] = useState([]);

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
                setInitialLoading(true);
                // Fetch all manufacturers and fuel types without pagination
                const [manufacturersResponse, fuelTypesResponse] = await Promise.all([
                    manufacturersService.getAllManufacturers(1, 1000), // Get up to 1000 manufacturers
                    fuelTypesService.getAllFuelTypes(1, 1000) // Get up to 1000 fuel types
                ]);
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
        const selectedManufacturerIds = formData.supportedManufacturers || [];
        const selectedFuelTypeIds = formData.supportedFuelTypes || [];

        const selectedMfgDetails = manufacturers.filter(m =>
            selectedManufacturerIds.includes(m._id)
        );
        const selectedFuelDetails = fuelTypes.filter(f =>
            selectedFuelTypeIds.includes(f._id)
        );

        setSelectedManufacturersDetails(selectedMfgDetails);
        setSelectedFuelTypesDetails(selectedFuelDetails);
    }, [formData.supportedManufacturers, formData.supportedFuelTypes, manufacturers, fuelTypes]);

    const handleSave = async () => {
        const success = await handleSubmit();
        if (success) {
            navigate('/garages', {
                state: {
                    message: `Garage ${isEditing ? 'updated' : 'created'} successfully!`,
                    severity: 'success'
                }
            });
        }
    };

    const handleCancel = () => {
        navigate('/garages');
    };

    // Handle manufacturer selection from modal
    const handleManufacturerSelect = (selectedIds) => {
        handleInputChange('supportedManufacturers', selectedIds);
    };

    // Handle fuel type selection from modal
    const handleFuelTypeSelect = (selectedIds) => {
        handleInputChange('supportedFuelTypes', selectedIds);
    };

    // Remove selected manufacturer
    const handleRemoveManufacturer = (manufacturerId) => {
        const currentIds = formData.supportedManufacturers || [];
        const newIds = currentIds.filter(id => id !== manufacturerId);
        handleInputChange('supportedManufacturers', newIds);
    };

    // Remove selected fuel type
    const handleRemoveFuelType = (fuelTypeId) => {
        const currentIds = formData.supportedFuelTypes || [];
        const newIds = currentIds.filter(id => id !== fuelTypeId);
        handleInputChange('supportedFuelTypes', newIds);
    };

    if (initialLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primaryDeep"></div>
                <span className="ml-4 text-lg font-medium">Loading garage data...</span>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="p-6">
                <AlertMessage type="error" message={loadError} />
                <Button
                    text="Back to Garages"
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
                title={isEditing ? "Edit Garage" : "Add New Garage"}
                breadcrumbs={[
                    { label: "Dashboard", path: "/dashboard" },
                    { label: "Garages", path: "/garages" },
                    { label: isEditing ? "Edit Garage" : "Add New Garage" }
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
                                Basic Information
                            </h2>

                            <FormField
                                label="Garage Name"
                                name="name"
                                value={formData.name || ""}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                placeholder="Enter garage name"
                                required
                            />

                            <FormField
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
                                <FormField
                                    label="City"
                                    name="city"
                                    value={formData.city || ""}
                                    onChange={(e) => handleInputChange("city", e.target.value)}
                                    placeholder="Enter city"
                                    required
                                />

                                <FormField
                                    label="Country"
                                    name="country"
                                    value={formData.country || ""}
                                    onChange={(e) => handleInputChange("country", e.target.value)}
                                    placeholder="Enter country"
                                    required
                                />
                            </div>

                            <div>
                                <h3 className="text-md font-medium text-gray-900 mb-4">Geographic Coordinates</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        label="Latitude"
                                        name="geo.lat"
                                        type="number"
                                        step="any"
                                        value={formData.geo?.lat || ""}
                                        onChange={(e) => handleInputChange("geo.lat", parseFloat(e.target.value) || "")}
                                        placeholder="e.g., 23.8103"
                                    />

                                    <FormField
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

                            <div >
                                <h3 className="text-md font-medium text-gray-900 mb-4">Contact Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        label="Phone"
                                        name="contact.phone"
                                        value={formData.contact?.phone || ""}
                                        onChange={(e) => handleInputChange("contact.phone", e.target.value)}
                                        placeholder="Enter phone number"
                                    />

                                    <FormField
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

                        {/* Right Column - Supported Services */}
                        <div className="lg:col-span-1">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">
                                Supported Services
                            </h2>
                            <div className="space-y-8">
                                {/* Manufacturers */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Supported Manufacturers
                                    </label>

                                    {selectedManufacturersDetails.length > 0 ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center p-3 border border-gray-300 rounded-lg bg-gray-50">
                                                <BuildingOffice2Icon className="w-8 h-8 text-gray-400 mr-3" />
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">
                                                        {selectedManufacturersDetails.length} manufacturers selected
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {selectedManufacturersDetails.slice(0, 2).map(m => m.name).join(', ')}
                                                        {selectedManufacturersDetails.length > 2 && ` +${selectedManufacturersDetails.length - 2} more`}
                                                    </p>
                                                </div>
                                                <Button
                                                    text="Change"
                                                    variant="outlined"
                                                    onClick={() => setManufacturerSelectorOpen(true)}
                                                    fullWidth={false}
                                                />
                                            </div>

                                            {/* Selected Manufacturers List */}
                                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-64 overflow-y-auto">
                                                <h4 className="text-sm font-medium text-gray-800 mb-3">
                                                    Selected Manufacturers ({selectedManufacturersDetails.length})
                                                </h4>

                                                <div className="space-y-2">
                                                    {selectedManufacturersDetails.map((manufacturer) => (
                                                        <div
                                                            key={manufacturer._id}
                                                            className="flex items-center justify-between bg-white p-3 rounded border border-gray-200"
                                                        >
                                                            <div className="flex items-center space-x-3">
                                                                <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                                                                    {manufacturer.logo ? (
                                                                        <img
                                                                            src={manufacturer.logo}
                                                                            alt={manufacturer.name}
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <BuildingOffice2Icon className="w-5 h-5 text-gray-400" />
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-900">{manufacturer.name}</p>
                                                                    <p className="text-xs text-gray-500">{manufacturer.country}</p>
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveManufacturer(manufacturer._id)}
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
                                            text="Select Manufacturers"
                                            variant="outlined"
                                            onClick={() => setManufacturerSelectorOpen(true)}
                                            fullWidth={true}
                                            startIcon={<PlusIcon className="w-5 h-5" />}
                                        />
                                    )}
                                </div>

                                {/* Fuel Types */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Supported Fuel Types
                                    </label>

                                    {selectedFuelTypesDetails.length > 0 ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center p-3 border border-gray-300 rounded-lg bg-gray-50">
                                                <FireIcon className="w-8 h-8 text-gray-400 mr-3" />
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">
                                                        {selectedFuelTypesDetails.length} fuel types selected
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {selectedFuelTypesDetails.slice(0, 2).map(f => f.title).join(', ')}
                                                        {selectedFuelTypesDetails.length > 2 && ` +${selectedFuelTypesDetails.length - 2} more`}
                                                    </p>
                                                </div>
                                                <Button
                                                    text="Change"
                                                    variant="outlined"
                                                    onClick={() => setFuelTypeSelectorOpen(true)}
                                                    fullWidth={false}
                                                />
                                            </div>

                                            {/* Selected Fuel Types List */}
                                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-64 overflow-y-auto">
                                                <h4 className="text-sm font-medium text-gray-800 mb-3">
                                                    Selected Fuel Types ({selectedFuelTypesDetails.length})
                                                </h4>

                                                <div className="space-y-2">
                                                    {selectedFuelTypesDetails.map((fuelType) => (
                                                        <div
                                                            key={fuelType._id}
                                                            className="flex items-center justify-between bg-white p-3 rounded border border-gray-200"
                                                        >
                                                            <div className="flex items-center space-x-3">
                                                                <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                                                                    {fuelType.image ? (
                                                                        <img
                                                                            src={fuelType.image}
                                                                            alt={fuelType.title}
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <FireIcon className="w-5 h-5 text-gray-400" />
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-900">{fuelType.title}</p>
                                                                    <p className="text-xs text-gray-500">{fuelType.value}</p>
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveFuelType(fuelType._id)}
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
                            text={loading ? "Saving..." : (isEditing ? "Update Garage" : "Create Garage")}
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
            <ManufacturerMultiSelector
                isOpen={manufacturerSelectorOpen}
                onClose={() => setManufacturerSelectorOpen(false)}
                onSelect={handleManufacturerSelect}
                selectedManufacturers={formData.supportedManufacturers || []}
                title="Select Supported Manufacturers"
            />

            <FuelTypeMultiSelector
                isOpen={fuelTypeSelectorOpen}
                onClose={() => setFuelTypeSelectorOpen(false)}
                onSelect={handleFuelTypeSelect}
                selectedFuelTypes={formData.supportedFuelTypes || []}
                title="Select Supported Fuel Types"
            />
        </div>
    );
};

export default AddEditGaragePage;