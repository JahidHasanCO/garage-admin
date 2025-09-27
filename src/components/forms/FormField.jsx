import React from "react";

const FormField = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  type = "text",
  multiline = false,
  rows = 4,
  placeholder,
  required = false,
  disabled = false,
  fullWidth = true,
  sx = {},
  InputProps,
  ...props
}) => {
  const inputClasses = `
    w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600
    ${error ? 'border-red-500 text-red-900' : 'border-gray-300 text-gray-900'}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
    transition-colors duration-200
    ${!fullWidth ? 'w-auto' : ''}
  `.trim();

  return (
    <div className={`mb-4 ${!fullWidth ? 'inline-block' : 'w-full'}`} style={sx}>
      <label className="block text-sm font-medium text-gray-900 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        {InputProps?.startAdornment && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {InputProps.startAdornment}
          </div>
        )}
        
        {multiline ? (
          <textarea
            name={name}
            value={value || ""}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            rows={rows}
            className={`${inputClasses} resize-vertical ${InputProps?.startAdornment ? 'pl-10' : ''}`}
            {...props}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value || ""}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={`${inputClasses} ${InputProps?.startAdornment ? 'pl-10' : ''}`}
            {...props}
          />
        )}
        
        {InputProps?.endAdornment && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {InputProps.endAdornment}
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-500' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default FormField;
