import React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";

const PaginationControls = ({
  page,
  pages,
  total,
  limit,
  onPageChange,
  onLimitChange,
  disabled = false,
}) => {
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mt-4 px-4 py-2">
      {/* Results info */}
      <p className="text-sm text-gray-600 px-2">
        Showing {startItem} to {endItem} of {total} results
      </p>

      <div className="flex items-center gap-4 px-2">
        {/* Items per page */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Per page</label>

          <div className="relative">
            <select
              value={limit}
              onChange={(e) => onLimitChange?.(Number(e.target.value))}
              disabled={disabled}
              className="appearance-none text-xs px-2 py-1 pr-8
                         bg-gray-100 rounded focus:outline-none
                          hover:bg-gray-200
                         disabled:opacity-50"
            >
              {[5, 10, 25, 50].map((size) => (
                <option key={size} value={size} className="px-3 py-1 text-sm font-medium">
                  {size}
                </option>
              ))}
            </select>

            {/* Custom arrow with Heroicons */}
            <ChevronDownIcon
              className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 
                         text-gray-500 pointer-events-none"
            />
          </div>
        </div>

        {/* Pagination buttons */}
        {pages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange?.(1)}
              disabled={page === 1 || disabled}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronDoubleLeftIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange?.(page - 1)}
              disabled={page === 1 || disabled}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded">
              {page} / {pages}
            </span>
            <button
              onClick={() => onPageChange?.(page + 1)}
              disabled={page === pages || disabled}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange?.(pages)}
              disabled={page === pages || disabled}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronDoubleRightIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaginationControls;
