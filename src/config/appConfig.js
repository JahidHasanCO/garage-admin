/**
 * Application-wide constants and configuration
 * 
 * This file contains all hardcoded values, validation rules,
 * and UI configurations used throughout the application.
 */

// ==================== PAGINATION CONSTANTS ====================
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  SELECTOR_LIMIT: 12,
  MAX_LIMIT: 100,
  SEARCH_DEBOUNCE_MS: 300
};

// ==================== VALIDATION RULES ====================
export const VALIDATION_RULES = {
  // Common field lengths
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100
  },
  
  DESCRIPTION: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 500
  },
  
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  
  PRICE: {
    MIN: 0,
    MAX: 999999.99,
    DECIMAL_PLACES: 2
  },
  
  PERCENTAGE: {
    MIN: 0,
    MAX: 100
  },
  
  TIME: {
    MIN: 0,
    MAX: 99999 // in minutes
  },
  
  // File upload
  IMAGE: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.gif']
  }
};

// ==================== ERROR MESSAGES ====================
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  MIN_LENGTH: (field, min) => `${field} must be at least ${min} characters`,
  MAX_LENGTH: (field, max) => `${field} cannot exceed ${max} characters`,
  MIN_VALUE: (field, min) => `${field} must be at least ${min}`,
  MAX_VALUE: (field, max) => `${field} cannot exceed ${max}`,
  INVALID_NUMBER: 'Please enter a valid number',
  INVALID_IMAGE: 'Please select a valid image file',
  IMAGE_TOO_LARGE: 'Image size cannot exceed 5MB',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'The requested resource was not found',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  
  // Form-specific messages
  FORM: {
    SAVE_SUCCESS: 'Successfully saved!',
    SAVE_ERROR: 'Failed to save. Please try again.',
    DELETE_SUCCESS: 'Successfully deleted!',
    DELETE_ERROR: 'Failed to delete. Please try again.',
    DELETE_CONFIRM: 'Are you sure you want to delete this item?',
    UNSAVED_CHANGES: 'You have unsaved changes. Are you sure you want to leave?'
  }
};

// ==================== UI CONSTANTS ====================
export const UI_CONFIG = {
  // Colors for statistics cards and status indicators
  COLORS: {
    PRIMARY: 'blue',
    SUCCESS: 'green',
    WARNING: 'orange',
    DANGER: 'red',
    INFO: 'indigo',
    SECONDARY: 'gray'
  },
  
  // Animation durations
  ANIMATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500
  },
  
  // Breakpoints
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536
  },
  
  // Z-index layers
  Z_INDEX: {
    DROPDOWN: 10,
    MODAL: 50,
    TOAST: 100
  }
};

// ==================== FORM FIELD CONFIGURATIONS ====================
export const FORM_FIELDS = {
  PART: {
    name: {
      label: 'Part Name',
      type: 'text',
      required: true,
      validation: {
        minLength: VALIDATION_RULES.NAME.MIN_LENGTH,
        maxLength: VALIDATION_RULES.NAME.MAX_LENGTH
      }
    },
    description: {
      label: 'Description',
      type: 'textarea',
      required: true,
      validation: {
        minLength: VALIDATION_RULES.DESCRIPTION.MIN_LENGTH,
        maxLength: VALIDATION_RULES.DESCRIPTION.MAX_LENGTH
      }
    },
    price: {
      label: 'Price ($)',
      type: 'number',
      required: true,
      validation: {
        min: VALIDATION_RULES.PRICE.MIN,
        max: VALIDATION_RULES.PRICE.MAX
      }
    },
    category: {
      label: 'Category',
      type: 'text',
      required: true,
      validation: {
        minLength: VALIDATION_RULES.NAME.MIN_LENGTH,
        maxLength: VALIDATION_RULES.NAME.MAX_LENGTH
      }
    }
  },
  
  SERVICE: {
    name: {
      label: 'Service Name',
      type: 'text',
      required: true,
      validation: {
        minLength: VALIDATION_RULES.NAME.MIN_LENGTH,
        maxLength: VALIDATION_RULES.NAME.MAX_LENGTH
      }
    },
    description: {
      label: 'Description',
      type: 'textarea',
      required: true,
      validation: {
        minLength: VALIDATION_RULES.DESCRIPTION.MIN_LENGTH,
        maxLength: VALIDATION_RULES.DESCRIPTION.MAX_LENGTH
      }
    },
    price: {
      label: 'Price ($)',
      type: 'number',
      required: true,
      validation: {
        min: VALIDATION_RULES.PRICE.MIN,
        max: VALIDATION_RULES.PRICE.MAX
      }
    },
    estimated_time: {
      label: 'Estimated Time (minutes)',
      type: 'number',
      required: true,
      validation: {
        min: VALIDATION_RULES.TIME.MIN,
        max: VALIDATION_RULES.TIME.MAX
      }
    },
    discount: {
      label: 'Discount (%)',
      type: 'number',
      required: false,
      validation: {
        min: VALIDATION_RULES.PERCENTAGE.MIN,
        max: VALIDATION_RULES.PERCENTAGE.MAX
      }
    }
  },
  
  SERVICE_PACKAGE: {
    name: {
      label: 'Package Name',
      type: 'text',
      required: true,
      validation: {
        minLength: VALIDATION_RULES.NAME.MIN_LENGTH,
        maxLength: VALIDATION_RULES.NAME.MAX_LENGTH
      }
    },
    description: {
      label: 'Description',
      type: 'textarea',
      required: true,
      validation: {
        minLength: VALIDATION_RULES.DESCRIPTION.MIN_LENGTH,
        maxLength: VALIDATION_RULES.DESCRIPTION.MAX_LENGTH
      }
    },
    price: {
      label: 'Package Price ($)',
      type: 'number',
      required: true,
      validation: {
        min: VALIDATION_RULES.PRICE.MIN,
        max: VALIDATION_RULES.PRICE.MAX
      }
    },
    duration: {
      label: 'Duration (days)',
      type: 'number',
      required: true,
      validation: {
        min: 1,
        max: 365
      }
    }
  }
};

