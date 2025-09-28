import { useState, useEffect } from 'react';
import { createGarage, updateGarage, getGarageById } from '../api/garagesService';
import { validateGarageForm } from '../utils/validation';

export const useGarageForm = (garageId = null) => {
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
  const [error, setError] = useState(null); // Add general error state
  const [alert, setAlert] = useState(null); // Add alert state
  const [isEditing] = useState(!!garageId);

  // Initialize form data
  useEffect(() => {
    const initializeForm = async () => {
      if (garageId) {
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
          setError('Failed to load garage data');
        } finally {
          setLoading(false);
        }
      }
    };

    initializeForm();
  }, [garageId]);

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
      return false;
    }

    try {
      setLoading(true);
      setError(null);

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

      if (isEditing) {
        await updateGarage(garageId, submitData);
      } else {
        await createGarage(submitData);
      }

      setAlert({
        type: 'success',
        message: isEditing ? 'Garage updated successfully' : 'Garage created successfully'
      });

      return true;
    } catch (err) {
      console.error('Error submitting garage form:', err);
      const errorMessage = err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} garage`;
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
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
    setError(null);
    setAlert(null);
  };

  return {
    formData,
    errors,
    loading,
    error,
    alert,
    isEditing,
    handleInputChange,
    handleManufacturersChange,
    handleFuelTypesChange,
    handleSubmit,
    resetForm,
    clearAlert
  };
};