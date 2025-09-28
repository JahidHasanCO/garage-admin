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

// Service-specific validation schema
export const validateServiceForm = (formData) => {
  const errors = {};
  
  // Validate name
  const nameError = validateRequired(formData.name, "Service name");
  if (nameError) errors.name = nameError;
  else if (formData.name.length > 100) {
    errors.name = "Service name cannot exceed 100 characters";
  }
  
  // Validate price
  const priceError = validateNumber(formData.price, "Price", 0);
  if (priceError) errors.price = priceError;
  
  // Validate estimated_time
  const timeError = validateNumber(formData.estimated_time, "Estimated time", 0);
  if (timeError) errors.estimated_time = timeError;
  
  // Validate discount (optional)
  if (formData.discount && formData.discount !== '') {
    const discountError = validateNumber(formData.discount, "Discount", 0, 100);
    if (discountError) errors.discount = discountError;
  }
  
  // Validate description
  if (formData.description && formData.description.length > 1000) {
    errors.description = "Description cannot exceed 1000 characters";
  }
  
  return errors;
};

// Email validation helper
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return null; // Email is optional
  }
  
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.trim())) {
    return 'Please enter a valid email address';
  }
  
  return null;
};

// Phone validation helper
export const validatePhone = (phone) => {
  if (!phone || phone.trim() === '') {
    return null; // Phone is optional
  }
  
  const phonePattern = /^[+]?[\d\s-()]+$/;
  if (!phonePattern.test(phone.trim())) {
    return 'Please enter a valid phone number';
  }
  
  if (phone.trim().length < 10) {
    return 'Phone number must be at least 10 characters long';
  }
  
  return null;
};

// Garage-specific validation schema
export const validateGarageForm = (formData) => {
  const errors = {};
  
  // Validate name
  const nameError = validateRequired(formData.name, "Garage name");
  if (nameError) errors.name = nameError;
  else if (formData.name.length > 100) {
    errors.name = "Garage name cannot exceed 100 characters";
  }
  
  // Validate address
  const addressError = validateRequired(formData.address, "Address");
  if (addressError) errors.address = addressError;
  else if (formData.address.length > 200) {
    errors.address = "Address cannot exceed 200 characters";
  }
  
  // Validate city
  const cityError = validateRequired(formData.city, "City");
  if (cityError) errors.city = cityError;
  else if (formData.city.length > 50) {
    errors.city = "City cannot exceed 50 characters";
  }
  
  // Validate country
  if (formData.country && formData.country.length > 50) {
    errors.country = "Country cannot exceed 50 characters";
  }
  
  // Validate geo coordinates (optional)
  if (formData.geo?.lat && formData.geo.lat !== '') {
    const latError = validateNumber(formData.geo.lat, "Latitude", -90, 90);
    if (latError) errors['geo.lat'] = latError;
  }
  
  if (formData.geo?.lng && formData.geo.lng !== '') {
    const lngError = validateNumber(formData.geo.lng, "Longitude", -180, 180);
    if (lngError) errors['geo.lng'] = lngError;
  }
  
  // Validate contact information (optional)
  if (formData.contact?.email) {
    const emailError = validateEmail(formData.contact.email);
    if (emailError) errors['contact.email'] = emailError;
  }
  
  if (formData.contact?.phone) {
    const phoneError = validatePhone(formData.contact.phone);
    if (phoneError) errors['contact.phone'] = phoneError;
  }
  
  return errors;
};

// Service Package-specific validation schema
export const validateServicePackageForm = (formData) => {
  const errors = {};
  
  // Validate name
  const nameError = validateRequired(formData.name, "Package name");
  if (nameError) errors.name = nameError;
  else if (formData.name.length > 100) {
    errors.name = "Package name cannot exceed 100 characters";
  }
  
  // Validate price
  const priceError = validateNumber(formData.price, "Price", 0);
  if (priceError) errors.price = priceError;
  
  // Validate duration (optional)
  if (formData.duration && formData.duration !== '') {
    const durationError = validateNumber(formData.duration, "Duration", 0);
    if (durationError) errors.duration = durationError;
  }
  
  // Validate services (at least one service required)
  if (!formData.services || formData.services.length === 0) {
    errors.services = "At least one service must be selected";
  }
  
  // Validate garages (at least one garage required)
  if (!formData.garages || formData.garages.length === 0) {
    errors.garages = "At least one garage must be selected";
  }
  
  // Validate description
  if (formData.description && formData.description.length > 1000) {
    errors.description = "Description cannot exceed 1000 characters";
  }
  
  return errors;
};