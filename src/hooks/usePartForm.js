import { useState, useEffect } from "react";
import { validatePartForm } from "../utils/validation";
import { partsService, preparePartFormData } from "../api/partsService";

export const usePartForm = (initialData = null, partId = null) => {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    price: "",
    image: null,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Initialize form with data (for edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        sku: initialData.sku || "",
        description: initialData.description || "",
        price: initialData.price?.toString() || "",
        image: initialData.image || null,
      });
      
      if (initialData.image) {
        setImagePreview(initialData.image);
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
    const validation = validatePartForm(formData);
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
      const formDataToSubmit = preparePartFormData(formData, imageFile);
      
      let result;
      if (partId) {
        // Update existing part
        result = await partsService.updatePart(partId, formDataToSubmit);
      } else {
        // Create new part
        result = await partsService.createPart(formDataToSubmit);
      }
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return true;
    } catch (error) {
      const errorMessage = error.message || "An error occurred while saving the part";
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
      sku: "",
      description: "",
      price: "",
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
    isEditMode: !!partId,
  };
};