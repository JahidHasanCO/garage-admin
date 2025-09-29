import React from "react";
import Button from "../../components/Button";
import { PlusIcon, PencilIcon, TrashIcon, PhotoIcon } from "@heroicons/react/24/solid";

const VehiclesTable = ({
  vehicles,
  loading,
  searchQuery,
  deleteLoading,
  onEdit,
  onDelete,
  onAddVehicle,
}) => {
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const formatMileage = (mileage) => {
    return new Intl.NumberFormat("en-US").format(mileage);
  };

  const getTransmissionBadgeColor = (transmission) => {
    switch (transmission) {
      case 'automatic':
        return 'bg-green-100 text-green-700';
      case 'manual':
        return 'bg-blue-100 text-blue-700';
      case 'cvt':
        return 'bg-purple-100 text-purple-700';
      case 'semi-automatic':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex flex-col w-full h-full px-4 pb-4">
      {/* Card container */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-black">Vehicles</h2>
            {searchQuery && (
              <p className="text-sm text-gray-700 mt-1">Search results for: "{searchQuery}"</p>
            )}
          </div>
          <Button
            text="Add Vehicle"
            variant="outlined"
            startIcon={<PlusIcon className="w-5 h-5" />}
            onClick={onAddVehicle}
            fullWidth={false}
          />
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-white sticky top-0">
              <tr>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Image</th>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Vehicle</th>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">License Plate</th>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Fuel Type</th>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Transmission</th>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Mileage</th>
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
                      <p className="text-gray-600">Loading vehicles...</p>
                    </div>
                  </td>
                </tr>
              ) : vehicles.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8">
                    <p className="text-gray-500 text-lg">
                      {searchQuery ? "No vehicles found matching your search" : "No vehicles available"}
                    </p>
                    {!searchQuery && (
                      <div className="mt-4">
                        <Button
                          text="Add Your First Vehicle"
                          variant="outlined"
                          startIcon={<PlusIcon className="w-5 h-5" />}
                          onClick={onAddVehicle}
                          fullWidth={false}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                vehicles.map((vehicle) => (
                  <tr
                    key={vehicle._id}
                    className={`bg-white hover:bg-gray-100 transition-colors`}
                  >
                    <td className="px-4 py-3">
                      {vehicle.image ? (
                        <img
                          src={vehicle.image}
                          alt={`${vehicle.manufacturer?.name} ${vehicle.model}`}
                          className="w-16 h-12 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-12 bg-gray-200 flex items-center justify-center rounded-lg">
                          <PhotoIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          {vehicle.manufacturer?.name} {vehicle.model}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-gray-600">{vehicle.year}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-600">{vehicle.color}</span>
                        </div>
                        {vehicle.vin && (
                          <p className="text-xs text-gray-400 mt-1">VIN: {vehicle.vin}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-sm font-medium text-gray-800 bg-gray-200 rounded">
                        {vehicle.license_plate}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        {vehicle.fuel_type?.image && (
                          <img
                            src={vehicle.fuel_type.image}
                            alt={vehicle.fuel_type.title}
                            className="w-6 h-6 object-contain mr-2"
                          />
                        )}
                        <span className="text-sm text-gray-700">{vehicle.fuel_type?.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${getTransmissionBadgeColor(vehicle.transmission)}`}>
                        {vehicle.transmission}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-sm">
                      {formatMileage(vehicle.mileage)} km
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-sm">{formatDate(vehicle.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button
                          onClick={() => onEdit(vehicle._id)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          title="Edit"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => onDelete(vehicle)}
                          className={`${deleteLoading === vehicle._id
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-red-500 hover:text-red-600"
                            } transition-colors`}
                          disabled={deleteLoading === vehicle._id}
                          title="Delete"
                        >
                          {deleteLoading === vehicle._id ? (
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

export default VehiclesTable;