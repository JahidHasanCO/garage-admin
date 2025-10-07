import { useState, useEffect } from 'react';
import { createStaff, updateStaff, getStaffById } from '../api/staffService';

// Minimal validation helper for staff form — mirrors patterns used elsewhere
const validateStaffForm = (data) => {
  const errors = {};
  if (!data.name || !data.name.trim()) errors.name = 'Name is required';
  if (!data.email || !data.email.trim()) errors.email = 'Email is required';
  // Password required only when creating a new linked user (no user_id) or when no user exists
  if (!data.user_id && !data.password) errors.password = 'Password is required';
  return errors;
};

export const useStaffForm = (staffId = null) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    user_id: null,
    garage: null,
    role: 'mechanic',
    status: 'available',
    isActive: true,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  const [isEditing] = useState(!!staffId);

  useEffect(() => {
    const initialize = async () => {
      if (staffId) {
        try {
          setLoading(true);
          const response = await getStaffById(staffId);
          const staff = response.staff || response;

          setFormData({
            name: staff.user_id?.name || '',
            email: staff.user_id?.email || '',
            password: '',
            user_id: staff.user_id?._id || staff.user_id || null,
            garage: staff.garage?._id || staff.garage || null,
            role: staff.role || 'mechanic',
            // skills removed
            status: staff.status || 'available',
            isActive: staff.isActive !== undefined ? staff.isActive : true,
          });
        } catch (err) {
          console.error('Error fetching staff:', err);
          setError('Failed to load staff data');
        } finally {
          setLoading(false);
        }
      }
    };

    initialize();
  }, [staffId]);

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

    if (error && error.includes('validation')) {
      setError(null);
    }
  };

  const handleFieldBlur = (name) => {
    const validationErrors = validateStaffForm(formData);
    if (validationErrors[name]) {
      setErrors(prev => ({ ...prev, [name]: validationErrors[name] }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const validationErrors = validateStaffForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) setError('Please fix the validation errors below');
    else setError(null);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return false;

    try {
      setLoading(true);
      setError(null);

      const submitData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password || undefined,
        user_id: formData.user_id,
        garage: formData.garage,
        role: formData.role,
  // skills removed
        status: formData.status,
        isActive: !!formData.isActive,
      };

      if (isEditing) {
        await updateStaff(staffId, submitData);
      } else {
        await createStaff(submitData);
      }

      setAlert({ type: 'success', message: isEditing ? 'Staff updated successfully' : 'Staff created successfully' });
      return true;
    } catch (err) {
      console.error('Error submitting staff form:', err);
      setError(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} staff`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearAlert = () => setAlert(null);
  const resetForm = () => {
    setFormData({ name: '', email: '', password: '', user_id: null, garage: null, role: 'mechanic', status: 'available', isActive: true });
    setErrors({});
    setError(null);
    setAlert(null);
  };

  return { formData, errors, loading, error, alert, isEditing, handleInputChange, handleFieldBlur, handleSubmit, resetForm, clearAlert };
};
