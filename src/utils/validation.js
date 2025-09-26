// Form validation utilities
export const validateRequired = (value, fieldName = "Field") => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateNumber = (value, fieldName = "Field", min = null, max = null) => {
  const num = parseFloat(value);
  
  if (isNaN(num)) {
    return `${fieldName} must be a valid number`;
  }
  
  if (min !== null && num < min) {
    return `${fieldName} must be at least ${min}`;
  }
  
  if (max !== null && num > max) {
    return `${fieldName} must not exceed ${max}`;
  }
  
  return null;
};

export const validateSKU = (sku) => {
  if (!sku || sku.trim() === '') {
    return null; // SKU is optional
  }
  
  // SKU should be alphanumeric with optional dashes and underscores
  const skuPattern = /^[a-zA-Z0-9_-]+$/;
  if (!skuPattern.test(sku.trim())) {
    return 'SKU can only contain letters, numbers, dashes, and underscores';
  }
  
  if (sku.trim().length < 2) {
    return 'SKU must be at least 2 characters long';
  }
  
  if (sku.trim().length > 50) {
    return 'SKU cannot exceed 50 characters';
  }
  
  return null;
};

// Part-specific validation schema
export const validatePartForm = (formData) => {
  const errors = {};
  
  // Validate name
  const nameError = validateRequired(formData.name, "Part name");
  if (nameError) errors.name = nameError;
  else if (formData.name.length > 100) {
    errors.name = "Part name cannot exceed 100 characters";
  }
  
  // Validate SKU
  const skuError = validateSKU(formData.sku);
  if (skuError) errors.sku = skuError;
  
  // Validate price
  const priceError = validateNumber(formData.price, "Price", 0);
  if (priceError) errors.price = priceError;
  
  // Validate description
  if (formData.description && formData.description.length > 500) {
    errors.description = "Description cannot exceed 500 characters";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};