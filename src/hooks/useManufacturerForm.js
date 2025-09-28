import { useState, useEffect } from "react";
import { manufacturersService, prepareManufacturerFormData } from "../api/manufacturersService";

// Simple validation function for manufacturer form
const validateManufacturerForm = (formData) => {
  const errors = {};
  
  if (!formData.name?.trim()) {
    errors.name = "Name is required";
  }
  
  if (!formData.country?.trim()) {
    errors.country = "Country is required";
  }
  
  if (formData.founded && (isNaN(formData.founded) || formData.founded < 1800 || formData.founded > new Date().getFullYear())) {
    errors.founded = "Founded year must be a valid year between 1800 and current year";
  }
  
  if (formData.website && formData.website.trim()) {
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(formData.website)) {
      errors.website = "Website must be a valid URL starting with http:// or https://";
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const useManufacturerForm = (initialData = null, manufacturerId = null) => {
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    founded: "",
    website: "",
    logo: null,
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Initialize form with data (for edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        country: initialData.country || "",
        founded: initialData.founded?.toString() || "",
        website: initialData.website || "",
        logo: initialData.logo || null,
      });
      
      if (initialData.logo) {
        setLogoPreview(initialData.logo);
      }
    }
  }, [initialData]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Handle logo file changes
  const handleLogoChange = (file, error, preview) => {
    if (error) {
      setErrors(prev => ({
        ...prev,
        logo: error
      }));
      setLogoFile(null);
      setLogoPreview(null);
    } else {
      setLogoFile(file);
      setLogoPreview(preview);
      setErrors(prev => ({
        ...prev,
        logo: null
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const validation = validateManufacturerForm(formData);
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
      const formDataToSubmit = prepareManufacturerFormData(formData, logoFile);
      
      let result;
      if (manufacturerId) {
        // Update existing manufacturer
        result = await manufacturersService.updateManufacturer(manufacturerId, formDataToSubmit);
      } else {
        // Create new manufacturer
        result = await manufacturersService.createManufacturer(formDataToSubmit);
      }
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return true;
    } catch (error) {
      const errorMessage = error.message || "An error occurred while saving the manufacturer";
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
      name: "",
      country: "",
      founded: "",
      website: "",
      logo: null,
    });
    setLogoFile(null);
    setLogoPreview(null);
    setErrors({});
    setSubmitError(null);
  };

  return {
    formData,
    logoFile,
    logoPreview,
    errors,
    loading,
    submitError,
    handleChange,
    handleLogoChange,
    handleSubmit,
    validateForm,
    resetForm,
    isEditMode: !!manufacturerId,
  };
};