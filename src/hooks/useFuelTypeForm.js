import { useState, useEffect } from "react";
import { fuelTypesService, prepareFuelTypeFormData } from "../api/fuelTypesService";

// Simple validation function for fuel type form
const validateFuelTypeForm = (formData) => {
  const errors = {};
  
  if (!formData.title?.trim()) {
    errors.title = "Title is required";
  }
  
  if (!formData.value?.trim()) {
    errors.value = "Value is required";
  } else if (!/^[a-z_-]+$/.test(formData.value)) {
    errors.value = "Value must contain only lowercase letters, hyphens, and underscores";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const useFuelTypeForm = (fuelTypeId = null, initialData = null) => {
  const [formData, setFormData] = useState({
    title: "",
    value: "",
    image: null,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Initialize form with data (for edit mode)
  useEffect(() => {
    const initializeForm = async () => {
      if (initialData) {
        // Use provided initial data
        setFormData({
          title: initialData.title || "",
          value: initialData.value || "",
          image: initialData.image || null,
        });
        
        if (initialData.image) {
          setImagePreview(initialData.image);
        }
      } else if (fuelTypeId) {
        // Fetch fuel type data for editing
        try {
          setLoading(true);
          setSubmitError(null);
          console.log('Fetching fuel type data for ID:', fuelTypeId);
          const response = await fuelTypesService.getFuelTypeById(fuelTypeId);
          console.log('Fuel type data response:', response);
          const fuelType = response.fuelType || response.data || response;
          
          if (!fuelType) {
            throw new Error('Fuel type not found');
          }
          
          setFormData({
            title: fuelType.title || "",
            value: fuelType.value || "",
            image: fuelType.image || null,
          });
          
          if (fuelType.image) {
            setImagePreview(fuelType.image);
          }
          
          console.log('Fuel type form data initialized:', {
            title: fuelType.title,
            value: fuelType.value
          });
        } catch (err) {
          console.error('Error fetching fuel type:', err);
          setSubmitError(`Failed to load fuel type data: ${err.message}`);
        } finally {
          setLoading(false);
        }
      }
    };

    initializeForm();
  }, [fuelTypeId, initialData]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Auto-generate value from title if value field is being filled and it's empty
    if (name === 'title' && !formData.value) {
      const autoValue = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: value,
        value: autoValue
      }));
    } else {
      // For value field, ensure lowercase and proper format
      if (name === 'value') {
        processedValue = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '');
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: processedValue
      }));
    }

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
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
    const validation = validateFuelTypeForm(formData);
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
      const formDataToSubmit = prepareFuelTypeFormData(formData, imageFile);
      
      let result;
      if (fuelTypeId) {
        // Update existing fuel type
        result = await fuelTypesService.updateFuelType(fuelTypeId, formDataToSubmit);
      } else {
        // Create new fuel type
        result = await fuelTypesService.createFuelType(formDataToSubmit);
      }
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return true;
    } catch (error) {
      const errorMessage = error.message || "An error occurred while saving the fuel type";
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
      title: "",
      value: "",
      image: null,
    });
    setImageFile(null);
    setImagePreview(null);
    setErrors({});
    setSubmitError(null);
  };

  return {
    formData,
    imageFile,
    imagePreview,
    errors,
    loading,
    submitError,
    handleChange,
    handleImageChange,
    handleSubmit,
    validateForm,
    resetForm,
    isEditMode: !!fuelTypeId,
  };
};