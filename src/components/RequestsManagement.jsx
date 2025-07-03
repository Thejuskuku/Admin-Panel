import React, { useState, useContext } from 'react';
import { AdminDashboardContext } from '../App.jsx'; // Adjust path as necessary
import { Plus, Edit, Trash, Eye, CheckCircle, XCircle, Save } from 'lucide-react'; // Icons

// Helper function to generate a unique ID
const generateUniqueId = () => {
  return 'req_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
};

const RequestsManagement = () => {
  const { simulateApiCall } = useContext(AdminDashboardContext);

  // --- Request Management States and Logic ---
  const [requests, setRequests] = useState([
    // Mock Data for Requests
    {
      id: 'req_admin_001',
      type: 'Admin Access Request',
      description: 'Request to create a new admin account for Jane Doe.',
      status: 'Pending',
      handledBy: 'Super Admin',
      initiatedBy: 'Admin A',
      submissionDate: '2024-06-25T10:00:00Z',
      lastUpdated: '2024-06-25T10:00:00Z',
      details: {
        newAdminName: 'Jane Doe',
        requestedPermissions: ['Bookings', 'Users'],
        reason: 'New marketing team member.',
      }
    },
    {
      id: 'req_escalated_001',
      type: 'Escalated Issue',
      description: 'Visitor reported critical bug with QR code scanner at Gate 3.',
      status: 'In Progress',
      handledBy: 'Super Admin',
      initiatedBy: 'Customer Support A',
      submissionDate: '2024-06-20T15:30:00Z',
      lastUpdated: '2024-06-21T09:00:00Z',
      details: {
        visitorId: 'visitor_123',
        issueArea: 'Entry Gate',
        severity: 'High',
        currentResolutionSteps: 'IT team dispatched to inspect scanner.',
      }
    },
    {
      id: 'req_visitor_001',
      type: 'Visitor Account Request',
      description: 'Visitor John Smith requests mobile number change from 123 to 456.',
      status: 'Pending',
      handledBy: 'Admin',
      initiatedBy: 'Customer Support B',
      submissionDate: '2024-06-28T11:45:00Z',
      lastUpdated: '2024-06-28T11:45:00Z',
      details: {
        visitorId: 'visitor_456',
        action: 'Mobile Number Change',
        oldValue: '555-123-4567',
        newValue: '555-456-7890',
      }
    },
    {
      id: 'req_booking_001',
      type: 'Booking Rescheduling Request',
      description: 'Visitor requests to reschedule booking BKG_789 from 2024-07-10 to 2024-07-25.',
      status: 'Pending',
      handledBy: 'Admin',
      initiatedBy: 'Visitor C',
      submissionDate: '2024-06-29T09:10:00Z',
      lastUpdated: '2024-06-29T09:10:00Z',
      details: {
        bookingId: 'BKG_789',
        oldDate: '2024-07-10',
        newDate: '2024-07-25',
      }
    },
    {
      id: 'req_group_manual_001',
      type: 'Manual Group Creation Request',
      description: 'Request to manually create a group for "Summer Camp Kids" (50 children).',
      status: 'In Progress',
      handledBy: 'Customer Support',
      initiatedBy: 'Summer Camp Admin',
      submissionDate: '2024-06-20T10:00:00Z',
      lastUpdated: '2024-06-22T14:00:00Z',
      details: {
        groupName: 'Summer Camp Kids',
        groupSize: 50,
        specialNotes: 'Need custom pricing and specific time slots.',
      }
    },
    {
      id: 'req_broadcast_001',
      type: 'Broadcast System Request',
      description: 'Request to broadcast "Park closing in 30 minutes" announcement.',
      status: 'Approved',
      handledBy: 'Admin',
      initiatedBy: 'Operations Staff A',
      submissionDate: '2024-06-27T17:00:00Z',
      lastUpdated: '2024-06-27T17:05:00Z',
      details: {
        message: 'Park closing in 30 minutes. Please proceed to exits.',
        targetAudience: 'All Park Visitors',
        urgency: 'High',
      }
    },
    {
      id: 'req_product_001',
      type: 'New Product/Offer Request',
      description: 'Proposal for "Weekend Family Bundle" ticket type.',
      status: 'Pending',
      handledBy: 'Bookings and Ticketing Manager',
      initiatedBy: 'Marketing',
      submissionDate: '2024-06-15T09:00:00Z',
      lastUpdated: '2024-06-15T09:00:00Z',
      details: {
        productName: 'Weekend Family Bundle',
        targetMarket: 'Families',
        proposedPrice: '$99.99',
      }
    },
    {
      id: 'req_pricing_001',
      type: 'Pricing Adjustment Request',
      description: 'Adjust adult ticket price from $30 to $32.',
      status: 'Pending',
      handledBy: 'Admin',
      initiatedBy: 'Finance',
      submissionDate: '2024-06-26T14:00:00Z',
      lastUpdated: '2024-06-26T14:00:00Z',
      details: {
        item: 'Adult Ticket',
        oldPrice: 30.00,
        newPrice: 32.00,
        reason: 'Inflation adjustment.',
      }
    },
    {
      id: 'req_capacity_001',
      type: 'Capacity Change Request',
      description: 'Urgent: Reduce capacity for "Roller Coaster" for next 2 hours due to technical issue.',
      status: 'Resolved',
      handledBy: 'Bookings and Ticketing Manager',
      initiatedBy: 'Operations Manager',
      submissionDate: '2024-07-01T11:00:00Z',
      lastUpdated: '2024-07-01T11:15:00Z',
      details: {
        attraction: 'Roller Coaster',
        adjustment: 'Reduce by 20%',
        duration: '2 hours',
      }
    },
    {
      id: 'req_partner_001',
      type: 'Partner Integration Request',
      description: 'Inquiry from "TravelCo" for discount code integration.',
      status: 'Pending',
      handledBy: 'Bookings and Ticketing Manager',
      initiatedBy: 'TravelCo',
      submissionDate: '2024-06-20T16:00:00Z',
      lastUpdated: '2024-06-20T16:00:00Z',
      details: {
        partnerName: 'TravelCo',
        integrationType: 'Discount Code',
        contact: 'partner@travelco.com',
      }
    },
    {
      id: 'req_bulk_inquiry_001',
      type: 'Bulk Booking Inquiry',
      description: 'Large group booking inquiry for "City Tour Guides" (100 people).',
      status: 'Pending',
      handledBy: 'Customer Support',
      initiatedBy: 'City Tour Guides',
      submissionDate: '2024-06-25T09:00:00Z',
      lastUpdated: '2024-06-25T09:00:00Z',
      details: {
        groupName: 'City Tour Guides',
        groupSize: 100,
        preferredDates: '2024-09-01 to 2024-09-03',
        requirements: 'Need private bus parking.',
      }
    },
    {
      id: 'req_group_management_001',
      type: 'Group Management Request',
      description: 'Group GRP_ABC123: Add 2 new companions.',
      status: 'Resolved',
      handledBy: 'Customer Support',
      initiatedBy: 'John Doe (GRP_ABC123)',
      submissionDate: '2024-06-28T15:00:00Z',
      lastUpdated: '2024-06-28T15:30:00Z',
      details: {
        groupId: 'grp_abc123',
        action: 'Add Companions',
        quantity: 2,
      }
    },
    {
      id: 'req_feedback_001',
      type: 'Feedback & Complaint Resolution',
      description: 'Complaint about long queue times at main entrance.',
      status: 'In Progress',
      handledBy: 'Customer Support',
      initiatedBy: 'Visitor D',
      submissionDate: '2024-06-30T10:00:00Z',
      lastUpdated: '2024-07-01T09:00:00Z',
      details: {
        feedbackType: 'Complaint',
        area: 'Entrance',
        details: 'Waited 45 minutes to enter.',
      }
    },
    {
      id: 'req_entry_exit_001',
      type: 'Entry/Exit Assistance',
      description: 'Visitor needs help with malfunctioning QR code at Gate 1.',
      status: 'Resolved',
      handledBy: 'Counter Staff',
      initiatedBy: 'Counter Staff A',
      submissionDate: '2024-07-01T09:30:00Z',
      lastUpdated: '2024-07-01T09:35:00Z',
      details: {
        gate: 'Gate 1',
        issue: 'QR code not scanning.',
      }
    },
    {
      id: 'req_gamification_001',
      type: 'Gamification Adjustment Request',
      description: 'Reset XP for visitor_789 due to system glitch.',
      status: 'Pending',
      handledBy: 'Admin',
      initiatedBy: 'Admin B',
      submissionDate: '2024-07-01T14:00:00Z',
      lastUpdated: '2024-07-01T14:00:00Z',
      details: {
        visitorId: 'visitor_789',
        action: 'Reset XP',
        reason: 'Technical glitch caused incorrect XP gain.',
      }
    },
    {
      id: 'req_lobby_001',
      type: 'Lobby System Intervention Request',
      description: 'Manually end stalled public rally "Eco Warriors".',
      status: 'Pending',
      handledBy: 'Admin',
      initiatedBy: 'On-site Staff C',
      submissionDate: '2024-07-01T16:00:00Z',
      lastUpdated: '2024-07-01T16:00:00Z',
      details: {
        rallyName: 'Eco Warriors',
        action: 'End Rally',
        reason: 'Stalled due to bug.',
      }
    },
    {
      id: 'req_exhibit_001',
      type: 'Exhibit Configuration Request',
      description: 'Temporarily disable visit logging for "Dino Dig" exhibit (maintenance).',
      status: 'Pending',
      handledBy: 'Admin',
      initiatedBy: 'Operations Manager B',
      submissionDate: '2024-07-02T09:00:00Z',
      lastUpdated: '2024-07-02T09:00:00Z',
      details: {
        exhibitName: 'Dino Dig',
        action: 'Disable Visit Logging',
        duration: 'Until 2024-07-05',
      }
    },
    {
      id: 'req_report_001',
      type: 'Custom Report Generation Request',
      description: 'Report: Visitor demographics vs. add-on purchases (Q2 2024).',
      status: 'Pending',
      handledBy: 'Super Admin',
      initiatedBy: 'Marketing',
      submissionDate: '2024-07-02T10:00:00Z',
      lastUpdated: '2024-07-02T10:00:00Z',
      details: {
        reportType: 'Demographics & Add-ons',
        period: 'Q2 2024',
        requestedBy: 'Marketing Department',
      }
    },
    {
      id: 'req_financial_001',
      type: 'Financial Reconciliation Request',
      description: 'Investigate discrepancy in kiosk KSK_005 revenue for 2024-06-15.',
      status: 'In Progress',
      handledBy: 'Finance',
      initiatedBy: 'Finance',
      submissionDate: '2024-07-01T10:00:00Z',
      lastUpdated: '2024-07-01T11:00:00Z',
      details: {
        discrepancyArea: 'Kiosk Revenue',
        kioskId: 'KSK_005',
        date: '2024-06-15',
      }
    },
    {
      id: 'req_data_correction_001',
      type: 'Data Correction Request',
      description: 'Correct booking BKG_101 (manual entry error: wrong date).',
      status: 'Pending',
      handledBy: 'Admin',
      initiatedBy: 'Customer Support D',
      submissionDate: '2024-07-02T11:00:00Z',
      lastUpdated: '2024-07-02T11:00:00Z',
      details: {
        bookingId: 'BKG_101',
        correctionType: 'Date Correction',
        oldValue: '2024-07-10',
        newValue: '2024-07-12',
      }
    },
    {
      id: 'req_info_001',
      type: 'Information Requests',
      description: 'Query: Park opening hours on public holidays.',
      status: 'Resolved',
      handledBy: 'Counter Staff',
      initiatedBy: 'Visitor E',
      submissionDate: '2024-06-29T08:00:00Z',
      lastUpdated: '2024-06-29T08:05:00Z',
      details: {
        query: 'Public holiday hours',
        answer: '9 AM to 6 PM on all public holidays.',
      }
    },
    {
      id: 'req_3rd_party_001',
      type: '3rd Party Performance Report Request',
      description: 'Report for "Partner X" on ticket sales (Q2 2024).',
      status: 'Pending',
      handledBy: 'Bookings and Ticketing Manager',
      initiatedBy: 'Partner X',
      submissionDate: '2024-07-01T15:00:00Z',
      lastUpdated: '2024-07-01T15:00:00Z',
      details: {
        partnerName: 'Partner X',
        reportPeriod: 'Q2 2024',
        dataRequested: 'Ticket Sales, Revenue',
      }
    },
    {
      id: 'req_system_config_001',
      type: 'System Configuration Change Request',
      description: 'Toggle online booking OFF for scheduled maintenance (2024-07-15 00:00-04:00).',
      status: 'Pending',
      handledBy: 'Super Admin',
      initiatedBy: 'IT Support',
      submissionDate: '2024-07-01T16:00:00Z',
      lastUpdated: '2024-07-01T16:00:00Z',
      details: {
        feature: 'Online Booking',
        action: 'Toggle Off',
        reason: 'Scheduled maintenance.',
        scheduledTime: '2024-07-15 00:00-04:00',
      }
    },
    {
      id: 'req_hardware_001',
      type: 'Hardware/Peripheral Assistance Request',
      description: 'Request replacement for malfunctioning payment terminal at Counter 2.',
      status: 'In Progress',
      handledBy: 'IT Support',
      initiatedBy: 'Counter Staff F',
      submissionDate: '2024-07-02T09:30:00Z',
      lastUpdated: '2024-07-02T10:00:00Z',
      details: {
        device: 'Payment Terminal',
        location: 'Counter 2',
        issue: 'Not processing payments.',
      }
    },
    {
      id: 'req_ugc_001',
      type: 'UGC Moderation Request',
      description: 'Review pending user-generated content for approval.',
      status: 'Pending',
      handledBy: 'Admin',
      initiatedBy: 'System',
      submissionDate: '2024-07-02T10:30:00Z',
      lastUpdated: '2024-07-02T10:30:00Z',
      details: {
        contentType: 'User Review',
        contentId: 'ugc_456',
        action: 'Review for Approval',
      }
    },
    {
      id: 'req_action_log_001',
      type: 'Action Logging and Notifications',
      description: 'System automatically logged Admin G\'s approval of req_admin_001.',
      status: 'Completed',
      handledBy: 'System', // Handled by system for logging
      initiatedBy: 'System',
      submissionDate: '2024-06-25T10:05:00Z',
      lastUpdated: '2024-06-25T10:05:00Z',
      details: {
        action: 'Request Approval',
        requestId: 'req_admin_001',
        actor: 'Admin G',
      }
    },
  ]);

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [editableRequest, setEditableRequest] = useState(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [requestMessageType, setRequestMessageType] = useState('');

  // Request Filters
  const [requestSearchTerm, setRequestSearchTerm] = useState('');
  const [requestStatusFilter, setRequestStatusFilter] = useState('All');
  const [requestTypeFilter, setRequestTypeFilter] = useState('All');
  const [requestHandledByFilter, setRequestHandledByFilter] = useState('All');

  const allRequestTypes = [
    'All',
    'Admin Access Request',
    'Escalated Issue',
    'Visitor Account Request',
    'Booking Rescheduling Request',
    'Manual Group Creation Request',
    'Broadcast System Request',
    'New Product/Offer Request',
    'Pricing Adjustment Request',
    'Capacity Change Request',
    'Partner Integration Request',
    'Bulk Booking Inquiry',
    'Group Management Request',
    'Feedback & Complaint Resolution',
    'Entry/Exit Assistance',
    'Gamification Adjustment Request',
    'Lobby System Intervention Request',
    'Exhibit Configuration Request',
    'Custom Report Generation Request',
    'Financial Reconciliation Request',
    'Data Correction Request',
    'Information Requests',
    '3rd Party Performance Report Request',
    'System Configuration Change Request',
    'Hardware/Peripheral Assistance Request',
    'UGC Moderation Request',
    'Action Logging and Notifications',
    'Other', // Added 'Other' option
  ];

  const allRequestStatuses = ['All', 'Pending', 'In Progress', 'Resolved', 'Rejected', 'Approved', 'Completed'];

  const allRequestHandlers = [
    'All',
    'Super Admin',
    'Admin',
    'Customer Support',
    'Bookings and Ticketing Manager',
    'Finance',
    'Counter Staff',
    'IT Support',
    'Marketing',
    'Operations Manager',
    'System',
    'Data Analyst', // Added based on Custom Report Generation
  ];


  const openRequestModal = (request = null) => {
    setSelectedRequest(request);
    setEditableRequest(request ? { ...request } : {
      id: generateUniqueId(),
      type: '',
      description: '',
      status: 'Pending',
      handledBy: '',
      initiatedBy: '',
      submissionDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      details: {}, // Empty object for details
    });
    setIsRequestModalOpen(true);
    setRequestMessage('');
    setRequestMessageType('');
  };

  const closeRequestModal = () => {
    setIsRequestModalOpen(false);
    setSelectedRequest(null);
    setEditableRequest(null);
  };

  const handleRequestInputChange = (e) => {
    const { name, value } = e.target;
    setEditableRequest(prev => ({ ...prev, [name]: value }));
  };

  const handleRequestDetailsChange = (e) => {
    const { name, value } = e.target;
    setEditableRequest(prev => ({
      ...prev,
      details: {
        ...prev.details,
        [name]: value
      }
    }));
  };

  const saveRequestChanges = async () => {
    setRequestMessage('');
    if (!editableRequest.type || !editableRequest.description || !editableRequest.status || !editableRequest.handledBy) {
      setRequestMessage('Type, Description, Status, and Handled By are required for the request.');
      setRequestMessageType('error');
      return;
    }

    // If "Other" type is selected, ensure otherRequestTypeDescription is captured
    if (editableRequest.type === 'Other' && !editableRequest.details.otherRequestTypeDescription) {
      setRequestMessage('Please provide a description for the "Other" request type.');
      setRequestMessageType('error');
      return;
    }

    try {
      await simulateApiCall(() => {
        const updatedRequest = { ...editableRequest, lastUpdated: new Date().toISOString() };
        if (selectedRequest) {
          // Update existing request
          setRequests(prevRequests => prevRequests.map(req =>
            req.id === updatedRequest.id ? updatedRequest : req
          ));
          setRequestMessage('Request updated successfully!');
        } else {
          // Add new request
          setRequests(prevRequests => [...prevRequests, updatedRequest]);
          setRequestMessage('New request added successfully!');
        }
        setRequestMessageType('success');
      });
      closeRequestModal();
    } catch (error) {
      console.error("Error saving request:", error);
      setRequestMessage('Failed to save request due to an internal error.');
      setRequestMessageType('error');
    }
  };

  const deleteRequest = async (id) => {
    if (window.confirm('Are you sure you want to delete this request? This cannot be undone.')) {
      try {
        await simulateApiCall(() => {
          setRequests(prevRequests => prevRequests.filter(req => req.id !== id));
          setRequestMessage('Request deleted successfully!');
          setRequestMessageType('success');
        });
      } catch (error) {
        console.error("Error deleting request:", error);
        setRequestMessage('Failed to delete request due to an internal error.');
        setRequestMessageType('error');
      }
    }
  };

  // Filtered Requests Logic
  const filteredRequests = requests.filter(req => {
    const matchesSearch = requestSearchTerm === '' ||
      req.description.toLowerCase().includes(requestSearchTerm.toLowerCase()) ||
      req.id.toLowerCase().includes(requestSearchTerm.toLowerCase()) ||
      req.initiatedBy.toLowerCase().includes(requestSearchTerm.toLowerCase());

    const matchesStatus = requestStatusFilter === 'All' || req.status === requestStatusFilter;
    const matchesType = requestTypeFilter === 'All' || req.type === requestTypeFilter;
    const matchesHandledBy = requestHandledByFilter === 'All' || req.handledBy === requestHandledByFilter;

    return matchesSearch && matchesStatus && matchesType && matchesHandledBy;
  });

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">Request Management</h2>

      {requestMessage && (
        <div className={`p-3 sm:p-4 mb-4 sm:mb-6 rounded-lg flex items-center shadow-sm ${requestMessageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {requestMessageType === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <XCircle className="h-5 w-5 mr-2" />}
          {requestMessage}
        </div>
      )}

      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">Filter Requests</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-xs sm:text-sm font-semibold mb-2">Search (Description, ID, Initiator)</label>
            <input
              type="text"
              className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 text-sm"
              placeholder="Search requests..."
              value={requestSearchTerm}
              onChange={(e) => setRequestSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-xs sm:text-sm font-semibold mb-2">Status</label>
            <select
              className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 text-sm"
              value={requestStatusFilter}
              onChange={(e) => setRequestStatusFilter(e.target.value)}
            >
              {allRequestStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-xs sm:text-sm font-semibold mb-2">Type</label>
            <select
              className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 text-sm"
              value={requestTypeFilter}
              onChange={(e) => setRequestTypeFilter(e.target.value)}
            >
              {allRequestTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-xs sm:text-sm font-semibold mb-2">Handled By</label>
            <select
              className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 text-sm"
              value={requestHandledByFilter}
              onChange={(e) => setRequestHandledByFilter(e.target.value)}
            >
              {allRequestHandlers.map(handler => (
                <option key={handler} value={handler}>{handler}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={() => openRequestModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" /> Add New Request
        </button>
        <p className="text-sm text-gray-600 mt-4">Total Requests: {filteredRequests.length}</p>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-xs sm:text-sm leading-normal">
              <th className="py-3 px-4 sm:px-6 text-left">Request ID</th>
              <th className="py-3 px-4 sm:px-6 text-left">Type</th>
              <th className="py-3 px-4 sm:px-6 text-left">Description</th>
              <th className="py-3 px-4 sm:px-6 text-left">Status</th>
              <th className="py-3 px-4 sm:px-6 text-left">Handled By</th>
              <th className="py-3 px-4 sm:px-6 text-left">Initiated By</th>
              <th className="py-3 px-4 sm:px-6 text-left">Submission Date</th>
              <th className="py-3 px-4 sm:px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((req) => (
                <tr key={req.id} className="border-b border-gray-200 hover:bg-gray-100 transition-colors duration-150">
                  <td className="py-3 px-4 sm:px-6 text-left whitespace-nowrap text-xs sm:text-sm font-mono bg-gray-50 rounded-md">{req.id.substring(0, 8)}...</td>
                  <td className="py-3 px-4 sm:px-6 text-left text-sm">{req.type}</td>
                  <td className="py-3 px-4 sm:px-6 text-left text-sm max-w-[200px] truncate" title={req.description}>{req.description}</td>
                  <td className="py-3 px-4 sm:px-6 text-left">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold
                      ${req.status === 'Resolved' || req.status === 'Approved' || req.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        req.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-left text-sm">{req.handledBy}</td>
                  <td className="py-3 px-4 sm:px-6 text-left text-sm">{req.initiatedBy}</td>
                  <td className="py-3 px-4 sm:px-6 text-left text-sm">{new Date(req.submissionDate).toLocaleDateString()}</td>
                  <td className="py-3 px-4 sm:px-6 text-center">
                    <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                      <button onClick={() => openRequestModal(req)} className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors duration-200 shadow-sm hover:shadow-md" title="View/Edit Request">
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      </button>
                      <button onClick={() => deleteRequest(req.id)} className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors duration-200 shadow-sm hover:shadow-md" title="Delete Request">
                        <Trash className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-4 text-center text-gray-500">No requests found matching your criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Request Details/Add Modal */}
      {isRequestModalOpen && editableRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-2xl w-full relative animate-scale-in transform transition-all duration-300 ease-out border border-gray-200 overflow-y-auto max-h-[90vh]">
            <button
              onClick={closeRequestModal}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 hover:text-gray-900 flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              aria-label="Close modal"
            >
              <XCircle className="h-6 w-6" />
            </button>
            <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">{selectedRequest ? `Request Details: ${selectedRequest.id.substring(0, 8)}...` : 'Add New Request'}</h3>

            <form onSubmit={(e) => { e.preventDefault(); saveRequestChanges(); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1">Request Type</label>
                  <select name="type" value={editableRequest.type} onChange={handleRequestInputChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    <option value="">Select Type</option>
                    {allRequestTypes.filter(type => type !== 'All').map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {editableRequest.type === 'Other' && (
                    <div className="mt-3">
                      <label className="block text-gray-700 text-sm font-semibold mb-1">Describe Other Request Type</label>
                      <input
                        type="text"
                        name="otherRequestTypeDescription"
                        value={editableRequest.details.otherRequestTypeDescription || ''}
                        onChange={handleRequestDetailsChange}
                        className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Custom Integration Request"
                        required
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1">Status</label>
                  <select name="status" value={editableRequest.status} onChange={handleRequestInputChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    {allRequestStatuses.filter(status => status !== 'All').map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-semibold mb-1">Description</label>
                  <textarea name="description" value={editableRequest.description} onChange={handleRequestInputChange} rows="3" className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" required></textarea>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1">Handled By</label>
                  <select name="handledBy" value={editableRequest.handledBy} onChange={handleRequestInputChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    <option value="">Select Handler</option>
                    {allRequestHandlers.filter(handler => handler !== 'All').map(handler => (
                      <option key={handler} value={handler}>{handler}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1">Initiated By</label>
                  <input type="text" name="initiatedBy" value={editableRequest.initiatedBy} onChange={handleRequestInputChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                {/* Dynamic Details Section based on Request Type */}
                {editableRequest.type && editableRequest.type !== 'Other' && ( // Only show if a specific type is selected and not 'Other'
                  <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-700 mb-3">Specific Details for {editableRequest.type}</h4>
                    {/* Render specific fields based on type */}
                    {editableRequest.type === 'Admin Access Request' && (
                      <>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">New Admin Name</label>
                          <input type="text" name="newAdminName" value={editableRequest.details.newAdminName || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Requested Permissions (comma-separated)</label>
                          <input type="text" name="requestedPermissions" value={editableRequest.details.requestedPermissions ? editableRequest.details.requestedPermissions.join(', ') : ''} onChange={(e) => handleRequestDetailsChange({ target: { name: 'requestedPermissions', value: e.target.value.split(',').map(s => s.trim()) } })} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Reason</label>
                          <textarea name="reason" value={editableRequest.details.reason || ''} onChange={handleRequestDetailsChange} rows="2" className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900"></textarea>
                        </div>
                      </>
                    )}
                    {editableRequest.type === 'Escalated Issue' && (
                      <>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Visitor ID</label>
                          <input type="text" name="visitorId" value={editableRequest.details.visitorId || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Issue Area</label>
                          <input type="text" name="issueArea" value={editableRequest.details.issueArea || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Severity</label>
                          <select name="severity" value={editableRequest.details.severity || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900">
                            <option value="">Select Severity</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Current Resolution Steps</label>
                          <textarea name="currentResolutionSteps" value={editableRequest.details.currentResolutionSteps || ''} onChange={handleRequestDetailsChange} rows="2" className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900"></textarea>
                        </div>
                      </>
                    )}
                    {editableRequest.type === 'Visitor Account Request' && (
                      <>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Visitor ID</label>
                          <input type="text" name="visitorId" value={editableRequest.details.visitorId || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Action</label>
                          <input type="text" name="action" value={editableRequest.details.action || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Old Value</label>
                          <input type="text" name="oldValue" value={editableRequest.details.oldValue || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-semibold mb-1">New Value</label>
                          <input type="text" name="newValue" value={editableRequest.details.newValue || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                      </>
                    )}
                    {editableRequest.type === 'Booking Rescheduling Request' && (
                      <>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Booking ID</label>
                          <input type="text" name="bookingId" value={editableRequest.details.bookingId || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Old Date</label>
                          <input type="date" name="oldDate" value={editableRequest.details.oldDate || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-semibold mb-1">New Date</label>
                          <input type="date" name="newDate" value={editableRequest.details.newDate || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                      </>
                    )}
                    {editableRequest.type === 'Manual Group Creation Request' && (
                      <>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Group Name</label>
                          <input type="text" name="groupName" value={editableRequest.details.groupName || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Group Size</label>
                          <input type="number" name="groupSize" value={editableRequest.details.groupSize || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Special Notes</label>
                          <textarea name="specialNotes" value={editableRequest.details.specialNotes || ''} onChange={handleRequestDetailsChange} rows="2" className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900"></textarea>
                        </div>
                      </>
                    )}
                    {editableRequest.type === 'Broadcast System Request' && (
                      <>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Message</label>
                          <textarea name="message" value={editableRequest.details.message || ''} onChange={handleRequestDetailsChange} rows="2" className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Target Audience</label>
                          <input type="text" name="targetAudience" value={editableRequest.details.targetAudience || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Urgency</label>
                          <select name="urgency" value={editableRequest.details.urgency || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900">
                            <option value="">Select Urgency</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                          </select>
                        </div>
                      </>
                    )}
                    {editableRequest.type === 'New Product/Offer Request' && (
                      <>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Product Name</label>
                          <input type="text" name="productName" value={editableRequest.details.productName || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Target Market</label>
                          <input type="text" name="targetMarket" value={editableRequest.details.targetMarket || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Proposed Price</label>
                          <input type="text" name="proposedPrice" value={editableRequest.details.proposedPrice || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                      </>
                    )}
                    {editableRequest.type === 'Pricing Adjustment Request' && (
                      <>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Item</label>
                          <input type="text" name="item" value={editableRequest.details.item || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Old Price</label>
                          <input type="number" name="oldPrice" value={editableRequest.details.oldPrice || ''} onChange={handleRequestDetailsChange} step="0.01" className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">New Price</label>
                          <input type="number" name="newPrice" value={editableRequest.details.newPrice || ''} onChange={handleRequestDetailsChange} step="0.01" className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Reason</label>
                          <textarea name="reason" value={editableRequest.details.reason || ''} onChange={handleRequestDetailsChange} rows="2" className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900"></textarea>
                        </div>
                      </>
                    )}
                    {editableRequest.type === 'Capacity Change Request' && (
                      <>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Attraction</label>
                          <input type="text" name="attraction" value={editableRequest.details.attraction || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Adjustment</label>
                          <input type="text" name="adjustment" value={editableRequest.details.adjustment || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Duration</label>
                          <input type="text" name="duration" value={editableRequest.details.duration || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                      </>
                    )}
                    {editableRequest.type === 'Partner Integration Request' && (
                      <>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Partner Name</label>
                          <input type="text" name="partnerName" value={editableRequest.details.partnerName || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Integration Type</label>
                          <input type="text" name="integrationType" value={editableRequest.details.integrationType || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Contact</label>
                          <input type="text" name="contact" value={editableRequest.details.contact || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                      </>
                    )}
                    {editableRequest.type === 'Bulk Booking Inquiry' && (
                      <>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Group Name</label>
                          <input type="text" name="groupName" value={editableRequest.details.groupName || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Group Size</label>
                          <input type="number" name="groupSize" value={editableRequest.details.groupSize || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Preferred Dates</label>
                          <input type="text" name="preferredDates" value={editableRequest.details.preferredDates || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Requirements</label>
                          <textarea name="requirements" value={editableRequest.details.requirements || ''} onChange={handleRequestDetailsChange} rows="2" className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900"></textarea>
                        </div>
                      </>
                    )}
                    {editableRequest.type === 'Group Management Request' && (
                      <>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Group ID</label>
                          <input type="text" name="groupId" value={editableRequest.details.groupId || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Action</label>
                          <input type="text" name="action" value={editableRequest.details.action || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Quantity (if applicable)</label>
                          <input type="number" name="quantity" value={editableRequest.details.quantity || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                      </>
                    )}
                    {editableRequest.type === 'Feedback & Complaint Resolution' && (
                      <>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Feedback Type</label>
                          <input type="text" name="feedbackType" value={editableRequest.details.feedbackType || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Area</label>
                          <input type="text" name="area" value={editableRequest.details.area || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Details</label>
                          <textarea name="details" value={editableRequest.details.details || ''} onChange={handleRequestDetailsChange} rows="2" className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900"></textarea>
                        </div>
                      </>
                    )}
                    {editableRequest.type === 'Entry/Exit Assistance' && (
                      <>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Gate</label>
                          <input type="text" name="gate" value={editableRequest.details.gate || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Issue</label>
                          <textarea name="issue" value={editableRequest.details.issue || ''} onChange={handleRequestDetailsChange} rows="2" className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900"></textarea>
                        </div>
                      </>
                    )}
                    {editableRequest.type === 'Gamification Adjustment Request' && (
                      <>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Visitor ID</label>
                          <input type="text" name="visitorId" value={editableRequest.details.visitorId || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Action</label>
                          <input type="text" name="action" value={editableRequest.details.action || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Reason</label>
                          <textarea name="reason" value={editableRequest.details.reason || ''} onChange={handleRequestDetailsChange} rows="2" className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900"></textarea>
                        </div>
                      </>
                    )}
                    {editableRequest.type === 'Lobby System Intervention Request' && (
                      <>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Rally Name</label>
                          <input type="text" name="rallyName" value={editableRequest.details.rallyName || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Action</label>
                          <input type="text" name="action" value={editableRequest.details.action || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Reason</label>
                          <textarea name="reason" value={editableRequest.details.reason || ''} onChange={handleRequestDetailsChange} rows="2" className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900"></textarea>
                        </div>
                      </>
                    )}
                    {editableRequest.type === 'Exhibit Configuration Request' && (
                      <>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Exhibit Name</label>
                          <input type="text" name="exhibitName" value={editableRequest.details.exhibitName || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Action</label>
                          <input type="text" name="action" value={editableRequest.details.action || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Duration (if applicable)</label>
                          <input type="text" name="duration" value={editableRequest.details.duration || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                      </>
                    )}
                    {editableRequest.type === 'Custom Report Generation Request' && (
                      <>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Report Type</label>
                          <input type="text" name="reportType" value={editableRequest.details.reportType || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Period</label>
                          <input type="text" name="period" value={editableRequest.details.period || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Requested By</label>
                          <input type="text" name="requestedBy" value={editableRequest.details.requestedBy || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                      </>
                    )}
                    {editableRequest.type === 'Financial Reconciliation Request' && (
                      <>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Discrepancy Area</label>
                          <input type="text" name="discrepancyArea" value={editableRequest.details.discrepancyArea || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Kiosk ID (if applicable)</label>
                          <input type="text" name="kioskId" value={editableRequest.details.kioskId || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Date</label>
                          <input type="date" name="date" value={editableRequest.details.date || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                      </>
                    )}
                    {editableRequest.type === 'Data Correction Request' && (
                      <>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Booking ID</label>
                          <input type="text" name="bookingId" value={editableRequest.details.bookingId || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Correction Type</label>
                          <input type="text" name="correctionType" value={editableRequest.details.correctionType || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Old Value</label>
                          <input type="text" name="oldValue" value={editableRequest.details.oldValue || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-semibold mb-1">New Value</label>
                          <input type="text" name="newValue" value={editableRequest.details.newValue || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                      </>
                    )}
                    {editableRequest.type === 'Information Requests' && (
                      <>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Query</label>
                          <textarea name="query" value={editableRequest.details.query || ''} onChange={handleRequestDetailsChange} rows="2" className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900"></textarea>
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Answer</label>
                          <textarea name="answer" value={editableRequest.details.answer || ''} onChange={handleRequestDetailsChange} rows="2" className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900"></textarea>
                        </div>
                      </>
                    )}
                    {editableRequest.type === '3rd Party Performance Report Request' && (
                      <>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Partner Name</label>
                          <input type="text" name="partnerName" value={editableRequest.details.partnerName || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Report Period</label>
                          <input type="text" name="reportPeriod" value={editableRequest.details.reportPeriod || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Data Requested</label>
                          <input type="text" name="dataRequested" value={editableRequest.details.dataRequested || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                      </>
                    )}
                    {editableRequest.type === 'System Configuration Change Request' && (
                      <>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Feature</label>
                          <input type="text" name="feature" value={editableRequest.details.feature || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Action</label>
                          <input type="text" name="action" value={editableRequest.details.action || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Reason</label>
                          <textarea name="reason" value={editableRequest.details.reason || ''} onChange={handleRequestDetailsChange} rows="2" className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900"></textarea>
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Scheduled Time (if applicable)</label>
                          <input type="text" name="scheduledTime" value={editableRequest.details.scheduledTime || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                      </>
                    )}
                    {editableRequest.type === 'Hardware/Peripheral Assistance Request' && (
                      <>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Device</label>
                          <input type="text" name="device" value={editableRequest.details.device || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Location</label>
                          <input type="text" name="location" value={editableRequest.details.location || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Issue</label>
                          <textarea name="issue" value={editableRequest.details.issue || ''} onChange={handleRequestDetailsChange} rows="2" className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900"></textarea>
                        </div>
                      </>
                    )}
                    {editableRequest.type === 'UGC Moderation Request' && (
                      <>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Content Type</label>
                          <input type="text" name="contentType" value={editableRequest.details.contentType || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Content ID</label>
                          <input type="text" name="contentId" value={editableRequest.details.contentId || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Action</label>
                          <input type="text" name="action" value={editableRequest.details.action || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                      </>
                    )}
                    {editableRequest.type === 'Action Logging and Notifications' && (
                      <>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Action</label>
                          <input type="text" name="action" value={editableRequest.details.action || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Request ID</label>
                          <input type="text" name="requestId" value={editableRequest.details.requestId || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-semibold mb-1">Actor</label>
                          <input type="text" name="actor" value={editableRequest.details.actor || ''} onChange={handleRequestDetailsChange} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900" />
                        </div>
                      </>
                    )}
                    {/* Add more conditions for other request types here */}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4 mt-6 border-t pt-4">
                <button type="button" onClick={closeRequestModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-5 rounded-lg transition-colors duration-200 shadow-md">
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
    </div>
  );
};

export default RequestsManagement;
