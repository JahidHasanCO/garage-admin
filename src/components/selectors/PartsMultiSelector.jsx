import React, { useState, useEffect } from 'react';
import { XMarkIcon, MagnifyingGlassIcon, CheckIcon } from '@heroicons/react/24/solid';
import { CubeIcon } from '@heroicons/react/24/outline';
import Button from '../Button';
import { partsService } from '../../api/partsService';

const PartsMultiSelector = ({ 
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
      fetchParts(1, '');
      setSearchQuery('');
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle search with debounce
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchParts(1, value);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    fetchParts(newPage, searchQuery);
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
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600 mt-1">
              Selected: {tempSelectedParts.length} part{tempSelectedParts.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search parts..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading parts...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <Button
                text="Retry"
                variant="outlined"
                onClick={() => fetchParts(pagination.page, searchQuery)}
                fullWidth={false}
              />
            </div>
          ) : parts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? 'No parts found matching your search' : 'No parts available'}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {parts.map((part) => {
                const isSelected = tempSelectedParts.includes(part._id);
                
                return (
                  <div
                    key={part._id}
                    onClick={() => handlePartToggle(part._id)}
                    className={`relative flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                      isSelected
                        ? 'border-primary-600 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-primary-600 rounded-full p-1">
                        <CheckIcon className="w-4 h-4 text-white" />
                      </div>
                    )}
                    
                    {/* Part image */}
                    <div className="w-16 h-16 mb-3 flex items-center justify-center">
                      {part.image ? (
                        <img
                          src={part.image}
                          alt={part.name}
                          className="w-full h-full object-contain rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                          <CubeIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    {/* Part info */}
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
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
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">
                Showing {parts.length} of {pagination.total} parts
              </span>
              <div className="flex gap-2">
                <Button
                  text="Previous"
                  variant="outlined"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1 || loading}
                  fullWidth={false}
                />
                <span className="px-3 py-2 text-sm text-gray-600">
                  {pagination.page} of {pagination.pages}
                </span>
                <Button
                  text="Next"
                  variant="outlined"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages || loading}
                  fullWidth={false}
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <Button
            text="Cancel"
            variant="outlined"
            onClick={handleCancel}
            fullWidth={false}
          />
          <Button
            text={`Confirm Selection (${tempSelectedParts.length})`}
            onClick={handleConfirm}
            disabled={loading}
            fullWidth={false}
          />
        </div>
      </div>
    </div>
  );
};

export default PartsMultiSelector;