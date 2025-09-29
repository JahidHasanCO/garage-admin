import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

/**
 * Reusable Loading Skeleton Components
 */
export const LoadingSkeleton = ({ className = "", lines = 1, height = "h-4" }) => (
  <div className={`animate-pulse ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <div key={index} className={`bg-gray-300 rounded ${height} ${index > 0 ? 'mt-2' : ''}`}></div>
    ))}
  </div>
);

/**
 * Card Loading Skeleton
 */
export const CardSkeleton = ({ className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
    <div className="animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="rounded-full bg-gray-300 h-10 w-10"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        <div className="h-3 bg-gray-300 rounded"></div>
        <div className="h-3 bg-gray-300 rounded w-5/6"></div>
      </div>
    </div>
  </div>
);

/**
 * Table Loading Skeleton
 */
export const TableSkeleton = ({ rows = 5, columns = 4, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
    <div className="animate-pulse">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, index) => (
            <div key={index} className="h-4 bg-gray-300 rounded"></div>
          ))}
        </div>
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="px-6 py-4 border-b border-gray-200 last:border-b-0">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className="h-4 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/**
 * Reusable Empty State Component
 */
export const EmptyState = ({ 
  icon = ExclamationTriangleIcon,
  title = "No data found",
  description = "There are no items to display at the moment.",
  action = null,
  className = ""
}) => {
  const IconComponent = icon;
  
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
        <IconComponent className="h-full w-full" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
      {action && <div className="flex justify-center">{action}</div>}
    </div>
  );
};

/**
 * Reusable Error State Component
 */
export const ErrorState = ({ 
  title = "Something went wrong",
  description = "An error occurred while loading the data.",
  onRetry = null,
  className = ""
}) => (
  <div className={`text-center py-12 ${className}`}>
    <div className="mx-auto h-16 w-16 text-red-400 mb-4">
      <ExclamationTriangleIcon className="h-full w-full" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    )}
  </div>
);

export default {
  LoadingSkeleton,
  CardSkeleton,
  TableSkeleton,
  EmptyState,
  ErrorState
};