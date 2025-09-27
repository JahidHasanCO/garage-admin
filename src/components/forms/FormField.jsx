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
    w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primaryDeep focus:border-primaryDeep
    ${error ? 'border-error text-red-900' : 'border-gray-border text-text-title'}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
    transition-colors duration-200
    ${!fullWidth ? 'w-auto' : ''}
  `.trim();

  return (
    <div className={`mb-4 ${!fullWidth ? 'inline-block' : 'w-full'}`} style={sx}>
      <label className="block text-sm font-medium text-text-title mb-2">
        {label} {required && <span className="text-error">*</span>}
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
        <p className={`mt-1 text-sm ${error ? 'text-error' : 'text-text-gray'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default FormField;