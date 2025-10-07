import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import FormField from "../../components/forms/FormField";
import Button from "../../components/Button";
import AlertMessage from "../../components/AlertMessage";
import { useStaffForm } from "../../hooks/useStaffForm";
import GaragesMultiSelector from "../../components/selectors/GaragesMultiSelector";
import { getGarageById } from "../../api/garagesService";

const AddEditStaffPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [garageSelectorOpen, setGarageSelectorOpen] = useState(false);
  const [selectedGarageDetails, setSelectedGarageDetails] = useState(null);
  const [garageLoading, setGarageLoading] = useState(false);

  const { formData, errors, loading, error, alert, handleInputChange, handleFieldBlur, handleSubmit, clearAlert } = useStaffForm(id);

  useEffect(() => {
    // update any derived details if needed in future
  }, [formData]);

  const handleSave = async () => {
    const success = await handleSubmit();
    if (success) {
      navigate('/staff', { state: { message: `Staff ${isEditing ? 'updated' : 'created'} successfully!`, severity: 'success' } });
    }
  };

  const handleCancel = () => {
    navigate('/staff');
  };

  const handleGarageSelect = (selectedIds) => {
    handleInputChange('garage', selectedIds[0] || null);
  };

  // Fetch selected garage details to show friendly info instead of ID
  useEffect(() => {
    const loadGarage = async () => {
      if (!formData.garage) {
        setSelectedGarageDetails(null);
        return;
      }

      try {
        setGarageLoading(true);
        const res = await getGarageById(formData.garage);
        // garagesService returns response.data (may contain garage or direct object)
        const garage = res.garage || res;
        setSelectedGarageDetails(garage);
      } catch (err) {
        console.error('Failed to load selected garage:', err);
        setSelectedGarageDetails(null);
      } finally {
        setGarageLoading(false);
      }
    };

    loadGarage();
  }, [formData.garage]);

  if (loading && isEditing) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primaryDeep"></div>
        <span className="ml-4 text-lg font-medium">Loading staff data...</span>
      </div>
    );
  }

  return (
    <div className="p-4 w-full max-w-none">
      <PageHeader
        title={isEditing ? "Edit Staff" : "Add New Staff"}
        breadcrumbs={[{ label: "Dashboard", path: "/dashboard" }, { label: "Staff", path: "/staff" }, { label: isEditing ? "Edit Staff" : "Add New Staff" }]}
        showBackButton
        onBack={handleCancel}
      />

      {error && <AlertMessage type="error" message={error} />}
      {alert && <AlertMessage type={alert.type} message={alert.message} onDismiss={clearAlert} />}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full">
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
            {/* Left column: primary fields */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>

              <FormField label="Name *" name="name" value={formData.name || ""} onChange={(e) => handleInputChange('name', e.target.value)} onBlur={() => handleFieldBlur('name')} placeholder="Enter full name" error={errors?.name} required />

              <FormField label="Email *" name="email" type="email" value={formData.email || ""} onChange={(e) => handleInputChange('email', e.target.value)} onBlur={() => handleFieldBlur('email')} placeholder="Enter email" error={errors?.email} required />

              {!isEditing && (
                <FormField label="Password *" name="password" type="password" value={formData.password || ""} onChange={(e) => handleInputChange('password', e.target.value)} placeholder="Set a password" error={errors?.password} required />
              )}
            </div>

            {/* Right column: secondary fields + actions */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Details</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-900 mb-2">Role</label>
                <select
                  name="role"
                  value={formData.role || "mechanic"}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600 ${errors?.role ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="mechanic">Mechanic</option>
                  <option value="technician">Technician</option>
                  <option value="cleaner">Cleaner</option>
                  <option value="manager">Manager</option>
                  <option value="support">Support</option>
                </select>
                {errors?.role && <p className="mt-1 text-sm text-red-500">{errors.role}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Garage</label>
                <div className="flex items-center gap-3">
                  <Button text="Select Garage" variant="outlined" onClick={() => setGarageSelectorOpen(true)} fullWidth={false} />
                    <div className="text-sm text-gray-700">
                      {garageLoading ? (
                        <span>Loading garage...</span>
                      ) : selectedGarageDetails ? (
                        <span>{selectedGarageDetails.name} — {selectedGarageDetails.city}</span>
                      ) : (
                        <span>{formData.garage ? formData.garage : 'No garage selected'}</span>
                      )}
                    </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-900 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status || 'available'}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600 ${errors?.status ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="inactive">Inactive</option>
                </select>
                {errors?.status && <p className="mt-1 text-sm text-red-500">{errors.status}</p>}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Active</label>
                <div>
                  <label className="inline-flex items-center">
                    <input type="checkbox" checked={!!formData.isActive} onChange={(e) => handleInputChange('isActive', e.target.checked)} />
                    <span className="ml-2 text-sm text-gray-700">Is Active</span>
                  </label>
                </div>
              </div>

              <div className="mt-6 flex gap-3 justify-end">
                <Button text="Cancel" variant="outlined" onClick={handleCancel} disabled={loading} fullWidth={false} />
                <Button text={loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Staff' : 'Create Staff')} variant="contained" onClick={handleSave} disabled={loading} fullWidth={false} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Garage selector modal (reuses existing multi selector if available) */}
      <GaragesMultiSelector isOpen={garageSelectorOpen} onClose={() => setGarageSelectorOpen(false)} onSelect={handleGarageSelect} selectedGarages={formData.garage ? [formData.garage] : []} title="Select Garage" />
    </div>
  );
};

export default AddEditStaffPage;
