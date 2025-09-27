export default function Button({
  text,
  onClick,
  loading = false,
  variant = "contained", // contained, outlined, text
  fullWidth = true,
  size = "medium", // small, medium, large
  disabled = false,
  startIcon,
  endIcon,
  color = "primary", // primary, secondary, error, success
  className = "",
  ...props
}) {
  const baseClasses = "font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed";
  
  const sizeClasses = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg"
  };

  const getVariantClasses = () => {
    const colorMap = {
      primary: {
        contained: "bg-primaryDeep text-white hover:bg-primaryDeep-light focus:ring-primaryDeep disabled:bg-gray-300 disabled:text-gray-500",
        outlined: "border-2 border-primaryDeep text-primaryDeep bg-transparent hover:bg-primaryDeep hover:text-white focus:ring-primaryDeep disabled:border-gray-300 disabled:text-gray-300",
        text: "text-primaryDeep bg-transparent hover:bg-blue-50 focus:ring-primaryDeep disabled:text-gray-300"
      },
      secondary: {
        contained: "bg-primary text-white hover:bg-primary-light focus:ring-primary disabled:bg-gray-300 disabled:text-gray-500",
        outlined: "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white focus:ring-primary disabled:border-gray-300 disabled:text-gray-300",
        text: "text-primary bg-transparent hover:bg-green-50 focus:ring-primary disabled:text-gray-300"
      },
      error: {
        contained: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-gray-300 disabled:text-gray-500",
        outlined: "border-2 border-red-600 text-red-600 bg-transparent hover:bg-red-600 hover:text-white focus:ring-red-500 disabled:border-gray-300 disabled:text-gray-300",
        text: "text-red-600 bg-transparent hover:bg-red-50 focus:ring-red-500 disabled:text-gray-300"
      },
      success: {
        contained: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 disabled:bg-gray-300 disabled:text-gray-500",
        outlined: "border-2 border-green-600 text-green-600 bg-transparent hover:bg-green-600 hover:text-white focus:ring-green-500 disabled:border-gray-300 disabled:text-gray-300",
        text: "text-green-600 bg-transparent hover:bg-green-50 focus:ring-green-500 disabled:text-gray-300"
      }
    };
    return colorMap[color][variant];
  };

  const widthClass = fullWidth ? "w-full" : "";
  
  const finalClasses = `${baseClasses} ${sizeClasses[size]} ${getVariantClasses()} ${widthClass} ${className}`.trim();

  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={finalClasses}
      {...props}
    >
      <div className="flex items-center justify-center gap-2">
        {startIcon && <span className="shrink-0">{startIcon}</span>}
        <span>{loading ? "Loading..." : text}</span>
        {endIcon && <span className="shrink-0">{endIcon}</span>}
      </div>
    </button>
  );
}
