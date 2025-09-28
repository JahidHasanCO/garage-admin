import React from "react";
import PageHeader from "../../components/PageHeader";
import DeleteConfirmDialog from "../../components/DeleteConfirmDialog";
import GaragesTable from "./GaragesTable";
import PaginationControls from "../../components/PaginationControls";
import { useGaragesData } from "../../hooks/useGaragesData";
import { useNavigate } from "react-router-dom";
import AlertMessage from "../../components/AlertMessage";

const GaragesPage = () => {
    const navigate = useNavigate();
    const {
        garages,
        loading,
        error,
        pagination,
        deleteConfirmGarage,
        searchQuery,
        alert,
        handleSearch,
        handlePageChange,
        handleLimitChange,
        handleDeleteConfirm,
        handleDeleteCancel,
        handleDeleteGarage,
        clearAlert
    } = useGaragesData();

    const handleEdit = (garageId) => {
        navigate(`/garages/edit/${garageId}`);
    };

    const handleAdd = () => {
        navigate('/garages/add');
    };

    return (
        <div className="flex flex-col h-full">
    

            <div className="p-4 pb-0 flex-shrink-0">
                <PageHeader
                    title="Garage Management"
                    breadcrumbs={[
                        { label: "Dashboard", path: "/dashboard" },
                        { label: "Garages", path: "/garages" },
                    ]}
                />
            </div>

            {alert && (
                <div className="px-4 pb-2">
                    <AlertMessage
                        type={alert.type}
                        message={alert.message}
                        onDismiss={clearAlert}
                    />
                </div>
            )}

            {error && (
                <div className="px-4 pb-2">
                    <AlertMessage
                        type="error"
                        message={error}
                    />
                </div>
            )}

            <div className="flex-1">
                <GaragesTable
                    garages={garages}
                    loading={loading}
                    searchQuery={searchQuery}
                    onEdit={handleEdit}
                    onDelete={handleDeleteGarage}
                    onAddGarage={handleAdd}
                    onSearch={handleSearch}
                />
            </div>

            <div className="flex-shrink-0 px-4 pb-4">
                <PaginationControls
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalItems}
                    itemsPerPage={pagination.itemsPerPage}
                    onPageChange={handlePageChange}
                    onLimitChange={handleLimitChange}
                />
            </div>

            {deleteConfirmGarage && (
                <DeleteConfirmDialog
                    isOpen={true}
                    title="Delete Garage"
                    message={`Are you sure you want to delete "${deleteConfirmGarage.name}"? This action cannot be undone.`}
                    onConfirm={handleDeleteConfirm}
                    onCancel={handleDeleteCancel}
                    loading={loading}
                />
            )}
        </div>
    );
};

export default GaragesPage;