import React from "react";
import { useNavigate } from "react-router-dom";

const PageHeader = ({ 
  title, 
  subtitle, 
  breadcrumbs = [], 
  showBackButton = false, 
  onBack 
}) => {
  const navigate = useNavigate();

  const handleBreadcrumbClick = (path) => {
    if (path) {
      navigate(path);
    }
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1); // default back action
    }
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <button
              onClick={handleBackClick}
              className="inline-flex items-center pr-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Back
            </button>
          )}

          <div>
            <h5 className="text-xl font-bold text-black">{title}</h5>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
        </div>

        {breadcrumbs.length > 0 && (
          <nav className="flex space-x-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="flex items-center">
                <button
                  onClick={() => {
                    if (index !== breadcrumbs.length - 1) {
                      handleBreadcrumbClick(crumb.path);
                    }
                  }}
                  className={`${
                    index === breadcrumbs.length - 1
                      ? "text-gray-800 cursor-default font-medium"
                      : "text-primary-600 hover:underline cursor-pointer"
                  }`}
                  disabled={index === breadcrumbs.length - 1}
                >
                  {crumb.label}
                </button>
                {index < breadcrumbs.length - 1 && (
                  <span className="mx-2 text-gray-400">/</span>
                )}
              </span>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
