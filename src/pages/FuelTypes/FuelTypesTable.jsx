import React from "react";
import Button from "../../components/Button";
import { PlusIcon, PencilIcon, TrashIcon, PhotoIcon } from "@heroicons/react/24/solid";

const FuelTypesTable = ({
  fuelTypes,
  loading,
  searchQuery,
  deleteLoading,
  onEdit,
  onDelete,
  onAddFuelType,
}) => {
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  return (
    <div className="flex flex-col w-full h-full px-4 pb-4">
      {/* Card container */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-black">Fuel Types</h2>
            {searchQuery && (
              <p className="text-sm text-gray-700 mt-1">Search results for: "{searchQuery}"</p>
            )}
          </div>
          <Button
            text="Add Fuel Type"
            variant="outlined"
            startIcon={<PlusIcon className="w-5 h-5" />}
            onClick={onAddFuelType}
            fullWidth={false}
          />
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Image</th>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Title</th>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Value</th>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Created</th>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center">
                      <div className="loader mb-2" />
                      <p className="text-gray-600">Loading fuel types...</p>
                    </div>
                  </td>
                </tr>
              ) : fuelTypes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8">
                    <p className="text-gray-500 text-lg">
                      {searchQuery ? "No fuel types found matching your search" : "No fuel types available"}
                    </p>
                    {!searchQuery && (
                      <div className="mt-4">
                        <Button
                          text="Add Your First Fuel Type"
                          variant="outlined"
                          startIcon={<PlusIcon className="w-5 h-5" />}
                          onClick={onAddFuelType}
                          fullWidth={false}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                fuelTypes.map((fuelType, idx) => (
                  <tr
                    key={fuelType._id}
                    className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 transition-colors`}
                  >
                    <td className="px-4 py-3">
                      {fuelType.image ? (
                        <img
                          src={fuelType.image}
                          alt={fuelType.title}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded-lg">
                          <PhotoIcon className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{fuelType.title}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded">
                        {fuelType.value}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-sm">{formatDate(fuelType.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button
                          onClick={() => onEdit(fuelType._id)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          title="Edit"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => onDelete(fuelType)}
                          className={`${deleteLoading === fuelType._id
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-red-500 hover:text-red-600"
                            } transition-colors`}
                          disabled={deleteLoading === fuelType._id}
                          title="Delete"
                        >
                          {deleteLoading === fuelType._id ? (
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

export default FuelTypesTable;