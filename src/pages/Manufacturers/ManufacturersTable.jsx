import React from "react";
import Button from "../../components/Button";
import { PlusIcon, PencilIcon, TrashIcon, PhotoIcon, GlobeAltIcon } from "@heroicons/react/24/solid";

const ManufacturersTable = ({
  manufacturers,
  loading,
  searchQuery,
  deleteLoading,
  onEdit,
  onDelete,
  onAddManufacturer,
}) => {
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const formatWebsite = (url) => {
    if (!url) return null;
    // Remove protocol for display
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  };

  return (
    <div className="flex flex-col w-full h-full px-4 pb-4">
      {/* Card container */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-black">Manufacturers</h2>
            {searchQuery && (
              <p className="text-sm text-gray-700 mt-1">Search results for: "{searchQuery}"</p>
            )}
          </div>
          <Button
            text="Add Manufacturer"
            variant="outlined"
            startIcon={<PlusIcon className="w-5 h-5" />}
            onClick={onAddManufacturer}
            fullWidth={false}
          />
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Logo</th>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Name</th>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Country</th>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Founded</th>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Website</th>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Created</th>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center">
                      <div className="loader mb-2" />
                      <p className="text-gray-600">Loading manufacturers...</p>
                    </div>
                  </td>
                </tr>
              ) : manufacturers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8">
                    <p className="text-gray-500 text-lg">
                      {searchQuery ? "No manufacturers found matching your search" : "No manufacturers available"}
                    </p>
                    {!searchQuery && (
                      <div className="mt-4">
                        <Button
                          text="Add Your First Manufacturer"
                          variant="outlined"
                          startIcon={<PlusIcon className="w-5 h-5" />}
                          onClick={onAddManufacturer}
                          fullWidth={false}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                manufacturers.map((manufacturer, idx) => (
                  <tr
                    key={manufacturer._id}
                    className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 transition-colors`}
                  >
                    <td className="px-4 py-3">
                      {manufacturer.logo ? (
                        <img
                          src={manufacturer.logo}
                          alt={`${manufacturer.name} logo`}
                          className="w-12 h-12 object-contain rounded-lg bg-white border border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded-lg">
                          <PhotoIcon className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{manufacturer.name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs font-medium text-indigo-700 bg-indigo-100 rounded">
                        {manufacturer.country}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-sm">
                      {manufacturer.founded || "-"}
                    </td>
                    <td className="px-4 py-3">
                      {manufacturer.website ? (
                        <a
                          href={manufacturer.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                          title={manufacturer.website}
                        >
                          <GlobeAltIcon className="w-4 h-4 mr-1" />
                          {formatWebsite(manufacturer.website)}
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-sm">{formatDate(manufacturer.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button
                          onClick={() => onEdit(manufacturer._id)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          title="Edit"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => onDelete(manufacturer)}
                          className={`${deleteLoading === manufacturer._id
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-red-500 hover:text-red-600"
                            } transition-colors`}
                          disabled={deleteLoading === manufacturer._id}
                          title="Delete"
                        >
                          {deleteLoading === manufacturer._id ? (
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

export default ManufacturersTable;