import Button from "../../components/Button";
import { PlusIcon, PencilIcon, TrashIcon, CubeIcon, BuildingStorefrontIcon, FireIcon } from "@heroicons/react/24/solid";

const ServicePackagesTable = ({
  servicePackages,
  loading,
  searchQuery,
  deleteLoading,
  onEdit,
  onDelete,
  onAddServicePackage,
}) => {
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatDuration = (duration) => {
    if (!duration || duration === 0) return 'Not specified';
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="flex flex-col w-full h-full px-4 pb-4">
      {/* Card container */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-black">Service Packages</h2>
            {searchQuery && (
              <p className="text-sm text-gray-700 mt-1">Search results for: "{searchQuery}"</p>
            )}
          </div>
          <div className="flex items-center gap-3">

            <Button
              text="Add Package"
              variant="outlined"
              startIcon={<PlusIcon className="w-5 h-5" />}
              onClick={onAddServicePackage}
              fullWidth={false}
            />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-white sticky top-0">
              <tr>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Package</th>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Price</th>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Duration</th>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Services</th>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Garages</th>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Applicable To</th>
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
                      <p className="text-gray-600">Loading service packages...</p>
                    </div>
                  </td>
                </tr>
              ) : servicePackages.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8">
                    <p className="text-gray-500 text-lg">
                      {searchQuery ? "No service packages found matching your search" : "No service packages available"}
                    </p>
                    {!searchQuery && (
                      <div className="mt-4">
                        <Button
                          text="Add Your First Package"
                          variant="outlined"
                          startIcon={<PlusIcon className="w-5 h-5" />}
                          onClick={onAddServicePackage}
                          fullWidth={false}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                servicePackages.map((servicePackage) => (
                  <tr
                    key={servicePackage._id}
                    className={`bg-white hover:bg-gray-100 transition-colors`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded-lg overflow-hidden">
                          {servicePackage.image ? (
                            <img
                              src={servicePackage.image}
                              alt={servicePackage.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <CubeIcon className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{servicePackage.name}</p>
                          <p className="text-sm text-gray-500">
                            ID: {servicePackage._id.slice(-8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-green-600 text-lg">
                        {formatPrice(servicePackage.price)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-700">
                        {formatDuration(servicePackage.duration)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">
                        {servicePackage.services?.length || 0} services
                      </div>
                      {servicePackage.services?.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {servicePackage.services.slice(0, 2).map(service => 
                            typeof service === 'object' ? service.name : 'Service'
                          ).join(', ')}
                          {servicePackage.services.length > 2 && ` +${servicePackage.services.length - 2} more`}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">
                        {servicePackage.garages?.length || 0} garages
                      </div>
                      {servicePackage.garages?.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {servicePackage.garages.slice(0, 2).map(garage => 
                            typeof garage === 'object' ? garage.name : 'Garage'
                          ).join(', ')}
                          {servicePackage.garages.length > 2 && ` +${servicePackage.garages.length - 2} more`}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col space-y-1">
                        {servicePackage.applicableManufacturers?.length > 0 && (
                          <div className="flex items-center text-xs text-gray-600">
                            <BuildingStorefrontIcon className="w-3 h-3 mr-1" />
                            {servicePackage.applicableManufacturers.length} manufacturers
                          </div>
                        )}
                        {servicePackage.applicableFuelTypes?.length > 0 && (
                          <div className="flex items-center text-xs text-gray-600">
                            <FireIcon className="w-3 h-3 mr-1" />
                            {servicePackage.applicableFuelTypes.length} fuel types
                          </div>
                        )}
                        {(!servicePackage.applicableManufacturers?.length && !servicePackage.applicableFuelTypes?.length) && (
                          <span className="text-xs text-gray-400">All vehicles</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-sm">{formatDate(servicePackage.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button
                          onClick={() => onEdit(servicePackage._id)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          title="Edit"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => onDelete(servicePackage)}
                          className={`${deleteLoading === servicePackage._id
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-red-500 hover:text-red-600"
                            } transition-colors`}
                          disabled={deleteLoading === servicePackage._id}
                          title="Delete"
                        >
                          {deleteLoading === servicePackage._id ? (
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

export default ServicePackagesTable;