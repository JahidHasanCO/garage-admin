import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon, XMarkIcon, CheckIcon } from "@heroicons/react/24/solid";
import { FireIcon } from "@heroicons/react/24/outline";
import { fuelTypesService } from "../../api/fuelTypesService";
import Button from "../Button";

const FuelTypeMultiSelector = ({ 
  isOpen, 
  onClose, 
  onSelect, 
  selectedFuelTypes = [],
  title = "Select Fuel Types" 
}) => {
  const [fuelTypes, setFuelTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 12
  });
  const [tempSelectedFuelTypes, setTempSelectedFuelTypes] = useState([]);

  // Initialize temp selection when modal opens
  useEffect(() => {
    if (isOpen) {
      setTempSelectedFuelTypes([...selectedFuelTypes]);
    }
  }, [isOpen, selectedFuelTypes]);

  // Fetch fuel types
  const fetchFuelTypes = async (page = 1, search = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fuelTypesService.getAllFuelTypes(page, pagination.limit, search);
      
      setFuelTypes(response.data || []);
      setPagination({
        page: response.page || 1,
        pages: response.pages || 1,
        total: response.total || 0,
        limit: pagination.limit
      });
    } catch (err) {
      console.error('Error fetching fuel types:', err);
      setError('Failed to load fuel types');
    } finally {
      setLoading(false);
    }
  };

  // Fetch fuel types when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchFuelTypes(1, '');
      setSearchQuery('');
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle search with debounce
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchFuelTypes(1, value);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    fetchFuelTypes(newPage, searchQuery);
  };

  // Handle fuel type selection toggle
  const handleFuelTypeToggle = (fuelTypeId) => {
    setTempSelectedFuelTypes(prev => {
      const isSelected = prev.includes(fuelTypeId);
      if (isSelected) {
        return prev.filter(id => id !== fuelTypeId);
      } else {
        return [...prev, fuelTypeId];
      }
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    const currentPageIds = fuelTypes.map(f => f._id);
    const newSelected = [...new Set([...tempSelectedFuelTypes, ...currentPageIds])];
    setTempSelectedFuelTypes(newSelected);
  };

  // Handle clear all
  const handleClearAll = () => {
    setTempSelectedFuelTypes([]);
  };

  // Handle confirm selection
  const handleConfirm = () => {
    onSelect(tempSelectedFuelTypes);
    onClose();
  };

  // Handle cancel
  const handleCancel = () => {
    setTempSelectedFuelTypes([...selectedFuelTypes]);
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
              Selected: {tempSelectedFuelTypes.length} fuel type{tempSelectedFuelTypes.length !== 1 ? 's' : ''}
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
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search fuel types..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <Button
                text="Select All"
                variant="outlined"
                onClick={handleSelectAll}
                disabled={loading || fuelTypes.length === 0}
                fullWidth={false}
              />
              <Button
                text="Clear All"
                variant="outlined"
                onClick={handleClearAll}
                disabled={loading || tempSelectedFuelTypes.length === 0}
                fullWidth={false}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading fuel types...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <Button
                text="Retry"
                variant="outlined"
                onClick={() => fetchFuelTypes(pagination.page, searchQuery)}
                fullWidth={false}
              />
            </div>
          ) : fuelTypes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? 'No fuel types found matching your search' : 'No fuel types available'}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {fuelTypes.map((fuelType) => {
                const isSelected = tempSelectedFuelTypes.includes(fuelType._id);
                return (
                  <div
                    key={fuelType._id}
                    onClick={() => handleFuelTypeToggle(fuelType._id)}
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

                    {/* Image */}
                    <div className="w-16 h-16 mb-3 flex items-center justify-center">
                      {fuelType.image ? (
                        <img
                          src={fuelType.image}
                          alt={`${fuelType.title} icon`}
                          className="w-full h-full object-contain rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                          <FireIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">{fuelType.title}</h3>
                      <p className="text-xs text-gray-500">{fuelType.value}</p>
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
                Showing {fuelTypes.length} of {pagination.total} fuel types
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
            text={`Confirm (${tempSelectedFuelTypes.length})`}
            variant="contained"
            onClick={handleConfirm}
            disabled={loading}
            fullWidth={false}
          />
        </div>
      </div>
    </div>
  );
};

export default FuelTypeMultiSelector;