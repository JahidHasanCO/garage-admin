import { useState, useEffect } from "react";
import { vehiclesService, prepareVehicleFormData } from "../api/vehiclesService";

// Simple validation function for vehicle form
const validateVehicleForm = (formData) => {
  const errors = {};
  
  if (!formData.manufacturer) {
    errors.manufacturer = "Manufacturer is required";
  }
  
  if (!formData.model?.trim()) {
    errors.model = "Model is required";
  }
  
  if (!formData.year || isNaN(formData.year) || formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
    errors.year = "Year must be a valid year between 1900 and next year";
  }
  
  if (formData.license_plate?.trim()) {
    if (!/^[A-Z0-9-]{3,10}$/.test(formData.license_plate.toUpperCase())) {
      errors.license_plate = "License plate must be 3-10 characters (letters, numbers, and hyphens only)";
    }
  }
  
  if (formData.vin && formData.vin.trim()) {
    if (!/^[A-HJ-NPR-Z0-9]{11,17}$/.test(formData.vin.toUpperCase())) {
      errors.vin = "VIN must be 11-17 characters (no I, O, or Q)";
    }
  }
  
  if (!formData.color?.trim()) {
    errors.color = "Color is required";
  }
  
  if (formData.mileage === '' || isNaN(formData.mileage) || formData.mileage < 0) {
    errors.mileage = "Mileage must be a valid number (0 or greater)";
  }
  
  if (!formData.fuel_type) {
    errors.fuel_type = "Fuel type is required";
  }
  
  if (!formData.transmission) {
    errors.transmission = "Transmission is required";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const useVehicleForm = (initialData = null, vehicleId = null) => {
  const [formData, setFormData] = useState({
    manufacturer: "",
    model: "",
    year: "",
    vin: "",
    license_plate: "",
    color: "",
    mileage: "0",
    fuel_type: "",
    transmission: "manual",
    description: "",
    image: null,
  });

  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [selectedFuelType, setSelectedFuelType] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Initialize form with data (for edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        manufacturer: initialData.manufacturer?._id || "",
        model: initialData.model || "",
        year: initialData.year?.toString() || "",
        vin: initialData.vin || "",
        license_plate: initialData.license_plate || "",
        color: initialData.color || "",
        mileage: initialData.mileage?.toString() || "0",
        fuel_type: initialData.fuel_type?._id || "",
        transmission: initialData.transmission || "manual",
        description: initialData.description || "",
        image: initialData.image || null,
      });
      
      // Set selected objects for display
      if (initialData.manufacturer) {
        setSelectedManufacturer(initialData.manufacturer);
      }
      
      if (initialData.fuel_type) {
        setSelectedFuelType(initialData.fuel_type);
      }
      
      if (initialData.image) {
        setImagePreview(initialData.image);
      }
    }
  }, [initialData]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Auto-uppercase for license plate and VIN
    if (name === 'license_plate' || name === 'vin') {
      processedValue = value.toUpperCase();
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Handle manufacturer selection
  const handleManufacturerSelect = (manufacturer) => {
    setSelectedManufacturer(manufacturer);
    setFormData(prev => ({
      ...prev,
      manufacturer: manufacturer._id
    }));
    
    // Clear manufacturer error
    if (errors.manufacturer) {
      setErrors(prev => ({
        ...prev,
        manufacturer: null
      }));
    }
  };

  // Handle fuel type selection
  const handleFuelTypeSelect = (fuelType) => {
    setSelectedFuelType(fuelType);
    setFormData(prev => ({
      ...prev,
      fuel_type: fuelType._id
    }));
    
    // Clear fuel type error
    if (errors.fuel_type) {
      setErrors(prev => ({
        ...prev,
        fuel_type: null
      }));
    }
  };

  // Handle image file changes
  const handleImageChange = (file, error, preview) => {
    if (error) {
      setErrors(prev => ({
        ...prev,
        image: error
      }));
      setImageFile(null);
      setImagePreview(null);
    } else {
      setImageFile(file);
      setImagePreview(preview);
      setErrors(prev => ({
        ...prev,
        image: null
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const validation = validateVehicleForm(formData);
    setErrors(validation.errors);
    return validation.isValid;
  };

  // Handle form submission
  const handleSubmit = async (onSuccess, onError) => {
    setSubmitError(null);
    
    if (!validateForm()) {
      return false;
    }

    setLoading(true);
    
    try {
      const formDataToSubmit = prepareVehicleFormData(formData, imageFile);
      
      let result;
      if (vehicleId) {
        // Update existing vehicle
        result = await vehiclesService.updateVehicle(vehicleId, formDataToSubmit);
      } else {
        // Create new vehicle
        result = await vehiclesService.createVehicle(formDataToSubmit);
      }
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return true;
    } catch (error) {
      const errorMessage = error.message || "An error occurred while saving the vehicle";
      setSubmitError(errorMessage);
      
      if (onError) {
        onError(error);
      }
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      manufacturer: "",
      model: "",
      year: "",
      vin: "",
      license_plate: "",
      color: "",
      mileage: "0",
      fuel_type: "",
      transmission: "manual",
      description: "",
      image: null,
    });
    setSelectedManufacturer(null);
    setSelectedFuelType(null);
    setImageFile(null);
    setImagePreview(null);
    setErrors({});
    setSubmitError(null);
  };

  return {
    formData,
    selectedManufacturer,
    selectedFuelType,
    imageFile,
    imagePreview,
    errors,
    loading,
    submitError,
    handleChange,
    handleManufacturerSelect,
    handleFuelTypeSelect,
    handleImageChange,
    handleSubmit,
    validateForm,
    resetForm,
    isEditMode: !!vehicleId,
  };
};