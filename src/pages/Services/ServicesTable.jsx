import React from "react";
import Button from "../../components/Button";
import { PlusIcon, PencilIcon, TrashIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/solid";

const ServicesTable = ({
  services,
  loading,
  searchQuery,
  onEdit,
  onDelete,
  onAddService,
}) => {
  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);

  const formatTime = (minutes) => {
    if (!minutes) return '0 min';
    
    if (minutes < 60) {
      return `${minutes} min`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours}h`;
    }
    
    return `${hours}h ${remainingMinutes}min`;
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  return (
    <div className="flex flex-col w-full h-full px-4 pb-4">
      {/* Card container */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-black">Services</h2>
            {searchQuery && (
              <p className="text-sm text-gray-700 mt-1">Search results for: "{searchQuery}"</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button
              text="Add Service"
              variant="outlined"
              startIcon={<PlusIcon className="w-5 h-5" />}
              onClick={onAddService}
              fullWidth={false}
            />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-white sticky top-0">
              <tr>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Image</th>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Service Name</th>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Price</th>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Est. Time</th>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Parts</th>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Discount</th>
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
                      <p className="text-gray-600">Loading services...</p>
                    </div>
                  </td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8">
                    <p className="text-gray-500 text-lg">
                      {searchQuery ? "No services found matching your search" : "No services available"}
                    </p>
                    {!searchQuery && (
                      <div className="mt-4">
                        <Button
                          text="Add Your First Service"
                          variant="outlined"
                          startIcon={<PlusIcon className="w-5 h-5" />}
                          onClick={onAddService}
                          fullWidth={false}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr
                    key={service._id}
                    className={`bg-white hover:bg-gray-100 transition-colors`}
                  >
                    <td className="px-4 py-3">
                      {service.image ? (
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded-lg">
                          <WrenchScrewdriverIcon className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{service.name}</p>
                      {service.description && (
                        <p className="text-sm text-gray-500">
                          {service.description.length > 50
                            ? `${service.description.substring(0, 50)}...`
                            : service.description}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-green-600 font-medium">{formatPrice(service.price)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-700">{formatTime(service.estimated_time)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">
                        {service.parts_needed?.length || 0} parts
                      </div>
                      {service.parts_needed?.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {service.parts_needed.slice(0, 2).map(part => 
                            typeof part === 'object' ? part.name : 'Part'
                          ).join(', ')}
                          {service.parts_needed.length > 2 && ` +${service.parts_needed.length - 2} more`}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {service.discount > 0 ? (
                        <span className="px-2 py-1 text-xs font-medium text-orange-700 bg-orange-100 rounded">
                          {service.discount}%
                        </span>
                      ) : (
                        <p className="text-gray-400 text-sm">No discount</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-sm">{formatDate(service.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button
                          onClick={() => onEdit(service._id)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          title="Edit"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => onDelete(service)}
                          className="text-red-500 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <TrashIcon className="w-5 h-5" />
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

export default ServicesTable;