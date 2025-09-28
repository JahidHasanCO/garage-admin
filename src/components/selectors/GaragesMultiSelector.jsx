import React, { useState, useEffect } from "react";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { BuildingStorefrontIcon } from "@heroicons/react/24/solid";
import Button from "../../components/Button";
import PaginationControls from "../../components/PaginationControls";
import { getAllGarages } from "../../api/garagesService";

const GaragesMultiSelector = ({ isOpen, onClose, onSelect, selectedGarages = [], title = "Select Garages" }) => {
  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 12
  });

  // Local selection state for the modal
  const [tempSelectedGarages, setTempSelectedGarages] = useState([]);

  // Initialize temp selection when modal opens
  useEffect(() => {
    if (isOpen) {
      setTempSelectedGarages([...selectedGarages]);
    }
  }, [isOpen, selectedGarages]);

  // Fetch garages
  const fetchGarages = async (page = 1, search = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getAllGarages(page, pagination.limit, search);
      
      setGarages(response.garages || response.data || []);
      setPagination({
        page: response.page || 1,
        pages: response.pages || 1,
        total: response.total || 0,
        limit: pagination.limit
      });
      
    } catch (err) {
      console.error('Error fetching garages:', err);
      setError('Failed to load garages');
      setGarages([]);
    } finally {
      setLoading(false);
    }
  };

  // Load garages when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchGarages(1, searchQuery);
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle search
  useEffect(() => {
    if (isOpen) {
      const delayedSearch = setTimeout(() => {
        fetchGarages(1, searchQuery);
      }, 300);

      return () => clearTimeout(delayedSearch);
    }
  }, [searchQuery, isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageChange = (newPage) => {
    fetchGarages(newPage, searchQuery);
  };

  const toggleGarageSelection = (garageId) => {
    setTempSelectedGarages(prev => {
      if (prev.includes(garageId)) {
        return prev.filter(id => id !== garageId);
      } else {
        return [...prev, garageId];
      }
    });
  };

  const handleSelectAll = () => {
    const allCurrentIds = garages.map(garage => garage._id);
    const newSelection = [...new Set([...tempSelectedGarages, ...allCurrentIds])];
    setTempSelectedGarages(newSelection);
  };

  const handleDeselectAll = () => {
    const currentIds = garages.map(garage => garage._id);
    setTempSelectedGarages(prev => prev.filter(id => !currentIds.includes(id)));
  };

  const handleConfirm = () => {
    onSelect(tempSelectedGarages);
    onClose();
  };

  const handleCancel = () => {
    setTempSelectedGarages([...selectedGarages]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Search and Actions */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="relative flex-1 max-w-sm">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search garages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2 ml-4">
              <Button
                text="Select All"
                variant="outlined"
                onClick={handleSelectAll}
                fullWidth={false}
                disabled={loading}
              />
              <Button
                text="Deselect All"
                variant="outlined"
                onClick={handleDeselectAll}
                fullWidth={false}
                disabled={loading}
              />
            </div>
          </div>

          <p className="text-sm text-gray-600">
            {tempSelectedGarages.length} of {pagination.total} garages selected
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading garages...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          ) : garages.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-500">No garages found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {garages.map((garage) => {
                const isSelected = tempSelectedGarages.includes(garage._id);
                return (
                  <div
                    key={garage._id}
                    onClick={() => toggleGarageSelection(garage._id)}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                        }`}>
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <BuildingStorefrontIcon className="w-8 h-8 text-gray-400" />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 truncate">{garage.name}</p>
                            <p className="text-sm text-gray-500">{garage.city}, {garage.country}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2 mb-2">{garage.address}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{garage.contact?.phone || 'No phone'}</span>
                          <div className="flex items-center space-x-2">
                            {garage.supportedManufacturers?.length > 0 && (
                              <span>{garage.supportedManufacturers.length} brands</span>
                            )}
                            {garage.supportedFuelTypes?.length > 0 && (
                              <span>{garage.supportedFuelTypes.length} fuels</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && !error && pagination.pages > 1 && (
          <div className="border-t border-gray-200 px-4 py-3">
            <PaginationControls
              page={pagination.page}
              pages={pagination.pages}
              total={pagination.total}
              limit={pagination.limit}
              onPageChange={handlePageChange}
              onLimitChange={() => {}} // Not needed for modal
              disabled={loading}
            />
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <Button
            text="Cancel"
            variant="outlined"
            onClick={handleCancel}
            fullWidth={false}
          />
          <Button
            text={`Select ${tempSelectedGarages.length} Garages`}
            variant="contained"
            onClick={handleConfirm}
            fullWidth={false}
          />
        </div>
      </div>
    </div>
  );
};

export default GaragesMultiSelector;