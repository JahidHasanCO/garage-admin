import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import FormField from '../../components/forms/FormField';
import Button from '../../components/Button';
import AlertMessage from '../../components/AlertMessage';
import { useBookingForm } from '../../hooks/useBookingForm';
import GaragesMultiSelector from '../../components/selectors/GaragesMultiSelector';
import ServicesMultiSelector from '../../components/selectors/ServicesMultiSelector';
import { useStaffsData } from '../../hooks/useStaffsData';

const AddEditBookingPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const { formData, errors, loading, error, alert, handleInputChange, handleSubmit, clearAlert } = useBookingForm(id);
  const { staffs } = useStaffsData();

  const [garageSelectorOpen, setGarageSelectorOpen] = useState(false);
  const [serviceSelectorOpen, setServiceSelectorOpen] = useState(false);

  const handleSave = async () => {
    const success = await handleSubmit();
    if (success) navigate('/bookings', { state: { message: `Booking ${isEditing ? 'updated' : 'created'} successfully!`, severity: 'success' } });
  };

  const handleCancel = () => navigate('/bookings');

  return (
    <div className="p-4 w-full max-w-none">
      <PageHeader title={isEditing ? 'Edit Booking' : 'Add New Booking'} breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Bookings', path: '/bookings' }, { label: isEditing ? 'Edit Booking' : 'Add New Booking' }]} showBackButton onBack={handleCancel} />

      {error && <AlertMessage type="error" message={error} />}
      {alert && <AlertMessage type={alert.type} message={alert.message} onDismiss={clearAlert} />}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full">
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
            <div className="space-y-6">
              <FormField label="Customer ID" name="user" value={formData.user || ''} onChange={(e) => handleInputChange('user', e.target.value)} placeholder="Customer ID" error={errors?.user} />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
                <div className="flex items-center gap-3">
                  <Button text="Select Service" variant="outlined" onClick={() => setServiceSelectorOpen(true)} fullWidth={false} />
                  <div className="text-sm text-gray-700">{formData.servicePackage || formData.singleService || 'No service selected'}</div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Garage</label>
                <div className="flex items-center gap-3">
                  <Button text="Select Garage" variant="outlined" onClick={() => setGarageSelectorOpen(true)} fullWidth={false} />
                  <div className="text-sm text-gray-700">{formData.garage || 'No garage selected'}</div>
                </div>
              </div>

              <FormField label="Vehicle ID" name="vehicle" value={formData.vehicle || ''} onChange={(e) => handleInputChange('vehicle', e.target.value)} placeholder="Vehicle ID" error={errors?.vehicle} />

            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Assign Staff</label>
                <select name="assignedStaff" value={formData.assignedStaff || ''} onChange={(e) => handleInputChange('assignedStaff', e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                  <option value="">Unassigned</option>
                  {staffs && staffs.map(s => (
                    <option key={s._id} value={s._id}>{s.user_id?.name || s._id}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Status</label>
                <select name="status" value={formData.status || 'requested'} onChange={(e) => handleInputChange('status', e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                  <option value="requested">Requested</option>
                  <option value="assigned">Assigned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="paid">Paid</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <FormField label="Amount" name="payment.amount" value={formData.payment?.amount || ''} onChange={(e) => handleInputChange('payment.amount', e.target.value)} placeholder="Amount" error={errors?.payment?.amount} />

              <div className="mt-6 flex gap-3 justify-end">
                <Button text="Cancel" variant="outlined" onClick={handleCancel} disabled={loading} fullWidth={false} />
                <Button text={loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Booking' : 'Create Booking')} variant="contained" onClick={handleSave} disabled={loading} fullWidth={false} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <GaragesMultiSelector isOpen={garageSelectorOpen} onClose={() => setGarageSelectorOpen(false)} onSelect={(ids) => handleInputChange('garage', ids[0] || null)} selectedGarages={formData.garage ? [formData.garage] : []} title="Select Garage" />
      <ServicesMultiSelector isOpen={serviceSelectorOpen} onClose={() => setServiceSelectorOpen(false)} onSelect={(ids) => { handleInputChange('servicePackage', ids[0] || null); handleInputChange('singleService', null); }} selectedServices={formData.servicePackage ? [formData.servicePackage] : []} title="Select Service" />
    </div>
  );
};

export default AddEditBookingPage;
