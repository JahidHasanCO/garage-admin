import { useState, useEffect } from 'react';
import { createService, updateService, getServiceById } from '../api/servicesService';
import { validateServiceForm } from '../utils/validation';

export const useServiceForm = (serviceId = null, initialData = null) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    estimated_time: '',
    discount: '',
    parts_needed: [],
    image: null,
    imagePreview: null
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isEditing] = useState(!!serviceId);

  // Initialize form data
  useEffect(() => {
    const initializeForm = async () => {
      if (initialData) {
        // Use provided initial data
        setFormData({
          name: initialData.name || '',
          description: initialData.description || '',
          price: initialData.price?.toString() || '',
          estimated_time: initialData.estimated_time?.toString() || '',
          discount: initialData.discount?.toString() || '',
          parts_needed: initialData.parts_needed?.map(part => 
            typeof part === 'object' ? part._id : part
          ) || [],
          image: null,
          imagePreview: initialData.image || null
        });
      } else if (serviceId) {
        // Fetch service data for editing
        try {
          setLoading(true);
          const response = await getServiceById(serviceId);
          const service = response.service || response;
          
          setFormData({
            name: service.name || '',
            description: service.description || '',
            price: service.price?.toString() || '',
            estimated_time: service.estimated_time?.toString() || '',
            discount: service.discount?.toString() || '',
            parts_needed: service.parts_needed?.map(part => 
              typeof part === 'object' ? part._id : part
            ) || [],
            image: null,
            imagePreview: service.image || null
          });
        } catch (err) {
          console.error('Error fetching service:', err);
          setSubmitError('Failed to load service data');
        } finally {
          setLoading(false);
        }
      }
    };

    initializeForm();
  }, [serviceId, initialData]);

  // Handle input changes
  const handleInputChange = (name, value) => {
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

  // Handle image change
  const handleImageChange = (file) => {
    setFormData(prev => ({
      ...prev,
      image: file,
      imagePreview: file ? URL.createObjectURL(file) : prev.imagePreview
    }));

    // Clear image error
    if (errors.image) {
      setErrors(prev => ({
        ...prev,
        image: null
      }));
    }
  };

  // Handle parts selection
  const handlePartsChange = (selectedParts) => {
    setFormData(prev => ({
      ...prev,
      parts_needed: selectedParts
    }));

    // Clear parts error
    if (errors.parts_needed) {
      setErrors(prev => ({
        ...prev,
        parts_needed: null
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const validationErrors = validateServiceForm(formData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return { success: false, errors };
    }

    try {
      setLoading(true);
      setSubmitError(null);

      // Prepare form data for submission
      const submitData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price) || 0,
        estimated_time: parseInt(formData.estimated_time) || 0,
        discount: parseFloat(formData.discount) || 0,
        parts_needed: formData.parts_needed,
        image: formData.image
      };

      let response;
      if (isEditing) {
        response = await updateService(serviceId, submitData);
      } else {
        response = await createService(submitData);
      }

      return { 
        success: true, 
        data: response.service || response,
        message: isEditing ? 'Service updated successfully' : 'Service created successfully'
      };
    } catch (err) {
      console.error('Error submitting service form:', err);
      const errorMessage = err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} service`;
      setSubmitError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      estimated_time: '',
      discount: '',
      parts_needed: [],
      image: null,
      imagePreview: null
    });
    setErrors({});
    setSubmitError(null);
  };

  return {
    formData,
    errors,
    loading,
    submitError,
    isEditing,
    handleInputChange,
    handleImageChange,
    handlePartsChange,
    handleSubmit,
    resetForm,
    setSubmitError
  };
};