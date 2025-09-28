import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';
import PageHeader from '../../components/PageHeader';
import SearchBar from '../../components/SearchBar';
import ServicesTable from './ServicesTable';
import PaginationControls from '../../components/PaginationControls';
import DeleteConfirmDialog from '../../components/DeleteConfirmDialog';
import AlertMessage from '../../components/AlertMessage';
import Button from '../../components/Button';
import { useServicesData } from '../../hooks/useServicesData';
import { RouteNames } from '../../routes/RouteNames';

const ServicesPage = () => {
  const navigate = useNavigate();
  const [deleteDialog, setDeleteDialog] = useState({ open: false, service: null });
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

  const {
    services,
    loading,
    error,
    pagination,
    searchQuery,
    handlePageChange,
    handleSearch,
    handleDelete,
    setError
  } = useServicesData();

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 5000);
  };

  const handleAddService = () => {
    navigate(RouteNames.SERVICES_ADD);
  };

  const handleEditService = (service) => {
    navigate(RouteNames.SERVICES_EDIT.replace(':id', service._id));
  };

  const handleDeleteClick = (service) => {
    setDeleteDialog({ open: true, service });
  };

  const handleDeleteConfirm = async () => {
    const { service } = deleteDialog;
    if (!service) return;

    setError(null);
    const result = await handleDelete(service._id);

    if (result.success) {
      showAlert('Service deleted successfully', 'success');
    } else {
      showAlert(result.error || 'Failed to delete service', 'error');
    }

    setDeleteDialog({ open: false, service: null });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, service: null });
  };

  const handleAlertClose = () => {
    setAlert({ show: false, message: '', type: 'success' });
    setError(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Services"
        subtitle="Manage your garage services and offerings"
      />

      {/* Alert Messages */}
      {(alert.show || error) && (
        <AlertMessage
          type={error ? 'error' : alert.type}
          message={error || alert.message}
          onClose={handleAlertClose}
        />
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <SearchBar
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search services..."
          className="w-full sm:w-auto"
        />

        <Button
          onClick={handleAddService}
          className="w-full sm:w-auto"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Service
        </Button>
      </div>

      {/* Services Table */}
      <ServicesTable
        services={services}
        loading={loading}
        onEdit={handleEditService}
        onDelete={handleDeleteClick}
      />

      {/* Pagination */}
      {!loading && pagination.pages > 1 && (
        <PaginationControls
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialog.open}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={deleteDialog.service?.name || 'service'}
        itemType="service"
      />
    </div>
  );
};

export default ServicesPage;