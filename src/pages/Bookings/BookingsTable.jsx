import React from 'react';
import Button from '../../components/Button';
import SearchBar from '../../components/SearchBar';
import { PlusIcon, PencilIcon, TrashIcon, UserPlusIcon } from '@heroicons/react/24/solid';

const BookingsTable = ({ bookings, loading, searchQuery, deleteLoading, onEdit, onDelete, onAddBooking, onSearch, onAssign }) => {
  const formatDate = (d) => d ? new Date(d).toLocaleString() : '-';

  return (
    <div className="flex flex-col w-full h-full px-4 pb-4">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-black">Bookings</h2>
            {searchQuery && <p className="text-sm text-gray-700 mt-1">Search results for: "{searchQuery}"</p>}
          </div>
          <div className="flex items-center gap-3">
            <SearchBar placeholder="Search bookings..." value={searchQuery} onChange={onSearch} />
            <Button text="Add Booking" variant="outlined" startIcon={<PlusIcon className="w-5 h-5" />} onClick={onAddBooking} fullWidth={false} />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-white sticky top-0">
              <tr>
                  <th className="text-left font-semibold px-4 py-2 text-gray-700">ID</th>
                  <th className="text-left font-semibold px-4 py-2 text-gray-700">Garage</th>
                  <th className="text-left font-semibold px-4 py-2 text-gray-700">Service</th>
                  <th className="text-left font-semibold px-4 py-2 text-gray-700">Vehicle</th>
                  <th className="text-left font-semibold px-4 py-2 text-gray-700">Assigned</th>
                  <th className="text-left font-semibold px-4 py-2 text-gray-700">Price</th>
                  <th className="text-left font-semibold px-4 py-2 text-gray-700">Payment</th>
                  <th className="text-left font-semibold px-4 py-2 text-gray-700">Status</th>
                  <th className="text-left font-semibold px-4 py-2 text-gray-700">Requested</th>
                  <th className="text-left font-semibold px-4 py-2 text-gray-700">Actions</th>
                </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="text-center py-8">
                    <div className="flex flex-col items-center">
                      <div className="loader mb-2" />
                      <p className="text-gray-600">Loading bookings...</p>
                    </div>
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-8">
                    <p className="text-gray-500 text-lg">{searchQuery ? 'No bookings found' : 'No bookings available'}</p>
                    {!searchQuery && (
                      <div className="mt-4">
                        <Button text="Add Booking" variant="outlined" startIcon={<PlusIcon className="w-5 h-5" />} onClick={onAddBooking} fullWidth={false} />
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b._id} className={`bg-white hover:bg-gray-100 transition-colors`}>
                    <td className="px-4 py-3 text-sm text-gray-700">{b._id?.slice(-8)}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{(b.garage && typeof b.garage === 'object') ? b.garage.name : (b.garage ? String(b.garage).slice(-8) : '-')}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{(b.servicePackage && typeof b.servicePackage === 'object') ? b.servicePackage.name : ((b.singleService && typeof b.singleService === 'object') ? b.singleService.name : (b.servicePackage || b.singleService || '-'))}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{(b.vehicle && typeof b.vehicle === 'object') ? (b.vehicle.model ? `${b.vehicle.model} (${b.vehicle.license_plate || b.vehicle.license || ''})` : (b.vehicle.license_plate || b.vehicle._id?.slice(-8))) : (b.vehicle || '-')}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{(b.assignedStaff && typeof b.assignedStaff === 'object') ? (b.assignedStaff.user_id?.name || b.assignedStaff._id?.slice(-8)) : (b.assignedStaff || '-')}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{(b.servicePackage && typeof b.servicePackage === 'object') ? (b.servicePackage.price ? `৳ ${b.servicePackage.price}` : '-') : ((b.singleService && typeof b.singleService === 'object') ? (b.singleService.price ? `৳ ${b.singleService.price}` : '-') : '-')}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{b.payment?.amount ? `৳ ${b.payment.amount}` : '-' } <div className="text-xs text-gray-500">{b.payment?.status || ''}</div></td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${b.status === 'requested' ? 'bg-gray-100 text-gray-800' : ''} ${b.status === 'assigned' ? 'bg-blue-100 text-blue-800' : ''} ${b.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : ''} ${b.status === 'completed' ? 'bg-green-100 text-green-800' : ''} ${b.status === 'paid' ? 'bg-indigo-100 text-indigo-800' : ''} ${b.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{formatDate(b.requestedAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button onClick={() => onAssign && onAssign(b)} className="text-blue-500 hover:text-blue-600 transition-colors" title="Assign">
                          <UserPlusIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => onEdit(b._id)} className="text-gray-400 hover:text-gray-600 transition-colors" title="Edit">
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => onDelete(b)} className={`${deleteLoading === b._id ? 'text-gray-400 cursor-not-allowed' : 'text-red-500 hover:text-red-600'} transition-colors`} disabled={deleteLoading === b._id} title="Delete">
                          {deleteLoading === b._id ? (<div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />) : (<TrashIcon className="w-5 h-5" />)}
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

export default BookingsTable;
