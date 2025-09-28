import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useGaragesData } from "../../hooks/useGaragesData";
import PageHeader from "../../components/PageHeader";
import DeleteConfirmDialog from "../../components/DeleteConfirmDialog";
import GaragesTable from "./GaragesTable";
import PaginationControls from "../../components/PaginationControls";

const GaragesPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const {
        garages,
        loading,
        error,
        pagination,
        searchQuery,
        deleteLoading,
        handleSearch,
        handlePageChange,
        handleLimitChange,
        deleteGarageById,
        refreshGarages
    } = useGaragesData();

    const [deleteDialog, setDeleteDialog] = useState({ open: false, garage: null });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    useEffect(() => {
        if (location.state?.message && !location.state.cleared) {
            setSnackbar({
                open: true,
                message: location.state.message,
                severity: location.state.severity || "success",
            });
            navigate(location.pathname, { replace: true, state: { cleared: true } });
        }
    }, [location, navigate]);

    const handleEdit = (garageId) => {
        navigate(`/garages/edit/${garageId}`);
    };

    const handleAdd = () => {
        navigate('/garages/add');
    };

    const handleDeleteClick = (garage) => {
        setDeleteDialog({ open: true, garage });
    };

    const handleDeleteConfirm = async () => {
        if (deleteDialog.garage) {
            const result = await deleteGarageById(deleteDialog.garage._id);

            if (result.success) {
                setSnackbar({
                    open: true,
                    message: "Garage deleted successfully",
                    severity: "success",
                });
            } else {
                setSnackbar({
                    open: true,
                    message: result.error || "Failed to delete garage",
                    severity: "error",
                });
            }
        }
        setDeleteDialog({ open: false, garage: null });
    };

    const handleDeleteCancel = () => {
        setDeleteDialog({ open: false, garage: null });
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    if (error) {
        return (
            <div className="w-full h-full flex flex-col">
                <div className="p-4">
                    <div className="mb-2 p-3 border border-red-300 rounded bg-red-50 text-red-700 flex justify-between items-center">
                        <span>{error}</span>
                        <button
                            onClick={refreshGarages}
                            className="ml-4 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col bg-gray-50">
            {/* Header */}
            <div className="p-4 pb-0 flex-shrink-0">
                <PageHeader
                    title="Garage Management"
                    breadcrumbs={[
                        { label: "Dashboard", path: "/dashboard" },
                        { label: "Garages", path: "/garages" },
                    ]}
                />
            </div>

            {/* Garages Table */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <GaragesTable
                    garages={garages}
                    loading={loading}
                    searchQuery={searchQuery}
                    deleteLoading={deleteLoading}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    onAddGarage={handleAdd}
                    onSearch={handleSearch}
                />
            </div>

            {/* Pagination */}
            <div className="px-4 py-3 flex-shrink-0 border-t border-gray-200 bg-white">
                <PaginationControls
                    page={pagination.page}
                    pages={pagination.pages}
                    total={pagination.total}
                    limit={pagination.limit}
                    onPageChange={handlePageChange}
                    onLimitChange={handleLimitChange}
                    disabled={loading}
                />
            </div>

            {/* Delete Dialog */}
            <DeleteConfirmDialog
                open={deleteDialog.open}
                title="Delete Garage"
                itemName={deleteDialog.garage?.name}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
            />

            {/* Snackbar */}
            {snackbar.open && (
                <div className="fixed bottom-5 right-5 z-50">
                    <div
                        className={`px-4 py-2 rounded shadow-lg text-white ${
                            snackbar.severity === "success"
                                ? "bg-green-600"
                                : "bg-red-600"
                        }`}
                    >
                        <div className="flex items-center justify-between space-x-4">
                            <span>{snackbar.message}</span>
                            <button
                                onClick={handleSnackbarClose}
                                className="text-white font-bold"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GaragesPage;