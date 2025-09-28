import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useServicePackagesData } from "../../hooks/useServicePackagesData";
import PageHeader from "../../components/PageHeader";
import DeleteConfirmDialog from "../../components/DeleteConfirmDialog";
import ServicePackagesTable from "./ServicePackagesTable";
import PaginationControls from "../../components/PaginationControls";

const ServicePackagesPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const {
        servicePackages,
        loading,
        error,
        pagination,
        searchQuery,
        deleteLoading,
        handleSearch,
        handlePageChange,
        handleLimitChange,
        deleteServicePackageById,
        refreshServicePackages
    } = useServicePackagesData();

    const [deleteDialog, setDeleteDialog] = useState({ open: false, servicePackage: null });
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

    const handleEdit = (servicePackageId) => {
        navigate(`/service-packages/edit/${servicePackageId}`);
    };

    const handleAdd = () => {
        navigate('/service-packages/add');
    };

    const handleDeleteClick = (servicePackage) => {
        setDeleteDialog({ open: true, servicePackage });
    };

    const handleDeleteConfirm = async () => {
        if (deleteDialog.servicePackage) {
            const result = await deleteServicePackageById(deleteDialog.servicePackage._id);

            if (result.success) {
                setSnackbar({
                    open: true,
                    message: "Service package deleted successfully",
                    severity: "success",
                });
            } else {
                setSnackbar({
                    open: true,
                    message: result.error || "Failed to delete service package",
                    severity: "error",
                });
            }
        }
        setDeleteDialog({ open: false, servicePackage: null });
    };

    const handleDeleteCancel = () => {
        setDeleteDialog({ open: false, servicePackage: null });
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
                            onClick={refreshServicePackages}
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
                    title="Service Packages Management"
                    breadcrumbs={[
                        { label: "Dashboard", path: "/dashboard" },
                        { label: "Service Packages", path: "/service-packages" },
                    ]}
                />
            </div>

            {/* Service Packages Table */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <ServicePackagesTable
                    servicePackages={servicePackages}
                    loading={loading}
                    searchQuery={searchQuery}
                    deleteLoading={deleteLoading}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    onAddServicePackage={handleAdd}
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
                title="Delete Service Package"
                itemName={deleteDialog.servicePackage?.name}
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

export default ServicePackagesPage;