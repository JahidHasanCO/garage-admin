import { useState, useEffect } from 'react';
import { createBooking, updateBooking, getBookingById } from '../api/bookingsService';

const validateBookingForm = (data) => {
  const errors = {};
  if (!data.user) errors.user = 'Customer is required';
  if (!data.garage) errors.garage = 'Garage is required';
  if (!data.payment || !data.payment.amount) errors.payment = { amount: 'Amount is required' };
  return errors;
};

export const useBookingForm = (bookingId = null) => {
  const [formData, setFormData] = useState({
    user: null,
    servicePackage: null,
    singleService: null,
    garage: null,
    vehicle: null,
    assignedStaff: null,
    status: 'requested',
    payment: { status: 'pending', amount: 0 },
    requestedAt: null,
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  const [isEditing] = useState(!!bookingId);

  useEffect(() => {
    const initialize = async () => {
      if (bookingId) {
        try {
          setLoading(true);
          const response = await getBookingById(bookingId);
          const booking = response.booking || response;
          setFormData({
            user: booking.user || null,
            servicePackage: booking.servicePackage || null,
            singleService: booking.singleService || null,
            garage: booking.garage?._id || booking.garage || null,
            vehicle: booking.vehicle?._id || booking.vehicle || null,
            assignedStaff: booking.assignedStaff?._id || booking.assignedStaff || null,
            status: booking.status || 'requested',
            payment: booking.payment || { status: 'pending', amount: 0 },
            requestedAt: booking.requestedAt || null,
            notes: booking.notes || '',
          });
        } catch (err) {
          console.error('Error fetching booking:', err);
          setError('Failed to load booking data');
        } finally {
          setLoading(false);
        }
      }
    };

    initialize();
  }, [bookingId]);

  const handleInputChange = (name, value) => {
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({ ...prev, [parent]: { ...(prev[parent] || {}), [child]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFieldBlur = (name) => {
    const validationErrors = validateBookingForm(formData);
    if (validationErrors[name]) setErrors(prev => ({ ...prev, [name]: validationErrors[name] }));
    else setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  const validateForm = () => {
    const validationErrors = validateBookingForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) setError('Please fix validation errors');
    else setError(null);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return false;

    try {
      setLoading(true);
      setError(null);

      if (isEditing) await updateBooking(bookingId, formData);
      else await createBooking(formData);

      setAlert({ type: 'success', message: isEditing ? 'Booking updated successfully' : 'Booking created successfully' });
      return true;
    } catch (err) {
      console.error('Error submitting booking form:', err);
      setError(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} booking`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearAlert = () => setAlert(null);
  const resetForm = () => {
    setFormData({ user: null, servicePackage: null, singleService: null, garage: null, vehicle: null, assignedStaff: null, status: 'requested', payment: { status: 'pending', amount: 0 }, requestedAt: null, notes: '' });
    setErrors({});
    setError(null);
    setAlert(null);
  };

  return { formData, errors, loading, error, alert, isEditing, handleInputChange, handleFieldBlur, handleSubmit, resetForm, clearAlert };
};