// ==================== TABLE CONFIGURATIONS ====================
export const TABLE_CONFIG = {
  PARTS: {
    columns: [
      { key: 'name', label: 'Name', sortable: true },
      { key: 'category', label: 'Category', sortable: true },
      { key: 'price', label: 'Price', sortable: true, format: 'currency' },
      { key: 'actions', label: 'Actions', sortable: false }
    ]
  },
  
  SERVICES: {
    columns: [
      { key: 'name', label: 'Service Name', sortable: true },
      { key: 'price', label: 'Price', sortable: true, format: 'currency' },
      { key: 'estimated_time', label: 'Duration', sortable: true, format: 'time' },
      { key: 'discount', label: 'Discount', sortable: true, format: 'percentage' },
      { key: 'actions', label: 'Actions', sortable: false }
    ]
  },
  
  SERVICE_PACKAGES: {
    columns: [
      { key: 'name', label: 'Package Name', sortable: true },
      { key: 'price', label: 'Price', sortable: true, format: 'currency' },
      { key: 'duration', label: 'Duration', sortable: true, format: 'days' },
      { key: 'services', label: 'Services', sortable: false, format: 'count' },
      { key: 'actions', label: 'Actions', sortable: false }
    ]
  }
};

// ==================== MODAL CONFIGURATIONS ====================
export const MODAL_CONFIG = {
  SIZES: {
    SMALL: 'max-w-md',
    MEDIUM: 'max-w-lg', 
    LARGE: 'max-w-2xl',
    EXTRA_LARGE: 'max-w-4xl',
    FULL: 'max-w-full'
  },
  
  SELECTOR: {
    size: 'EXTRA_LARGE',
    title: {
      SERVICES: 'Select Services',
      PARTS: 'Select Parts',
      GARAGES: 'Select Garages',
      MANUFACTURERS: 'Select Manufacturers',
      FUEL_TYPES: 'Select Fuel Types'
    }
  }
};

// ==================== NOTIFICATION CONFIGURATIONS ====================
export const NOTIFICATION_CONFIG = {
  DURATION: {
    SHORT: 3000,
    MEDIUM: 5000,
    LONG: 7000
  },
  
  TYPES: {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
  },
  
  POSITIONS: {
    TOP_RIGHT: 'top-right',
    TOP_LEFT: 'top-left',
    BOTTOM_RIGHT: 'bottom-right',
    BOTTOM_LEFT: 'bottom-left'
  }
};

export default {
  PAGINATION_CONFIG,
  VALIDATION_RULES,
  ERROR_MESSAGES,
  UI_CONFIG,
  FORM_FIELDS,
  TABLE_CONFIG,
  MODAL_CONFIG,
  NOTIFICATION_CONFIG
};