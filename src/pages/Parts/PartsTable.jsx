import React from "react";
import Button from "../../components/Button";
import { PlusIcon, PencilIcon, TrashIcon, PhotoIcon } from "@heroicons/react/24/solid";

const PartsTable = ({
  parts,
  loading,
  searchQuery,
  deleteLoading,
  onEdit,
  onDelete,
  onAddPart,
}) => {
  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  return (
    <div className="flex flex-col w-full h-full">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-200 flex-shrink-0">
        <div>
          <h2 className="text-lg font-semibold text-black">Parts</h2>
          {searchQuery && (
            <p className="text-sm text-gray-700 mt-1">Search results for: "{searchQuery}"</p>
          )}
        </div>
        <Button
          text="Add Part"
          variant="outlined"
          startIcon={<PlusIcon className="w-5 h-5" />}
          onClick={onAddPart}
          fullWidth={false}
        />
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="text-left font-bold px-4 py-2">Image</th>
              <th className="text-left font-bold px-4 py-2">Part Name</th>
              <th className="text-left font-bold px-4 py-2">SKU</th>
              <th className="text-left font-bold px-4 py-2">Price</th>
              <th className="text-left font-bold px-4 py-2">Created</th>
              <th className="text-left font-bold px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center">
                    <div className="loader mb-2" /> {/* Replace with your spinner */}
                    <p className="text-gray-600">Loading parts...</p>
                  </div>
                </td>
              </tr>
            ) : parts.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8">
                  <p className="text-gray-500 text-lg">
                    {searchQuery ? "No parts found matching your search" : "No parts available"}
                  </p>
                  {!searchQuery && (
                    <div className="mt-4">
                      <Button
                        text="Add Your First Part"
                        variant="outlined"
                        startIcon={<PlusIcon className="w-5 h-5" />}
                        onClick={onAddPart}
                        fullWidth={false}
                      />
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              parts.map((part) => (
                <tr key={part._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {part.image ? (
                      <img
                        src={part.image}
                        alt={part.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded-lg">
                        <PhotoIcon className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{part.name}</p>
                    {part.description && (
                      <p className="text-sm text-gray-500">
                        {part.description.length > 50
                          ? `${part.description.substring(0, 50)}...`
                          : part.description}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {part.sku ? (
                      <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded">
                        {part.sku}
                      </span>
                    ) : (
                      <p className="text-gray-400 text-sm">No SKU</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-green-500 font-medium">{formatPrice(part.price)}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-sm">{formatDate(part.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button
                        text="Edit"
                        size="small"
                        startIcon={<PencilIcon className="w-4 h-4" />}
                        onClick={() => onEdit(part._id)}
                        fullWidth={false}
                      />
                      <Button
                        text="Delete"
                        size="small"
                        color="error"
                        startIcon={
                          deleteLoading === part._id ? (
                            <div className="loader w-4 h-4" /> // Replace with spinner
                          ) : (
                            <TrashIcon className="w-4 h-4" />
                          )
                        }
                        onClick={() => onDelete(part)}
                        disabled={deleteLoading === part._id}
                        fullWidth={false}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PartsTable;
