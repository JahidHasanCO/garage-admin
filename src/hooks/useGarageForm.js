import { useState, useEffect } from 'react';
import { createGarage, updateGarage, getGarageById } from '../api/garagesService';
import { validateGarageForm } from '../utils/validation';

export const useGarageForm = (initialData = null, garageId = null) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    country: 'Bangladesh',
    geo: {
      lat: '',
      lng: ''
    },
    contact: {
      phone: '',
      email: ''
    },
    supportedManufacturers: [],
    supportedFuelTypes: []
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isEditing] = useState(!!garageId);

  // Initialize form data
  useEffect(() => {
    const initializeForm = async () => {
      if (initialData) {
        // Use provided initial data
        setFormData({
          name: initialData.name || '',
          address: initialData.address || '',
          city: initialData.city || '',
          country: initialData.country || 'Bangladesh',
          geo: {
            lat: initialData.geo?.lat?.toString() || '',
            lng: initialData.geo?.lng?.toString() || ''
          },
          contact: {
            phone: initialData.contact?.phone || '',
            email: initialData.contact?.email || ''
          },
          supportedManufacturers: initialData.supportedManufacturers?.map(manufacturer => 
            typeof manufacturer === 'object' ? manufacturer._id : manufacturer
          ) || [],
          supportedFuelTypes: initialData.supportedFuelTypes?.map(fuelType => 
            typeof fuelType === 'object' ? fuelType._id : fuelType
          ) || []
        });
      } else if (garageId) {
        // Fetch garage data for editing
        try {
          setLoading(true);
          const response = await getGarageById(garageId);
          const garage = response.garage || response;
          
          setFormData({
            name: garage.name || '',
            address: garage.address || '',
            city: garage.city || '',
            country: garage.country || 'Bangladesh',
            geo: {
              lat: garage.geo?.lat?.toString() || '',
              lng: garage.geo?.lng?.toString() || ''
            },
            contact: {
              phone: garage.contact?.phone || '',
              email: garage.contact?.email || ''
            },
            supportedManufacturers: garage.supportedManufacturers?.map(manufacturer => 
              typeof manufacturer === 'object' ? manufacturer._id : manufacturer
            ) || [],
            supportedFuelTypes: garage.supportedFuelTypes?.map(fuelType => 
              typeof fuelType === 'object' ? fuelType._id : fuelType
            ) || []
          });
        } catch (err) {
          console.error('Error fetching garage:', err);
          setSubmitError('Failed to load garage data');
        } finally {
          setLoading(false);
        }
      }
    };

    initializeForm();
  }, [garageId, initialData]);

  // Handle input changes
  const handleInputChange = (name, value) => {
    if (name.includes('.')) {
      // Handle nested fields like geo.lat, contact.phone
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
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

  // Handle manufacturers selection
  const handleManufacturersChange = (selectedManufacturers) => {
    setFormData(prev => ({
      ...prev,
      supportedManufacturers: selectedManufacturers
    }));

    // Clear manufacturers error
    if (errors.supportedManufacturers) {
      setErrors(prev => ({
        ...prev,
        supportedManufacturers: null
      }));
    }
  };

  // Handle fuel types selection
  const handleFuelTypesChange = (selectedFuelTypes) => {
    setFormData(prev => ({
      ...prev,
      supportedFuelTypes: selectedFuelTypes
    }));

    // Clear fuel types error
    if (errors.supportedFuelTypes) {
      setErrors(prev => ({
        ...prev,
        supportedFuelTypes: null
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const validationErrors = validateGarageForm(formData);
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
        address: formData.address.trim(),
        city: formData.city.trim(),
        country: formData.country.trim(),
        geo: {
          lat: formData.geo.lat ? parseFloat(formData.geo.lat) : null,
          lng: formData.geo.lng ? parseFloat(formData.geo.lng) : null
        },
        contact: {
          phone: formData.contact.phone.trim(),
          email: formData.contact.email.trim()
        },
        supportedManufacturers: formData.supportedManufacturers,
        supportedFuelTypes: formData.supportedFuelTypes
      };

      let response;
      if (isEditing) {
        response = await updateGarage(garageId, submitData);
      } else {
        response = await createGarage(submitData);
      }

      return { 
        success: true, 
        data: response.garage || response,
        message: isEditing ? 'Garage updated successfully' : 'Garage created successfully'
      };
    } catch (err) {
      console.error('Error submitting garage form:', err);
      const errorMessage = err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} garage`;
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
      address: '',
      city: '',
      country: 'Bangladesh',
      geo: {
        lat: '',
        lng: ''
      },
      contact: {
        phone: '',
        email: ''
      },
      supportedManufacturers: [],
      supportedFuelTypes: []
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
    handleManufacturersChange,
    handleFuelTypesChange,
    handleSubmit,
    resetForm,
    setSubmitError
  };
};