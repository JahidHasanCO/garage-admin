import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

/**
 * Reusable Pagination Component
 * 
 * A standardized pagination component with consistent styling and behavior
 */
export const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  showPageNumbers = true,
  maxPageNumbers = 5,
  className = ""
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const getVisiblePageNumbers = () => {
    if (totalPages <= maxPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxPageNumbers / 2);
    let start = Math.max(currentPage - half, 1);
    let end = Math.min(start + maxPageNumbers - 1, totalPages);

    if (end - start + 1 < maxPageNumbers) {
      start = Math.max(end - maxPageNumbers + 1, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePageNumbers();

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex-1 flex justify-between sm:hidden">
        {/* Mobile pagination */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`
            relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md
            ${currentPage <= 1
              ? 'border-gray-300 text-gray-500 cursor-not-allowed bg-gray-50'
              : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
            }
          `}
        >
          Previous
        </button>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`
            relative ml-3 inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md
            ${currentPage >= totalPages
              ? 'border-gray-300 text-gray-500 cursor-not-allowed bg-gray-50'
              : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
            }
          `}
        >
          Next
        </button>
      </div>

      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Page <span className="font-medium">{currentPage}</span> of{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            {/* Previous button */}
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className={`
                relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium
                ${currentPage <= 1
                  ? 'border-gray-300 text-gray-500 cursor-not-allowed bg-gray-50'
                  : 'border-gray-300 text-gray-500 bg-white hover:bg-gray-50'
                }
              `}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" />
            </button>

            {showPageNumbers && (
              <>
                {/* Show first page if not in visible range */}
                {visiblePages[0] > 1 && (
                  <>
                    <button
                      onClick={() => onPageChange(1)}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      1
                    </button>
                    {visiblePages[0] > 2 && (
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        ...
                      </span>
                    )}
                  </>
                )}

                {/* Page numbers */}
                {visiblePages.map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`
                      relative inline-flex items-center px-4 py-2 border text-sm font-medium
                      ${pageNum === currentPage
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    {pageNum}
                  </button>
                ))}

                {/* Show last page if not in visible range */}
                {visiblePages[visiblePages.length - 1] < totalPages && (
                  <>
                    {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        ...
                      </span>
                    )}
                    <button
                      onClick={() => onPageChange(totalPages)}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </>
            )}

            {/* Next button */}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className={`
                relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium
                ${currentPage >= totalPages
                  ? 'border-gray-300 text-gray-500 cursor-not-allowed bg-gray-50'
                  : 'border-gray-300 text-gray-500 bg-white hover:bg-gray-50'
                }
              `}
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;