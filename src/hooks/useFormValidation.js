import { useState, useCallback, useEffect } from 'react';
import { VALIDATION_RULES, ERROR_MESSAGES } from '../config/appConfig';

/**
 * Universal form validation hook
 * 
 * This hook provides comprehensive form validation, state management,
 * and error handling for any form in the application.
 * 
 * @param {Object} initialValues - Initial form values
 * @param {Object} validationSchema - Validation rules for each field
 * @param {Function} onSubmit - Submit handler function
 * @returns {Object} Form state and handlers
 */
export const useFormValidation = (initialValues = {}, validationSchema = {}, onSubmit) => {
  // Form state
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);

  /**
   * Validate a single field
   */
  const validateField = useCallback((name, value, schema = {}) => {
    const rules = schema || validationSchema[name] || {};
    let error = null;

    // Required validation
    if (rules.required && (!value || value.toString().trim() === '')) {
      return ERROR_MESSAGES.REQUIRED_FIELD;
    }

    // Skip other validations if field is empty and not required
    if (!value && !rules.required) {
      return null;
    }

    const stringValue = value.toString();

    // Email validation
    if (rules.type === 'email' && !VALIDATION_RULES.EMAIL.PATTERN.test(stringValue)) {
      return ERROR_MESSAGES.INVALID_EMAIL;
    }

    // Length validations
    if (rules.minLength && stringValue.length < rules.minLength) {
      return ERROR_MESSAGES.MIN_LENGTH(rules.label || name, rules.minLength);
    }

    if (rules.maxLength && stringValue.length > rules.maxLength) {
      return ERROR_MESSAGES.MAX_LENGTH(rules.label || name, rules.maxLength);
    }

    // Number validations
    if (rules.type === 'number') {
      const numValue = parseFloat(value);
      
      if (isNaN(numValue)) {
        return ERROR_MESSAGES.INVALID_NUMBER;
      }

      if (rules.min !== undefined && numValue < rules.min) {
        return ERROR_MESSAGES.MIN_VALUE(rules.label || name, rules.min);
      }

      if (rules.max !== undefined && numValue > rules.max) {
        return ERROR_MESSAGES.MAX_VALUE(rules.label || name, rules.max);
      }
    }

    // File validations
    if (rules.type === 'file' && value instanceof File) {
      // File size validation
      if (rules.maxSize && value.size > rules.maxSize) {
        return ERROR_MESSAGES.IMAGE_TOO_LARGE;
      }

      // File type validation
      if (rules.allowedTypes && !rules.allowedTypes.includes(value.type)) {
        return ERROR_MESSAGES.INVALID_IMAGE;
      }
    }

    // Custom validation function
    if (rules.validate && typeof rules.validate === 'function') {
      const customError = rules.validate(value, values);
      if (customError) {
        return customError;
      }
    }

    return error;
  }, [validationSchema, values]);

  /**
   * Validate all fields
   */
  const validateForm = useCallback(() => {
    const newErrors = {};
    let formIsValid = true;

    Object.keys(validationSchema).forEach(fieldName => {
      const fieldValue = values[fieldName];
      const fieldError = validateField(fieldName, fieldValue);
      
      if (fieldError) {
        newErrors[fieldName] = fieldError;
        formIsValid = false;
      }
    });

    setErrors(newErrors);
    setIsValid(formIsValid);
    return formIsValid;
  }, [values, validateField, validationSchema]);

  /**
   * Handle field value change
   */
  const handleChange = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate field on change if it has been touched
    if (touched[name]) {
      const fieldError = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: fieldError
      }));
    }
  }, [touched, validateField]);

  /**
   * Handle field blur (mark as touched and validate)
   */
  const handleBlur = useCallback((name) => {
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate field on blur
    const fieldValue = values[name];
    const fieldError = validateField(name, fieldValue);
    setErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));
  }, [values, validateField]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async (event) => {
    if (event) {
      event.preventDefault();
    }

    // Mark all fields as touched
    const allTouched = {};
    Object.keys(validationSchema).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // Validate form
    const formIsValid = validateForm();

    if (!formIsValid || !onSubmit) {
      return false;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(values);
      return true;
    } catch (error) {
      console.error('Form submission error:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm, onSubmit, validationSchema]);

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setIsValid(false);
  }, [initialValues]);

  /**
   * Set form values programmatically
   */
  const setFormValues = useCallback((newValues) => {
    setValues(prev => ({
      ...prev,
      ...newValues
    }));
  }, []);

  /**
   * Set specific field error
   */
  const setFieldError = useCallback((fieldName, error) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  }, []);

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * Get field props for easy integration with form components
   */
  const getFieldProps = useCallback((name) => ({
    name,
    value: values[name] || '',
    error: touched[name] ? errors[name] : undefined,
    onChange: (value) => handleChange(name, value),
    onBlur: () => handleBlur(name)
  }), [values, errors, touched, handleChange, handleBlur]);

  // Effect to validate form when values change
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      validateForm();
    }
  }, [values, touched, validateForm]);

  return {
    // State
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    
    // Handlers
    handleChange,
    handleBlur,
    handleSubmit,
    
    // Utilities
    resetForm,
    setFormValues,
    setFieldError,
    clearErrors,
    validateForm,
    getFieldProps
  };
};

export default useFormValidation;