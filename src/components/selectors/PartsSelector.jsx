import React, { useState, useEffect } from 'react';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Button from '../Button';
import PaginationControls from '../PaginationControls';
import { partsService } from '../../api/partsService';

const PartsSelector = ({ 
  isOpen, 
  onClose, 
  onSelect, 
  selectedParts = [],
  title = "Select Parts Needed" 
}) => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 12
  });
  const [tempSelectedParts, setTempSelectedParts] = useState([]);

  // Initialize temp selection when modal opens
  useEffect(() => {
    if (isOpen) {
      setTempSelectedParts([...selectedParts]);
    }
  }, [isOpen, selectedParts]);

  // Fetch parts
  const fetchParts = async (page = 1, search = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await partsService.getAllParts(page, pagination.limit, search);
      
      setParts(response.parts || []);
      setPagination({
        page: response.page || 1,
        pages: response.pages || 1,
        total: response.total || 0,
        limit: pagination.limit
      });
    } catch (err) {
      console.error('Error fetching parts:', err);
      setError('Failed to load parts');
    } finally {
      setLoading(false);
    }
  };

  // Fetch parts when modal opens or search changes
  useEffect(() => {
    if (isOpen) {
      const timeoutId = setTimeout(() => {
        fetchParts(1, searchQuery);
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen, searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle page change
  const handlePageChange = (newPage) => {
    fetchParts(newPage, searchQuery);
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle part selection toggle
  const handlePartToggle = (partId) => {
    setTempSelectedParts(prev => {
      const isSelected = prev.includes(partId);
      if (isSelected) {
        return prev.filter(id => id !== partId);
      } else {
        return [...prev, partId];
      }
    });
  };

  // Handle confirm selection
  const handleConfirm = () => {
    onSelect(tempSelectedParts);
    onClose();
  };

  // Handle cancel
  const handleCancel = () => {
    setTempSelectedParts([...selectedParts]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search parts..."
            value={searchQuery}
            onChange={handleSearch}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Selected parts count */}
        <div className="mb-4 text-sm text-gray-600">
          Selected: {tempSelectedParts.length} part{tempSelectedParts.length !== 1 ? 's' : ''}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto min-h-0" style={{ maxHeight: 'calc(90vh - 240px)' }}>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <Button
                onClick={() => fetchParts(pagination.page, searchQuery)}
                variant="outline"
                size="sm"
              >
                Retry
              </Button>
            </div>
          ) : parts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? 'No parts found matching your search.' : 'No parts available.'}
            </div>
          ) : (
            <>
              {/* Parts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                {parts.map((part) => {
                  const isSelected = tempSelectedParts.includes(part._id);
                  
                  return (
                    <div
                      key={part._id}
                      onClick={() => handlePartToggle(part._id)}
                      className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {/* Selection indicator */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                          ✓
                        </div>
                      )}
                      
                      {/* Part image */}
                      <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {part.image ? (
                          <img
                            src={part.image}
                            alt={part.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Image</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Part info */}
                      <div className="text-center">
                        <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                          {part.name}
                        </h3>
                        <p className="text-xs text-gray-500 mb-1">
                          SKU: {part.sku || 'N/A'}
                        </p>
                        <p className="text-sm font-semibold text-blue-600">
                          ${part.price?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <PaginationControls
                  currentPage={pagination.page}
                  totalPages={pagination.pages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            onClick={handleCancel}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
          >
            Confirm Selection ({tempSelectedParts.length})
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PartsSelector;