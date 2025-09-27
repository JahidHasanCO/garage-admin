export default function InputField({ label, type = "text", value, onChange, placeholder, required = false, error, disabled = false }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-text-title mb-2">
        {label} {required && <span className="text-error">*</span>}
      </label>
      <input
        type={type}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`
          w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
          ${error ? 'border-error text-error' : 'border-gray-300 text-gray-900'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          transition-colors duration-200
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
}
