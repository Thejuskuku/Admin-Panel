import React, { useState, useContext } from 'react';
import { AdminDashboardContext } from '../App.jsx';
import {
  FileText, Plus, Edit, Trash, Download, Send, CheckCircle, Eye, XCircle, Clock
} from 'lucide-react';

// Helper to generate unique IDs
const generateUniqueId = () => `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
const formatCurrency = (value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const InvoiceManagement = () => {
  const { simulateApiCall } = useContext(AdminDashboardContext);

  // Mock invoice data state
  const [invoices, setInvoices] = useState([
    {
      id: generateUniqueId(),
      bookingId: 'BKG-001',
      groupId: 'GRP-001',
      customerName: 'Alice Wonderland',
      amount: 1250.00,
      dateGenerated: '2024-06-15T10:00:00Z',
      status: 'Paid',
      details: 'Tickets for 25 people, 3 add-ons, 1 merchandise item.'
    },
    {
      id: generateUniqueId(),
      bookingId: 'BKG-002',
      groupId: 'GRP-002',
      customerName: 'Bob Johnson',
      amount: 750.50,
      dateGenerated: '2024-06-20T14:30:00Z',
      status: 'Pending',
      details: 'Tickets for 15 people, no add-ons.'
    },
    {
      id: generateUniqueId(),
      bookingId: 'BKG-003',
      groupId: null,
      customerName: 'Charlie Brown',
      amount: 300.00,
      dateGenerated: '2024-06-25T09:15:00Z',
      status: 'Overdue',
      details: 'Special event booking for 5 people.'
    },
    {
      id: generateUniqueId(),
      bookingId: 'BKG-004',
      groupId: 'GRP-003',
      customerName: 'Diana Prince',
      amount: 2000.00,
      dateGenerated: '2024-06-28T11:45:00Z',
      status: 'Cancelled',
      details: 'Bulk booking for 40 people, cancelled due to unforeseen circumstances.'
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false); // For Add/Edit Invoice Modal
  const [editingInvoice, setEditingInvoice] = useState(null); // Stores the invoice being edited
  const [newInvoiceData, setNewInvoiceData] = useState({ // State for new/edited invoice data
    bookingId: '',
    groupId: '',
    customerName: '',
    amount: 0,
    dateGenerated: new Date().toISOString().split('T')[0], // Default to today
    status: 'Pending',
    details: ''
  });
  const [message, setMessage] = useState(''); // Feedback message for user
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // Filter and Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // View Invoice Details Modal states
  const [isViewInvoiceModalOpen, setIsViewInvoiceModalOpen] = useState(false);
  const [selectedInvoiceForView, setSelectedInvoiceForView] = useState(null);

  // Function to open the Add/Edit Invoice Modal
  const openModal = (invoice = null) => {
    setEditingInvoice(invoice);
    setNewInvoiceData(invoice ? { ...invoice, dateGenerated: invoice.dateGenerated.split('T')[0] } : {
      bookingId: '',
      groupId: '',
      customerName: '',
      amount: 0,
      dateGenerated: new Date().toISOString().split('T')[0],
      status: 'Pending',
      details: ''
    });
    setIsModalOpen(true);
    setMessage(''); // Clear previous messages
  };

  // Function to close the Add/Edit Invoice Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingInvoice(null);
    setNewInvoiceData({
      bookingId: '',
      groupId: '',
      customerName: '',
      amount: 0,
      dateGenerated: '',
      status: 'Pending',
      details: ''
    });
  };

  // Handle form submission for adding or updating an invoice
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages

    // Basic validation
    if (!newInvoiceData.customerName || newInvoiceData.amount <= 0) {
      setMessage('Customer Name and a positive Amount are required.');
      setMessageType('error');
      return;
    }

    await simulateApiCall(() => {
      if (editingInvoice) {
        // Update existing invoice
        setInvoices(prevInvoices => prevInvoices.map(inv =>
          inv.id === editingInvoice.id ? { ...newInvoiceData, id: inv.id, dateGenerated: new Date(newInvoiceData.dateGenerated).toISOString() } : inv
        ));
        setMessage('Invoice updated successfully!');
      } else {
        // Add new invoice
        setInvoices(prevInvoices => [...prevInvoices, {
          ...newInvoiceData,
          id: generateUniqueId(),
          dateGenerated: new Date(newInvoiceData.dateGenerated).toISOString()
        }]);
        setMessage('Invoice generated successfully!');
      }
      setMessageType('success');
    });
    closeModal();
  };

  // Handle deleting an invoice
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this invoice? This cannot be undone.')) {
      await simulateApiCall(() => {
        setInvoices(prevInvoices => prevInvoices.filter(invoice => invoice.id !== id));
        setMessage('Invoice deleted successfully!');
        setMessageType('success');
      });
    }
  };

  // Handle marking an invoice as paid
  const handleMarkAsPaid = async (id) => {
    await simulateApiCall(() => {
      setInvoices(prevInvoices => prevInvoices.map(invoice =>
        invoice.id === id ? { ...invoice, status: 'Paid' } : invoice
      ));
      setMessage('Invoice marked as Paid!');
      setMessageType('success');
    });
  };

  // Handle downloading an invoice (simulated)
  const handleDownload = (invoice) => {
    const invoiceDetails = `
