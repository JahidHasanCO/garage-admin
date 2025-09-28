import React from "react";
import Button from "../../components/Button";
import SearchBar from "../../components/SearchBar";
import { PlusIcon, PencilIcon, TrashIcon, BuildingStorefrontIcon } from "@heroicons/react/24/solid";

const GaragesTable = ({
  garages,
  loading,
  searchQuery,
  deleteLoading,
  onEdit,
  onDelete,
  onAddGarage,
  onSearch,
}) => {
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const formatContact = (contact) => {
    const parts = [];
    if (contact?.phone) parts.push(contact.phone);
    if (contact?.email) parts.push(contact.email);
    return parts.join(' • ') || 'No contact info';
  };

  const formatLocation = (garage) => {
    const parts = [garage.city];
    if (garage.country && garage.country !== 'Bangladesh') {
      parts.push(garage.country);
    }
    return parts.join(', ');
  };

  return (
    <div className="flex flex-col w-full h-full px-4 pb-4">
      {/* Card container */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-black">Garages</h2>
            {searchQuery && (
              <p className="text-sm text-gray-700 mt-1">Search results for: "{searchQuery}"</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <SearchBar
              placeholder="Search garages..."
              value={searchQuery}
              onChange={onSearch}
            />
            <Button
              text="Add Garage"
              variant="outlined"
              startIcon={<PlusIcon className="w-5 h-5" />}
              onClick={onAddGarage}
              fullWidth={false}
            />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Garage</th>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Address</th>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Location</th>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Contact</th>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Manufacturers</th>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Fuel Types</th>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Created</th>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center">
                      <div className="loader mb-2" />
                      <p className="text-gray-600">Loading garages...</p>
                    </div>
                  </td>
                </tr>
              ) : garages.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8">
                    <p className="text-gray-500 text-lg">
                      {searchQuery ? "No garages found matching your search" : "No garages available"}
                    </p>
                    {!searchQuery && (
                      <div className="mt-4">
                        <Button
                          text="Add Your First Garage"
                          variant="outlined"
                          startIcon={<PlusIcon className="w-5 h-5" />}
                          onClick={onAddGarage}
                          fullWidth={false}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                garages.map((garage, idx) => (
                  <tr
                    key={garage._id}
                    className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 transition-colors`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded-lg">
                          <BuildingStorefrontIcon className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{garage.name}</p>
                          <p className="text-sm text-gray-500">
                            ID: {garage._id.slice(-8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-900 max-w-xs">
                        {garage.address.length > 50
                          ? `${garage.address.substring(0, 50)}...`
                          : garage.address}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-900">{formatLocation(garage)}</p>
                      {garage.geo?.lat && garage.geo?.lng && (
                        <p className="text-xs text-gray-500">
                          {garage.geo.lat.toFixed(4)}, {garage.geo.lng.toFixed(4)}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-700">{formatContact(garage.contact)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">
                        {garage.supportedManufacturers?.length || 0} supported
                      </div>
                      {garage.supportedManufacturers?.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {garage.supportedManufacturers.slice(0, 2).map(manufacturer => 
                            typeof manufacturer === 'object' ? manufacturer.name : 'Manufacturer'
                          ).join(', ')}
                          {garage.supportedManufacturers.length > 2 && ` +${garage.supportedManufacturers.length - 2} more`}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">
                        {garage.supportedFuelTypes?.length || 0} supported
                      </div>
                      {garage.supportedFuelTypes?.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {garage.supportedFuelTypes.slice(0, 2).map(fuelType => 
                            typeof fuelType === 'object' ? fuelType.title : 'Fuel Type'
                          ).join(', ')}
                          {garage.supportedFuelTypes.length > 2 && ` +${garage.supportedFuelTypes.length - 2} more`}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-sm">{formatDate(garage.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button
                          onClick={() => onEdit(garage._id)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          title="Edit"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => onDelete(garage)}
                          className={`${deleteLoading === garage._id
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-red-500 hover:text-red-600"
                            } transition-colors`}
                          disabled={deleteLoading === garage._id}
                          title="Delete"
                        >
                          {deleteLoading === garage._id ? (
                            <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <TrashIcon className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GaragesTable;