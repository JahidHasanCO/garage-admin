import React from "react";
import Button from "../../components/Button";
import SearchBar from "../../components/SearchBar";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

const StaffsTable = ({ staffs, loading, searchQuery, deleteLoading, onEdit, onDelete, onAddStaff }) => {
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  return (
    <div className="flex flex-col w-full h-full px-4 pb-4">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-black">Staff</h2>
            {searchQuery && <p className="text-sm text-gray-700 mt-1">Search results for: "{searchQuery}"</p>}
          </div>
          <div className="flex items-center gap-3">
            <Button text="Add Staff" variant="outlined" startIcon={<PlusIcon className="w-5 h-5" />} onClick={onAddStaff} fullWidth={false} />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-white sticky top-0">
              <tr>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Name</th>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Email</th>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Garage</th>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Role</th>
                <th className="text-left font-semibold px-4 py-2 text-gray-700">Status</th>
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
                      <p className="text-gray-600">Loading staff...</p>
                    </div>
                  </td>
                </tr>
              ) : staffs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8">
                    <p className="text-gray-500 text-lg">{searchQuery ? "No staff found matching your search" : "No staff available"}</p>
                    {!searchQuery && (
                      <div className="mt-4">
                        <Button text="Add Your First Staff" variant="outlined" startIcon={<PlusIcon className="w-5 h-5" />} onClick={onAddStaff} fullWidth={false} />
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                staffs.map((staff) => (
                  <tr key={staff._id} className={`bg-white hover:bg-gray-100 transition-colors`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded-lg">
                          <div className="text-gray-400">👤</div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{staff.user_id?.name || 'Unknown'}</p>
                          <p className="text-sm text-gray-500">ID: {staff._id?.slice(-8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{staff.user_id?.email || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{staff.garage?.name || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{staff.role || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{staff.status || '-'}</td>
                    <td className="px-4 py-3 text-gray-500 text-sm">{formatDate(staff.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button onClick={() => onEdit(staff._id)} className="text-gray-400 hover:text-gray-600 transition-colors" title="Edit">
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => onDelete(staff)} className={`${deleteLoading === staff._id ? "text-gray-400 cursor-not-allowed" : "text-red-500 hover:text-red-600"} transition-colors`} disabled={deleteLoading === staff._id} title="Delete">
                          {deleteLoading === staff._id ? (<div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />) : (<TrashIcon className="w-5 h-5" />)}
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

export default StaffsTable;
