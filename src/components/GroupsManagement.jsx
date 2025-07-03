import React, { useState, useContext } from 'react';
import { AdminDashboardContext } from '../App.jsx'; // Explicit .jsx extension
import { Plus, Edit, Trash, CheckCircle, XCircle, Save, Users, Eye, Minus } from 'lucide-react';
import GroupDetailsModal from './GroupDetailsModal.jsx'; // Explicit .jsx extension

// Helper function to generate a unique ID
const generateUniqueId = () => {
  return 'id_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
};

const GroupsManagement = () => {
  const { data, updateData, addData, deleteData, simulateApiCall } = useContext(AdminDashboardContext);

  // --- Mock Users Data for Demonstration ---
  // This is added here to ensure that the add-on 'purchasedBy' IDs can be resolved to names
  // for the mock bulk booking groups, even if data.users from context is not fully populated.
  // In a real application, ensure your primary data source (e.g., data.js) contains these users.
  const localMockUsers = Array.from({ length: 30 }, (_, i) => ({
    id: `student_${i + 1}`,
    name: `Student ${i + 1}`,
    email: `student${i + 1}@example.com`,
    pointsEarned: Math.floor(Math.random() * 100),
    zonesCovered: ['Zone A', 'Zone B'],
  })).concat(
    Array.from({ length: 22 }, (_, i) => ({
      id: `employee_${i + 1}`,
      name: `Employee ${i + 1}`,
      email: `employee${i + 1}@example.com`,
      pointsEarned: Math.floor(Math.random() * 150),
      zonesCovered: ['Zone C', 'Zone D'],
    }))
  ).concat([
    // Add primary bookers for bulk groups if they are not already in your main data.users
    { id: 'user_school_rep_1', name: 'Ms. Eleanor Vance', email: 'eleanor.vance@school.com', pointsEarned: 500, zonesCovered: ['Admin Zone'] },
    { id: 'user_corp_rep_1', name: 'Mr. Alex Chen', email: 'alex.chen@corp.com', pointsEarned: 700, zonesCovered: ['Executive Zone'] },
    // Add other existing mock users from your data.js if not already covered by the generated ones
    { id: 'user_1', name: 'John Doe', email: 'john.doe@example.com', pointsEarned: 120, zonesCovered: ['Zone A'] },
    { id: 'user_2', name: 'Jane Smith', email: 'jane.smith@example.com', pointsEarned: 150, zonesCovered: ['Zone B'] },
    { id: 'user_3', name: 'Peter Jones', email: 'peter.jones@example.com', pointsEarned: 80, zonesCovered: ['Zone A', 'Zone C'] },
    { id: 'user_4', name: 'Emily White', email: 'emily.white@example.com', pointsEarned: 200, zonesCovered: ['Zone D'] },
    { id: 'user_5', name: 'David Green', email: 'david.green@example.com', pointsEarned: 100, zonesCovered: ['Zone B', 'Zone D'] },
  ]);

  // --- Mock Bookings Data for Demonstration ---
  // This is crucial for getGroupBookingDetails to find relevant bookings and their add-ons.
  // In a real application, ensure your primary data source (e.g., data.js) contains these bookings.
  const localMockBookings = [
    {
      id: 'booking_abc123_01', groupId: 'grp_abc123', date: '2024-07-20', time: '10:00', status: 'Confirmed',
      addOns: [{ name: 'Audio Guide', purchasedBy: ['user_1'] }, { name: 'Souvenir Photo', purchasedBy: ['user_2'] }]
    },
    {
      id: 'booking_def456_01', groupId: 'grp_def456', date: '2024-06-01', time: '14:00', status: 'Confirmed',
      addOns: [{ name: 'Guided Tour', purchasedBy: ['user_4', 'user_5'] }]
    },
    {
      id: 'booking_bulk_001_01', groupId: 'grp_bulk_001', date: '2024-08-16', time: '09:00', status: 'Booked',
      addOns: [
        { name: 'Guided Tour', purchasedBy: ['student_1', 'student_5', 'student_10'] },
        { name: 'Lunch Voucher', purchasedBy: ['student_1', 'student_2', 'student_3', 'student_4', 'student_5'] }
      ]
    },
    {
      id: 'booking_bulk_002_01', groupId: 'grp_bulk_002', date: '2024-09-10', time: '14:00', status: 'Confirmed',
      addOns: [
        { name: 'Conference Room Access', purchasedBy: ['employee_1', 'employee_2', 'employee_3'] },
        { name: 'Coffee Break Package', purchasedBy: Array.from({ length: 22 }, (_, i) => `employee_${i + 1}`) } // All employees
      ]
    },
  ];

  // Initialize groups with existing data and add new bulk booking mock data
  // NOTE: In a real application, this mock data should ideally be managed in your `data.js`
  // or fetched from a backend. This is for demonstration purposes within this component.
  const initialGroups = [
    // Existing mock groups (assuming some exist in data.js or were previously defined)
    {
      id: 'grp_abc123',
      name: 'Adventure Seekers Club',
      primaryBookerId: 'user_1',
      primaryBookerName: 'John Doe',
      status: 'Active',
      isPublic: true,
      members: [
        { id: 'mem_1', userId: 'user_1', name: 'John Doe', status: 'Joined' },
        { id: 'mem_2', userId: 'user_2', name: 'Jane Smith', status: 'Joined' },
        { id: 'mem_3', userId: 'user_3', name: 'Peter Jones', status: 'Pending' },
      ],
    },
    {
      id: 'grp_def456',
      name: 'Local History Enthusiasts',
      primaryBookerId: 'user_4',
      primaryBookerName: 'Emily White',
      status: 'Archived',
      isPublic: false,
      members: [
        { id: 'mem_4', userId: 'user_4', name: 'Emily White', status: 'Joined' },
        { id: 'mem_5', userId: 'user_5', name: 'David Green', status: 'Joined' },
      ],
    },
    // New Bulk Booking Group 1 (20+ members)
    {
      id: 'grp_bulk_001',
      name: 'Springfield High School Trip',
      primaryBookerId: 'user_school_rep_1',
      primaryBookerName: 'Ms. Eleanor Vance',
      status: 'Approved',
      isPublic: false,
      members: Array.from({ length: 30 }, (_, i) => ({
        id: generateUniqueId(),
        userId: `student_${i + 1}`,
        name: `Student ${i + 1}`,
        status: 'Joined',
      })),
    },
    // New Bulk Booking Group 2 (20+ members)
    {
      id: 'grp_bulk_002',
      name: 'Tech Innovators Corp Retreat',
      primaryBookerId: 'user_corp_rep_1',
      primaryBookerName: 'Mr. Alex Chen',
      status: 'Active',
      isPublic: false,
      members: Array.from({ length: 22 }, (_, i) => ({
        id: generateUniqueId(),
        userId: `employee_${i + 1}`,
        name: `Employee ${i + 1}`,
        status: 'Joined',
      })),
    },
  ];

  // Merge initialGroups with any existing groups from the context if 'data.groups' is already populated
  // This ensures that mock data is consistent if the context already has some groups.
  const [groups, setGroups] = useState(() => {
    if (data && data.groups && data.groups.length > 0) {
      // Simple merge: prioritize context data, but ensure new mock groups are present if not already there
      const existingGroupIds = new Set(data.groups.map(g => g.id));
      const newMockGroupsToAdd = initialGroups.filter(g => !existingGroupIds.has(g.id));
      return [...data.groups, ...newMockGroupsToAdd];
    }
    return initialGroups;
  });


  const [isModalOpen, setIsModalOpen] = useState(false); // For Add/Edit Group Modal
  const [isGroupDetailsModalOpen, setIsGroupDetailsModalOpen] = useState(false); // For Group Details View Modal
  const [editingGroup, setEditingGroup] = useState(null); // Stores the group being edited
  const [newGroup, setNewGroup] = useState({ // State for new/edited group data
    name: '',
    primaryBookerId: '',
    primaryBookerName: '',
    status: 'Active',
    isPublic: false,
    members: [] // Initialize members as an empty array
  });
  const [selectedGroupForDetails, setSelectedGroupForDetails] = useState(null); // Stores the group for details view
  const [message, setMessage] = useState(''); // Feedback message for user
  const [messageType, setMessageType] = useState(''); // Type of message (success/error)

  // Filter states for Group Management table
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isPublicFilter, setIsPublicFilter] = useState('All');

  /**
   * Opens the Add/Edit Group modal.
   * @param {object} group - The group object to edit, or null for adding a new group.
   */
  const openModal = (group = null) => {
    setEditingGroup(group);
    // When editing, ensure 'members' array exists. If not, default to empty.
    setNewGroup(group ? { ...group, members: group.members || [] } : {
      name: '', primaryBookerId: '', primaryBookerName: '', status: 'Active', isPublic: false, members: []
    });
    setIsModalOpen(true);
    setMessage(''); // Clear any previous messages
  };

  /**
   * Closes the Add/Edit Group modal and resets states.
   */
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingGroup(null);
    setNewGroup({ name: '', primaryBookerId: '', primaryBookerName: '', status: 'Active', isPublic: false, members: [] });
  };

  /**
   * Opens the Group Details view modal.
   * Calculates additional dynamic details for the group before opening the modal.
   * @param {object} group - The group object to display details for.
   */
  const openGroupDetailsModal = (group) => {
    let overallXPEarned = 0;
    const groupZonesCovered = new Set();

    // Iterate through members to calculate XP and zones covered
    (group.members || []).forEach(member => {
      // Find the full user object from global data based on userId or name
      // Prioritize localMockUsers for resolution
      const user = localMockUsers.find(u => u.id === member.userId || u.name === member.name) ||
                   data.users.find(u => u.id === member.userId || u.name === member.name);
      if (user) {
        overallXPEarned += user.pointsEarned || 0;
        (user.zonesCovered || []).forEach(zone => groupZonesCovered.add(zone));
      }
    });

    // Get the latest booking and its details for the group
    const { latestBookingDate, addOnsDetails, visitDate } = getGroupBookingDetails(group.id); // Changed associatedAddOns to addOnsDetails

    // Set the selected group for details, including calculated stats
    setSelectedGroupForDetails({
      ...group,
      overallXPEarned: overallXPEarned,
      groupZonesCovered: Array.from(groupZonesCovered),
      latestBookingDate: latestBookingDate,
      addOnsDetails: addOnsDetails, // Pass the detailed add-ons object
      visitDate: visitDate
    });
    setIsGroupDetailsModalOpen(true); // Open the details modal
  };

  /**
   * Closes the Group Details view modal.
   */
  const closeGroupDetailsModal = () => {
    setIsGroupDetailsModalOpen(false);
    setSelectedGroupForDetails(null);
  };

  /**
   * Handles form submission for adding or updating a group.
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages

    // Basic validation
    if (!newGroup.name || !newGroup.primaryBookerName) {
      setMessage('Group Name and Primary Booker Name are required.');
      setMessageType('error');
      return;
    }

    // Simulate API call for data manipulation
    await simulateApiCall(() => {
      // Find the primary booker's actual ID from the users data
      const primaryBooker = localMockUsers.find(user => user.name === newGroup.primaryBookerName) ||
                            data.users.find(user => user.name === newGroup.primaryBookerName);
      const updatedGroup = {
        ...newGroup,
        // Set primaryBookerId based on found user or keep existing if editing
        primaryBookerId: primaryBooker ? primaryBooker.id : (editingGroup ? editingGroup.primaryBookerId : ''),
      };

      if (editingGroup) {
        // Update existing group
        // updateData('groups', editingGroup.id, updatedGroup); // Assuming updateData works with 'groups' collection
        setGroups(prevGroups => prevGroups.map(g => g.id === editingGroup.id ? updatedGroup : g));
        setMessage('Group updated successfully!');
      } else {
        // For new groups, ensure members is an array and add the primary booker if not already present
        if (!updatedGroup.members) {
          updatedGroup.members = [];
        }

        // Add primary booker as a member if not already in the list
        const primaryBookerAlreadyMember = updatedGroup.members.some(
          m => (primaryBooker && m.userId === primaryBooker.id) || (!primaryBooker && m.name === updatedGroup.primaryBookerName)
        );

        if (!primaryBookerAlreadyMember) {
          updatedGroup.members.push({
            id: generateUniqueId(),
            userId: primaryBooker ? primaryBooker.id : null, // Store userId if found
            name: updatedGroup.primaryBookerName,
            status: 'Joined'
          });
        }
        // addData('groups', updatedGroup); // Assuming addData works with 'groups' collection
        setGroups(prevGroups => [...prevGroups, { ...updatedGroup, id: generateUniqueId() }]); // Add with new ID
        setMessage('Group added successfully!');
      }
      setMessageType('success');
    });
    closeModal(); // Close modal after submission
  };

  /**
   * Handles deletion of a group.
   * @param {string} id - The ID of the group to delete.
   */
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this group?')) { // Simple confirmation
      await simulateApiCall(() => {
        // deleteData('groups', id); // Assuming deleteData works with 'groups' collection
        setGroups(prevGroups => prevGroups.filter(g => g.id !== id));
        setMessage('Group deleted successfully!');
        setMessageType('success');
      });
    }
  };

  /**
   * Approves a public room request for a group.
   * @param {string} groupId - The ID of the group to approve.
   */
  const handleApprovePublicRequest = async (groupId) => {
    await simulateApiCall(() => {
      // updateData('groups', groupId, { isPublic: true, status: 'Approved (Public)' });
      setGroups(prevGroups => prevGroups.map(g => g.id === groupId ? { ...g, isPublic: true, status: 'Approved (Public)' } : g));
      setMessage('Public room request approved!');
      setMessageType('success');
    });
  };

  /**
   * Helper function to get the latest booking details for a given group.
   * @param {string} groupId - The ID of the group.
   * @returns {object} - An object containing latest booking date, associated add-ons, and visit date.
   */
  const getGroupBookingDetails = (groupId) => {
    // Filter bookings relevant to this group, prioritizing local mock bookings
    const allBookings = [...localMockBookings, ...(data.bookings || [])];
    const groupBookings = allBookings.filter(b => b.groupId === groupId);

    if (groupBookings.length === 0) {
      return { latestBookingDate: 'N/A', addOnsDetails: [], visitDate: 'N/A' };
    }

    // Sort bookings by date and time in descending order to find the latest
    const sortedBookings = [...groupBookings].sort((a, b) => {
      const dateTimeA = new Date(`${a.date}T${a.time || '00:00'}`);
      const dateTimeB = new Date(`${b.date}T${b.time || '00:00'}`);
      return dateTimeB - dateTimeA;
    });

    const latestBooking = sortedBookings[0];
    const formattedBookingDate = latestBooking.date; // Assuming date is already inYYYY-MM-DD format
    const formattedVisitDate = (latestBooking.status === 'Confirmed' || latestBooking.status === 'Booked')
      ? latestBooking.date
      : 'Not Visited Yet';

    // Process add-ons to include who purchased them
    const addOnsDetails = (latestBooking.addOns || []).map(ao => {
      const purchasedByNames = (ao.purchasedBy || []).map(userId => {
        // Try to find user in localMockUsers first, then in data.users
        const user = localMockUsers.find(u => u.id === userId) || data.users.find(u => u.id === userId);
        return user ? user.name : userId; // Return name if found, else the ID
      });
      return {
        name: ao.name,
        purchasedBy: purchasedByNames
      };
    });

    return { latestBookingDate: formattedBookingDate, addOnsDetails: addOnsDetails, visitDate: formattedVisitDate };
  };

  /**
   * Handles changes to individual member fields within the form.
   * @param {number} index - The index of the member in the array.
   * @param {string} field - The field of the member object to update (e.g., 'name', 'status').
   * @param {string} value - The new value for the field.
   */
  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...newGroup.members];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setNewGroup({ ...newGroup, members: updatedMembers });
  };

  /**
   * Adds a new empty member entry to the group.
   */
  const addMember = () => {
    setNewGroup({
      ...newGroup,
      members: [...newGroup.members, { id: generateUniqueId(), name: '', status: 'Pending' }] // Default status for new member
    });
  };

  /**
   * Removes a member from the group by index.
   * @param {number} index - The index of the member to remove.
   */
  const removeMember = (index) => {
    const updatedMembers = newGroup.members.filter((_, i) => i !== index);
    setNewGroup({ ...newGroup, members: updatedMembers });
  };

  // Filter groups based on search term, status, and public/private status
  const filteredGroups = groups.filter(group => { // Use local 'groups' state for filtering
    const matchesSearch = searchTerm === '' ||
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.primaryBookerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || group.status === statusFilter;

    const matchesIsPublic = isPublicFilter === 'All' ||
      (isPublicFilter === 'Public' && group.isPublic) ||
      (isPublicFilter === 'Private' && !group.isPublic);

    return matchesSearch && matchesStatus && matchesIsPublic;
  });


  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">Group Management</h2>

      {/* Existing message display for Group Management */}
      {message && (
        <div className={`p-3 sm:p-4 mb-4 sm:mb-6 rounded-lg flex items-center shadow-sm ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {messageType === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <XCircle className="h-5 w-5 mr-2" />}
          {message}
        </div>
      )}

      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">Filter Groups</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-xs sm:text-sm font-semibold mb-2">Search (Group Name, Booker Name)</label>
            <input
              type="text"
              className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 text-sm"
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-xs sm:text-sm font-semibold mb-2">Status</label>
            <select
              className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Archived">Archived</option>
              <option value="Pending">Pending</option>
              <option value="Approved (Public)">Approved (Public)</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-xs sm:text-sm font-semibold mb-2">Visibility</label>
            <select
              className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 text-sm"
              value={isPublicFilter}
              onChange={(e) => setIsPublicFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>
          </div>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" /> Add New Group
        </button>
        <p className="text-sm text-gray-600 mt-4">Total Groups: {filteredGroups.length}</p>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-xs sm:text-sm leading-normal">
              <th className="py-3 px-4 sm:px-6 text-left">Group ID</th>
              <th className="py-3 px-4 sm:px-6 text-left">Group Name</th>
              <th className="py-3 px-4 sm:px-6 text-left">Primary Booker</th>
              <th className="py-3 px-4 sm:px-6 text-left">Status</th>
              <th className="py-3 px-4 sm:px-6 text-left">Public?</th>
              <th className="py-3 px-4 sm:px-6 text-left">Members</th>
              <th className="py-3 px-4 sm:px-6 text-left">Latest Booking Date</th>
              <th className="py-3 px-4 sm:px-6 text-left">Add-ons</th>
              <th className="py-3 px-4 sm:px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group) => {
                const { latestBookingDate, addOnsDetails } = getGroupBookingDetails(group.id); // Changed associatedAddOns to addOnsDetails
                return (
                  <tr key={group.id} className="border-b border-gray-200 hover:bg-gray-100 transition-colors duration-150">
                    <td className="py-3 px-4 sm:px-6 text-left whitespace-nowrap text-xs sm:text-sm font-mono bg-gray-50 rounded-md">{group.id.substring(0, 8)}...</td>
                    <td className="py-3 px-4 sm:px-6 text-left text-sm">{group.name}</td>
                    <td className="py-3 px-4 sm:px-6 text-left text-sm">{group.primaryBookerName}</td>
                    <td className="py-3 px-4 sm:px-6 text-left">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${group.status === 'Active' || group.status.includes('Approved') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {group.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 sm:px-6 text-left">
                      {group.isPublic ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                    </td>
                    <td className="py-3 px-4 sm:px-6 text-left text-sm">{group.members ? group.members.length : 0}</td>
                    <td className="py-3 px-4 sm:px-6 text-left text-sm">{latestBookingDate}</td>
                    <td className="py-3 px-4 sm:px-6 text-left max-w-[150px] truncate text-sm" title={addOnsDetails.map(ao => `${ao.name} (${ao.purchasedBy.join(', ')})`).join(', ')}>
                      {addOnsDetails.map(ao => `${ao.name} (${ao.purchasedBy.join(', ')})`).join(', ')}
                    </td>
                    <td className="py-3 px-4 sm:px-6 text-center">
                      <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                        {/* View Details Button */}
                        <button onClick={() => openGroupDetailsModal(group)} className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors duration-200 shadow-sm hover:shadow-md" title="View Details">
                          <Eye className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                        </button>
                        {/* Edit Button */}
                        <button onClick={() => openModal(group)} className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-yellow-600 hover:bg-yellow-100 flex items-center justify-center transition-colors duration-200 shadow-sm hover:shadow-md" title="Edit Group">
                          <Edit className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                        </button>
                        {/* Delete Button */}
                        <button onClick={() => handleDelete(group.id)} className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors duration-200 shadow-sm hover:shadow-md" title="Delete Group">
                          <Trash className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                        </button>
                        {/* Approve Public Room Request Button */}
                        {!group.isPublic && group.status !== 'Approved (Public)' && (
                          <button onClick={() => handleApprovePublicRequest(group.id)} className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-purple-600 hover:bg-purple-100 flex items-center justify-center transition-colors duration-200 shadow-sm hover:shadow-md" title="Approve Public Room Request">
                            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="py-4 text-center text-gray-500">No groups found matching your criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      {/* Group Details View Modal */}
      {isGroupDetailsModalOpen && selectedGroupForDetails && (
        <GroupDetailsModal isOpen={isGroupDetailsModalOpen} group={selectedGroupForDetails} onClose={closeGroupDetailsModal} />
      )}
    </div>
  );
};

export default GroupsManagement;
