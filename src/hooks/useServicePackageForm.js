import { useState, useEffect } from 'react';
import { createServicePackage, updateServicePackage, getServicePackageById, prepareServicePackageFormData } from '../api/servicePackagesService';
import { validateServicePackageForm } from '../utils/validation';

export const useServicePackageForm = (servicePackageId = null) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    services: [],
    applicableFuelTypes: [],
    applicableManufacturers: [],
    garages: [],
    image: ''
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  const [isEditing] = useState(!!servicePackageId);

  // Initialize form data
  useEffect(() => {
    const initializeForm = async () => {
      if (servicePackageId) {
        // Fetch service package data for editing
        try {
          setLoading(true);
          const response = await getServicePackageById(servicePackageId);
          const servicePackage = response.servicePackage || response;
          
          setFormData({
            name: servicePackage.name || '',
            description: servicePackage.description || '',
            price: servicePackage.price?.toString() || '',
            duration: servicePackage.duration?.toString() || '',
            services: servicePackage.services?.map(service => 
              typeof service === 'object' ? service._id : service
            ) || [],
            applicableFuelTypes: servicePackage.applicableFuelTypes?.map(fuelType => 
              typeof fuelType === 'object' ? fuelType._id : fuelType
            ) || [],
            applicableManufacturers: servicePackage.applicableManufacturers?.map(manufacturer => 
              typeof manufacturer === 'object' ? manufacturer._id : manufacturer
            ) || [],
            garages: servicePackage.garages?.map(garage => 
              typeof garage === 'object' ? garage._id : garage
            ) || [],
            image: servicePackage.image || ''
          });
          
          if (servicePackage.image) {
            setImagePreview(servicePackage.image);
          }
        } catch (err) {
          console.error('Error fetching service package:', err);
          setError('Failed to load service package data');
        } finally {
          setLoading(false);
        }
      }
    };

    initializeForm();
  }, [servicePackageId]);

  // Handle input changes
  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Also clear general error when user starts fixing issues
    if (error && error.includes('validation errors')) {
      setError(null);
    }
  };

  // Handle field blur validation
  const handleFieldBlur = (name) => {
    const fieldErrors = validateServicePackageForm(formData);
    if (fieldErrors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: fieldErrors[name]
      }));
    } else {
      // Clear the error if field is now valid
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const validationErrors = validateServicePackageForm(formData);
    setErrors(validationErrors);
    
    // Set a general error if there are validation errors
    if (Object.keys(validationErrors).length > 0) {
      setError('Please fix the validation errors below');
    } else {
      setError(null);
    }
    
    return Object.keys(validationErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      // Prepare form data for submission
      let submitData;
      if (imageFile) {
        // Use FormData if there's an image file
        submitData = prepareServicePackageFormData(formData, imageFile);
      } else {
        // Use JSON if no image file
        submitData = {
          name: formData.name.trim(),
          description: formData.description.trim(),
          price: parseFloat(formData.price),
          duration: formData.duration ? parseInt(formData.duration) : 0,
          services: formData.services,
          applicableFuelTypes: formData.applicableFuelTypes,
          applicableManufacturers: formData.applicableManufacturers,
          garages: formData.garages,
          image: formData.image.trim()
        };
      }

      if (isEditing) {
        await updateServicePackage(servicePackageId, submitData);
      } else {
        await createServicePackage(submitData);
      }

      setAlert({
        type: 'success',
        message: isEditing ? 'Service package updated successfully' : 'Service package created successfully'
      });

      return true;
    } catch (err) {
      console.error('Error submitting service package form:', err);
      const errorMessage = err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} service package`;
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
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

  // Clear alert
  const clearAlert = () => {
    setAlert(null);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      services: [],
      applicableFuelTypes: [],
      applicableManufacturers: [],
      garages: [],
      image: ''
    });
    setImageFile(null);
    setImagePreview(null);
    setErrors({});
    setError(null);
    setAlert(null);
  };

  return {
    formData,
    imageFile,
    imagePreview,
    errors,
    loading,
    error,
    alert,
    isEditing,
    handleInputChange,
    handleImageChange,
    handleFieldBlur,
    handleSubmit,
    resetForm,
    clearAlert
  };
};