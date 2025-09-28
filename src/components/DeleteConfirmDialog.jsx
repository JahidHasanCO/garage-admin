import React from "react";

const DeleteConfirmDialog = ({
  open,
  title = "Delete Item",
  message,
  itemName,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        {/* Header */}
        <div className="px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <p className="text-gray-700">
            {message ||
              `Are you sure you want to delete "${itemName}"? This action cannot be undone.`}
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmDialog;
