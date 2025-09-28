import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon, XMarkIcon, CheckIcon } from "@heroicons/react/24/solid";
import { fuelTypesService } from "../../api/fuelTypesService";
import Button from "../Button";

const FuelTypeSelector = ({ isOpen, onClose, onSelect, selectedFuelType = null }) => {
  const [fuelTypes, setFuelTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 10
  });

  // Fetch fuel types
  const fetchFuelTypes = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const response = await fuelTypesService.getAllFuelTypes(page, pagination.limit, search);
      
      setFuelTypes(response.data || []);
      setPagination({
        page: response.page || 1,
        pages: response.pages || 1,
        total: response.total || 0,
        limit: pagination.limit
      });
    } catch (error) {
      console.error('Failed to fetch fuel types:', error);
      setFuelTypes([]);
    } finally {
      setLoading(false);
    }
  };

  // Load fuel types when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchFuelTypes(1, '');
      setSearchQuery('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Handle search
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

  // Handle fuel type selection
  const handleSelect = (fuelType) => {
    onSelect(fuelType);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Select Fuel Type</h2>
          <button
            onClick={onClose}
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
              placeholder="Search fuel types..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading fuel types...</span>
            </div>
          ) : fuelTypes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? 'No fuel types found matching your search' : 'No fuel types available'}
            </div>
          ) : (
            <div className="grid gap-3">
              {fuelTypes.map((fuelType) => (
                <div
                  key={fuelType._id}
                  onClick={() => handleSelect(fuelType)}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedFuelType?._id === fuelType._id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200'
                  }`}
                >
                  {/* Image */}
                  <div className="flex-shrink-0 w-12 h-12 mr-4">
                    {fuelType.image ? (
                      <img
                        src={fuelType.image}
                        alt={`${fuelType.title} icon`}
                        className="w-full h-full object-contain rounded"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-xs">{fuelType.title.charAt(0)}</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{fuelType.title}</h3>
                    <p className="text-sm text-gray-500">Value: {fuelType.value}</p>
                  </div>

                  {/* Selection indicator */}
                  {selectedFuelType?._id === fuelType._id && (
                    <CheckIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  )}
                </div>
              ))}
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
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
          <Button
            text="Cancel"
            variant="outlined"
            onClick={onClose}
            fullWidth={false}
          />
        </div>
      </div>
    </div>
  );
};

export default FuelTypeSelector;