Invoice ID: ${invoice.id}
Booking ID: ${invoice.bookingId || 'N/A'}
Group ID: ${invoice.groupId || 'N/A'}
Customer Name: ${invoice.customerName}
Amount: ${formatCurrency(invoice.amount)}
Date Generated: ${new Date(invoice.dateGenerated).toLocaleString()}
Status: ${invoice.status}
Details: ${invoice.details || 'N/A'}
    `;
    alert(`Simulating PDF download for Invoice ${invoice.id}:\n\n${invoiceDetails}`);
    // In a real application, you would generate and download a PDF.
  };

  // Handle resending an invoice (simulated)
  const handleResend = async (invoice) => {
    await simulateApiCall(() => {
      alert(`Simulating resending Invoice ${invoice.id} to ${invoice.customerName}'s email.`);
      setMessage(`Invoice ${invoice.id} resent successfully!`);
      setMessageType('success');
    });
  };

  // Filter and search logic for the invoice list
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = searchTerm === '' ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invoice.bookingId && invoice.bookingId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (invoice.groupId && invoice.groupId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Function to open the View Invoice Details Modal
  const openViewInvoiceModal = (invoice) => {
    setSelectedInvoiceForView(invoice);
    setIsViewInvoiceModalOpen(true);
  };

  // Function to close the View Invoice Details Modal
  const closeViewInvoiceModal = () => {
    setIsViewInvoiceModalOpen(false);
    setSelectedInvoiceForView(null);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen md:pb-24 container mx-auto max-w-7xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
        <FileText className="h-8 w-8 mr-3 text-indigo-600" /> Invoice Management
      </h2>

      {message && (
        <div className={`p-4 mb-6 rounded-lg flex items-center ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {messageType === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <XCircle className="h-5 w-5 mr-2" />}
          {message}
        </div>
      )}

      {/* Invoice List/Table Section */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Invoice List</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Search (ID, Customer, Booking/Group ID)</label>
            <input
              type="text"
              className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Status Filter</label>
            <select
              className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => openModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            >
              <Plus className="h-5 w-5 mr-2" /> Generate New Invoice
            </button>
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Invoice ID</th>
                <th className="py-3 px-6 text-left">Booking/Group ID</th>
                <th className="py-3 px-6 text-left">Customer Name</th>
                <th className="py-3 px-6 text-left">Amount</th>
                <th className="py-3 px-6 text-left">Date Generated</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{invoice.id.substring(0, 8)}...</td>
                    <td className="py-3 px-6 text-left">
                      {invoice.bookingId || invoice.groupId || 'N/A'}
                    </td>
                    <td className="py-3 px-6 text-left">{invoice.customerName}</td>
                    <td className="py-3 px-6 text-left">{formatCurrency(invoice.amount)}</td>
                    <td className="py-3 px-6 text-left">{new Date(invoice.dateGenerated).toLocaleDateString()}</td>
                    <td className="py-3 px-6 text-left">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                          invoice.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          invoice.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center space-x-2">
                        <button onClick={() => openViewInvoiceModal(invoice)} className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center transition-colors duration-200" title="View Invoice">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDownload(invoice)} className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 flex items-center justify-center transition-colors duration-200" title="Download PDF">
                          <Download className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleResend(invoice)} className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 flex items-center justify-center transition-colors duration-200" title="Resend Invoice">
                          <Send className="h-4 w-4" />
                        </button>
                        {invoice.status !== 'Paid' && (
                          <button onClick={() => handleMarkAsPaid(invoice.id)} className="w-8 h-8 rounded-full bg-green-100 text-green-600 hover:bg-green-200 flex items-center justify-center transition-colors duration-200" title="Mark as Paid">
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button onClick={() => handleDelete(invoice.id)} className="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition-colors duration-200" title="Delete Invoice">
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-4 text-center text-gray-500">No invoices found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate New Invoice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full relative animate-scale-in transform transition-all duration-300 ease-out border border-gray-200">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 hover:text-gray-900 flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              aria-label="Close modal"
            >
              <XCircle className="h-6 w-6" />
            </button>
            <h3 className="text-2xl font-bold mb-6 text-gray-800">{editingInvoice ? 'Edit Invoice' : 'Generate New Invoice'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5 mb-6">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Customer Name</label>
                  <input
                    type="text"
                    value={newInvoiceData.customerName}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, customerName: e.target.value })}
                    className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newInvoiceData.amount}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, amount: parseFloat(e.target.value) || 0 })}
                    className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Booking ID (Optional)</label>
                  <input
                    type="text"
                    value={newInvoiceData.bookingId}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, bookingId: e.target.value })}
                    className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Group ID (Optional)</label>
                  <input
                    type="text"
                    value={newInvoiceData.groupId}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, groupId: e.target.value })}
                    className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Date Generated</label>
                  <input
                    type="date"
                    value={newInvoiceData.dateGenerated}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, dateGenerated: e.target.value })}
                    className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Status</label>
                  <select
                    value={newInvoiceData.status}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, status: e.target.value })}
                    className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Details (Optional)</label>
                  <textarea
                    value={newInvoiceData.details}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, details: e.target.value })}
                    rows="3"
                    className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-5 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-md hover:shadow-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg flex items-center transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <Plus className="h-5 w-5 mr-2" /> {editingInvoice ? 'Update Invoice' : 'Generate Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Invoice Details Modal */}
      {isViewInvoiceModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full relative animate-scale-in transform transition-all duration-300 ease-out border border-gray-200">
                <button
                    onClick={closeViewInvoiceModal}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 hover:text-gray-900 flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    aria-label="Close modal"
                >
                    <XCircle className="h-6 w-6" />
                </button>
                <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                    <FileText className="h-7 w-7 text-indigo-600 mr-2" /> Invoice Details: {selectedInvoiceForView.id}
                </h3>
                <div className="space-y-4 text-gray-700">
                    <p><span className="font-semibold">Booking ID:</span> {selectedInvoiceForView.bookingId || 'N/A'}</p>
                    <p><span className="font-semibold">Group ID:</span> {selectedInvoiceForView.groupId || 'N/A'}</p>
                    <p><span className="font-semibold">Customer Name:</span> {selectedInvoiceForView.customerName}</p>
                    <p><span className="font-semibold">Amount:</span> {formatCurrency(selectedInvoiceForView.amount)}</p>
                    <p><span className="font-semibold">Date Generated:</span> {new Date(selectedInvoiceForView.dateGenerated).toLocaleString()}</p>
                    <p><span className="font-semibold">Status:</span>
                        <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${
                            selectedInvoiceForView.status === 'Paid' ? 'bg-green-100 text-green-800' :
                            selectedInvoiceForView.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            selectedInvoiceForView.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                            {selectedInvoiceForView.status}
                        </span>
                    </p>
                    <p><span className="font-semibold">Details:</span> {selectedInvoiceForView.details || 'N/A'}</p>
                </div>
                <div className="flex justify-end mt-8">
                    <button
                        onClick={closeViewInvoiceModal}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-5 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Automated Invoice Triggers Section */}
      <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-700 mb-3 flex items-center">
          <Clock className="h-6 w-6 mr-2 text-gray-600" /> Automated Invoice Triggers
        </h3>
        <p className="text-gray-600 text-base">
          Configure rules for automatic invoice generation based on successful booking confirmations,
          payment milestones, or specific event types. This ensures timely and consistent billing without
          manual intervention. (Configuration options for this feature would be managed in a dedicated
          "Settings" or "Automation" panel, not directly within this invoice management view.)
        </p>
      </div>
    </div>
  );
};

export default InvoiceManagement;
