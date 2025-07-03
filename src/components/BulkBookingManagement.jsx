import React, { useState, useContext } from 'react';
import { AdminDashboardContext } from '../App.jsx'; // Ensure this path is correct relative to your App.jsx
import ConfirmationModal from './ConfirmationModal.jsx'; // Ensure this path is correct relative to ConfirmationModal.jsx
import {
  Plus, Edit, Trash, Eye, CheckCircle, XCircle, Save, Send, Link, DollarSign, Users, Calendar, FileText, ClipboardList, Building, AlertTriangle
} from 'lucide-react';

// Helper to generate unique IDs
const generateUniqueId = () => `bb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const BulkBookingManagement = () => {
  const { simulateApiCall } = useContext(AdminDashboardContext);

  // Mock data for bulk bookings
  const [bulkBookings, setBulkBookings] = useState([
    {
      id: generateUniqueId(),
      groupRepresentative: { name: 'Alice Wonderland', email: 'alice@example.com', phone: '555-123-4567' },
      groupSize: 25,
      preferredDates: '2024-08-15 to 2024-08-17',
      specificRequirements: 'Need wheelchair access for 2, special dietary meals for 3.',
      status: 'Pending Review',
      submissionDate: '2024-07-01T10:30:00Z',
      customPricing: null,
      paymentLink: null,
      specialArrangements: '',
      groupId: null,
      groupLink: null,
      paymentStatus: 'Pending',
      communicationLog: [{ timestamp: '2024-07-01T10:35:00Z', message: 'Initial inquiry received.', sender: 'System' }],
      isSchoolVerified: false,
    },
    {
      id: generateUniqueId(),
      groupRepresentative: { name: 'Bob The Builder', email: 'bob@example.com', phone: '555-987-6543' },
      groupSize: 60,
      preferredDates: '2024-09-01',
      specificRequirements: 'Educational tour for primary school, need guided tour.',
      status: 'Approved',
      submissionDate: '2024-06-20T14:00:00Z',
      customPricing: { type: 'school', rate: 12.50, total: 750.00 },
      paymentLink: 'https://example.com/pay/bob60',
      specialArrangements: 'Guided tour booked for 10 AM.',
      groupId: 'GRP_001',
      groupLink: 'https://example.com/group/GRP_001',
      paymentStatus: 'Completed',
      communicationLog: [
        { timestamp: '2024-06-20T14:05:00Z', message: 'Inquiry received.', sender: 'System' },
        { timestamp: '2024-06-21T09:00:00Z', message: 'Quote sent for $750.', sender: 'Admin' },
        { timestamp: '2024-06-25T11:00:00Z', message: 'Payment completed.', sender: 'System' },
      ],
      isSchoolVerified: true,
    },
    {
      id: generateUniqueId(),
      groupRepresentative: { name: 'Charlie Chaplin', email: 'charlie@example.com', phone: '555-111-2222' },
      groupSize: 30,
      preferredDates: '2024-10-05',
      specificRequirements: 'Corporate team building event, need private room for lunch.',
      status: 'Rejected',
      submissionDate: '2024-06-10T09:00:00Z',
      customPricing: null,
      paymentLink: null,
      specialArrangements: '',
      groupId: null,
      groupLink: null,
      paymentStatus: 'Pending',
      communicationLog: [
        { timestamp: '2024-06-10T09:05:00Z', message: 'Inquiry received.', sender: 'System' },
        { timestamp: '2024-06-11T10:00:00Z', message: 'Capacity not available for requested date.', sender: 'Admin' },
      ],
      isSchoolVerified: false,
    },
  ]);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // State for editing inquiry details in the modal
  const [editableInquiry, setEditableInquiry] = useState(null);

  // Confirmation Modal State
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalMessage, setConfirmModalMessage] = useState('');
  const [confirmModalAction, setConfirmModalAction] = useState(null);
  const [confirmModalType, setConfirmModalType] = useState('warning');

  const openConfirmModal = (msg, action, type = 'warning') => {
    setConfirmModalMessage(msg);
    setConfirmModalAction(() => action); // Use a function to set the action
    setConfirmModalType(type);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setConfirmModalAction(null);
  };


  const openDetailsModal = (inquiry) => {
    setSelectedInquiry(inquiry);
    setEditableInquiry({ ...inquiry }); // Create a mutable copy for editing
    setIsDetailsModalOpen(true);
    setMessage('');
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedInquiry(null);
    setEditableInquiry(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'isSchoolVerified') {
      setEditableInquiry(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'customPricingRate' || name === 'customPricingTotal') {
      setEditableInquiry(prev => ({
        ...prev,
        customPricing: {
          ...prev.customPricing,
          [name === 'customPricingRate' ? 'rate' : 'total']: parseFloat(value) || 0
        }
      }));
    } else if (name === 'customPricingType') {
      setEditableInquiry(prev => ({
        ...prev,
        customPricing: {
          ...prev.customPricing,
          type: value,
          rate: 0, // Reset rate when type changes
          total: 0 // Reset total when type changes
        }
      }));
    } else {
      setEditableInquiry(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdateInquiry = async () => {
    setMessage('');
    if (!editableInquiry.groupSize || !editableInquiry.preferredDates || !editableInquiry.status) {
      setMessage('Group Size, Preferred Dates, and Status are required.');
      setMessageType('error');
      return;
    }

    try {
      await simulateApiCall(() => {
        setBulkBookings(prevBookings => prevBookings.map(booking =>
          booking.id === editableInquiry.id ? editableInquiry : booking
        ));
        setMessage('Bulk booking updated successfully!');
        setMessageType('success');
      });
      closeDetailsModal();
    } catch (error) {
      console.error("Error updating bulk booking:", error);
      setMessage('Failed to update bulk booking due to an internal error.');
      setMessageType('error');
    }
  };

  const handleGenerateGroupId = async () => {
    setMessage('');
    if (selectedInquiry.status !== 'Approved') {
      setMessage('Only approved bookings can generate Group ID and Link.');
      setMessageType('error');
      return;
    }

    openConfirmModal('Are you sure you want to generate a Group ID and Link for this booking?', async () => {
      await simulateApiCall(() => {
        const newGroupId = `GRP_${Date.now()}`;
        const newGroupLink = `https://example.com/group/${newGroupId}`;
        setBulkBookings(prevBookings => prevBookings.map(booking =>
          booking.id === selectedInquiry.id
            ? { ...booking, groupId: newGroupId, groupLink: newGroupLink }
            : booking
        ));
        setMessage('Group ID and Link generated successfully!');
        setMessageType('success');
        closeConfirmModal();
      });
    });
  };

  const handlePaymentProcessing = async (status) => {
    setMessage('');
    openConfirmModal(`Are you sure you want to set payment status to "${status}"?`, async () => {
      await simulateApiCall(() => {
        setBulkBookings(prevBookings => prevBookings.map(booking =>
          booking.id === selectedInquiry.id
            ? { ...booking, paymentStatus: status }
            : booking
        ));
        setMessage(`Payment status updated to ${status}!`);
        setMessageType('success');
        closeConfirmModal();
      });
    });
  };

  const handleAddCommunicationLog = async () => {
    setMessage('');
    // Using a custom modal or input for prompt, as window.prompt is not allowed
    // For demonstration, we'll simulate a prompt or use a simple input in the future.
    // For now, let's assume a message is provided.
    const logMessage = prompt("Enter message for communication log:"); // Keep this for now as per previous instruction to use prompt
    if (logMessage) {
      await simulateApiCall(() => {
        const newLogEntry = {
          timestamp: new Date().toISOString(),
          message: logMessage,
          sender: 'Admin'
        };
        setBulkBookings(prevBookings => prevBookings.map(booking =>
          booking.id === selectedInquiry.id
            ? { ...booking, communicationLog: [...booking.communicationLog, newLogEntry] }
            : booking
        ));
        setMessage('Communication log updated.');
        setMessageType('success');
      });
    } else {
      setMessage('No message entered for communication log.');
      setMessageType('error');
    }
  };

  const handleDeleteInquiry = async (id) => {
    openConfirmModal('Are you sure you want to delete this bulk booking inquiry? This cannot be undone.', async () => {
      await simulateApiCall(() => {
        setBulkBookings(prevBookings => prevBookings.filter(booking => booking.id !== id));
        setMessage('Bulk booking inquiry deleted successfully!');
        setMessageType('success');
        closeConfirmModal();
      });
    }, 'danger');
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen md:pb-24 container mx-auto max-w-7xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Bulk Booking Management</h2>

      {message && (
        <div className={`p-4 mb-6 rounded-lg flex items-center ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {messageType === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <XCircle className="h-5 w-5 mr-2" />}
          {message}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <ClipboardList className="h-6 w-6 mr-2 text-indigo-600" /> Bulk Booking Inquiries
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Request ID</th>
                <th className="py-3 px-6 text-left">Group Rep.</th>
                <th className="py-3 px-6 text-left">Size</th>
                <th className="py-3 px-6 text-left">Dates</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Submission Date</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {bulkBookings.length > 0 ? (
                bulkBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{booking.id.substring(0, 8)}...</td>
                    <td className="py-3 px-6 text-left">{booking.groupRepresentative.name}</td>
                    <td className="py-3 px-6 text-left">{booking.groupSize}</td>
                    <td className="py-3 px-6 text-left">{booking.preferredDates}</td>
                    <td className="py-3 px-6 text-left">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${booking.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          booking.status === 'Pending Review' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'Booked' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-left">{new Date(booking.submissionDate).toLocaleDateString()}</td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center space-x-2">
                        <button onClick={() => openDetailsModal(booking)} className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center transition-colors duration-200" title="View Details">
                          <Eye className="h-5 w-5" />
                        </button>
                        <button onClick={() => handleDeleteInquiry(booking.id)} className="w-9 h-9 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition-colors duration-200" title="Delete Inquiry">
                          <Trash className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-4 text-center text-gray-500">No bulk booking inquiries found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isDetailsModalOpen && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-4xl w-full relative animate-scale-in transform transition-all duration-300 ease-out border border-gray-200 overflow-y-auto max-h-[90vh]">
            <button
              onClick={closeDetailsModal}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 hover:text-gray-900 flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              aria-label="Close modal"
            >
              <XCircle className="h-6 w-6" />
            </button>
            <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">Bulk Booking Details - Request ID: {selectedInquiry.id.substring(0, 8)}...</h3>

            <form onSubmit={(e) => { e.preventDefault(); handleUpdateInquiry(); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Group Representative Details */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center"><Users className="h-5 w-5 mr-2 text-purple-600" /> Group Representative</h4>
                  <p className="text-gray-700"><span className="font-medium">Name:</span> {selectedInquiry.groupRepresentative.name}</p>
                  <p className="text-gray-700"><span className="font-medium">Email:</span> {selectedInquiry.groupRepresentative.email}</p>
                  <p className="text-gray-700"><span className="font-medium">Phone:</span> {selectedInquiry.groupRepresentative.phone}</p>
                </div>

                {/* Booking Details */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center"><Calendar className="h-5 w-5 mr-2 text-green-600" /> Booking Details</h4>
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-1">Group Size</label>
                    <input type="number" name="groupSize" value={editableInquiry.groupSize} onChange={handleInputChange} className="shadow-sm appearance-none border border-gray-400 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" min="1" required />
                  </div>
                  <div className="mt-3">
                    <label className="block text-gray-700 text-sm font-semibold mb-1">Preferred Dates</label>
                    <input type="text" name="preferredDates" value={editableInquiry.preferredDates} onChange={handleInputChange} className="shadow-sm appearance-none border border-gray-400 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                  </div>
                  <div className="mt-3">
                    <label className="block text-gray-700 text-sm font-semibold mb-1">Status</label>
                    <select name="status" value={editableInquiry.status} onChange={handleInputChange} className="shadow-sm appearance-none border border-gray-400 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="Pending Review">Pending Review</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Booked">Booked</option>
                    </select>
                  </div>
                </div>

                {/* Requirements & Arrangements */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center"><FileText className="h-5 w-5 mr-2 text-orange-600" /> Requirements & Arrangements</h4>
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-1">Specific Requirements</label>
                    <textarea name="specificRequirements" value={editableInquiry.specificRequirements} onChange={handleInputChange} rows="3" className="shadow-sm appearance-none border border-gray-400 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                  </div>
                  <div className="mt-3">
                    <label className="block text-gray-700 text-sm font-semibold mb-1">Special Arrangements</label>
                    <textarea name="specialArrangements" value={editableInquiry.specialArrangements} onChange={handleInputChange} rows="3" className="shadow-sm appearance-none border border-gray-400 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                  </div>
                </div>

                {/* Pricing & Payment */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center"><DollarSign className="h-5 w-5 mr-2 text-yellow-600" /> Pricing & Payment</h4>
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-1">Custom Pricing Type</label>
                    <select name="customPricingType" value={editableInquiry.customPricing?.type || ''} onChange={handleInputChange} className="shadow-sm appearance-none border border-gray-400 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">None</option>
                      <option value="school">School/College Rate</option>
                      <option value="corporate">Corporate Rate</option>
                      <option value="custom">Custom Amount</option>
                    </select>
                  </div>
                  {(editableInquiry.customPricing?.type === 'school' || editableInquiry.customPricing?.type === 'corporate') && (
                    <div className="mt-3">
                      <label className="block text-gray-700 text-sm font-semibold mb-1">Rate per Person</label>
                      <input type="number" name="customPricingRate" value={editableInquiry.customPricing?.rate || 0} onChange={handleInputChange} className="shadow-sm appearance-none border border-gray-400 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" min="0" step="0.01" />
                    </div>
                  )}
                  {editableInquiry.customPricing?.type === 'custom' && (
                    <div className="mt-3">
                      <label className="block text-gray-700 text-sm font-semibold mb-1">Total Custom Amount</label>
                      <input type="number" name="customPricingTotal" value={editableInquiry.customPricing?.total || 0} onChange={handleInputChange} className="shadow-sm appearance-none border border-gray-400 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" min="0" step="0.01" />
                    </div>
                  )}
                  <div className="mt-3">
                    <label className="block text-gray-700 text-sm font-semibold mb-1">Payment Link</label>
                    <input type="text" name="paymentLink" value={editableInquiry.paymentLink || ''} onChange={handleInputChange} className="shadow-sm appearance-none border border-gray-400 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="mt-3">
                    <label className="block text-gray-700 text-sm font-semibold mb-1">Payment Status</label>
                    <select name="paymentStatus" value={editableInquiry.paymentStatus} onChange={handleInputChange} className="shadow-sm appearance-none border border-gray-400 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="Failed">Failed</option>
                    </select>
                  </div>
                </div>

                {/* Group ID & Link */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center"><Link className="h-5 w-5 mr-2 text-blue-600" /> Group ID & Link</h4>
                  <p className="text-gray-700"><span className="font-medium">Group ID:</span> {selectedInquiry.groupId || 'N/A'}</p>
                  <p className="text-gray-700 break-all"><span className="font-medium">Group Link:</span> {selectedInquiry.groupLink ? <a href={selectedInquiry.groupLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{selectedInquiry.groupLink}</a> : 'N/A'}</p>
                  <button type="button" onClick={handleGenerateGroupId} className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors duration-200 shadow-md">
                    <Send className="h-5 w-5 mr-2" /> Generate Group ID & Link
                  </button>
                </div>

                {/* Communication Log */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center"><FileText className="h-5 w-5 mr-2 text-gray-600" /> Communication Log</h4>
                  <div className="max-h-32 overflow-y-auto border border-gray-300 p-2 rounded-md bg-white text-sm text-gray-800">
                    {selectedInquiry.communicationLog.length > 0 ? (
                      selectedInquiry.communicationLog.map((log, index) => (
                        <p key={index} className="mb-1">
                          <span className="font-medium text-gray-600">[{new Date(log.timestamp).toLocaleString()}] {log.sender}:</span> {log.message}
                        </p>
                      ))
                    ) : (
                      <p className="italic text-gray-500">No communication log entries.</p>
                    )}
                  </div>
                  <button type="button" onClick={handleAddCommunicationLog} className="mt-4 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors duration-200 shadow-md">
                    <Plus className="h-5 w-5 mr-2" /> Add Log Entry
                  </button>
                </div>

                {/* School/Institution Verification */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 md:col-span-2">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center"><Building className="h-5 w-5 mr-2 text-teal-600" /> School/Institution Verification</h4>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isSchoolVerified"
                      name="isSchoolVerified"
                      checked={editableInquiry.isSchoolVerified}
                      onChange={handleInputChange}
                      className="form-checkbox h-5 w-5 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isSchoolVerified" className="ml-2 text-gray-700 text-base font-semibold">Verified School/Institution</label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6 border-t pt-4">
                <button type="button" onClick={closeDetailsModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-5 rounded-lg transition-colors duration-200 shadow-md">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg flex items-center transition-colors duration-200 shadow-md">
                  <Save className="h-5 w-5 mr-2" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        message={confirmModalMessage}
        onConfirm={confirmModalAction}
        onCancel={closeConfirmModal}
        type={confirmModalType}
      />
    </div>
  );
};

export default BulkBookingManagement;
