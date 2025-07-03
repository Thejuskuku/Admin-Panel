import React, { useState, useContext } from 'react';
import { AdminDashboardContext } from '../App';
import ConfirmationModal from './ConfirmationModal';
import SpotBookingDashboard from './SpotBookingDashboard'; // Import the new component
import {
  Plus, Edit, Trash, CheckCircle, XCircle, Save, Minus, Calendar, Search, DollarSign,
  Ticket, Clock, Percent, ClipboardList, Settings, MapPin, Tablet, Laptop, Building,
  GraduationCap
} from 'lucide-react';

const BookingsManagement = () => {
  const { data, updateData, addData, deleteData, simulateApiCall, updateSetting } = useContext(AdminDashboardContext); // Assume updateSetting can be used more broadly or there's a new updatePricingModels function
  const [activeTab, setActiveTab] = useState('manageBookings');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // --- Confirmation Modal State ---
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalMessage, setConfirmModalMessage] = useState('');
  const [confirmModalAction, setConfirmModalAction] = useState(null);
  const [confirmModalType, setConfirmModalType] = useState('warning');

  // Function to open confirmation modal
  const openConfirmModal = (msg, action, type = 'warning') => {
    setConfirmModalMessage(msg);
    setConfirmModalAction(() => action);
    setConfirmModalType(type);
    setIsConfirmModalOpen(true);
  };

  // Function to handle confirmation
  const handleConfirm = () => {
    if (confirmModalAction) {
      confirmModalAction();
    }
    setIsConfirmModalOpen(false);
    setConfirmModalAction(null);
  };

  // Function to cancel confirmation
  const handleCancelConfirm = () => {
    setIsConfirmModalOpen(false);
    setConfirmModalAction(null);
  };

  // --- Manage Bookings (Existing functionality) ---
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [newBooking, setNewBooking] = useState({ userId: '', userName: '', groupId: '', date: '', time: '', amount: 0, status: 'Booked', platform: 'Online', ticketCount: 1, addOns: [], ticketTypeId: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');

  const openBookingModal = (booking = null) => {
    setEditingBooking(booking);
    setNewBooking(booking ? { ...booking } : { userId: '', userName: '', groupId: '', date: '', time: '', amount: 0, status: 'Booked', platform: 'Online', ticketCount: 1, addOns: [], ticketTypeId: '' });
    setIsBookingModalOpen(true);
    setMessage('');
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setEditingBooking(null);
    setNewBooking({ userId: '', userName: '', groupId: '', date: '', time: '', amount: 0, status: 'Booked', platform: 'Online', ticketCount: 1, addOns: [], ticketTypeId: '' });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!newBooking.userName || !newBooking.date || !newBooking.amount || !newBooking.ticketTypeId) {
      setMessage('User Name, Date, Amount, and Ticket Type are required.');
      setMessageType('error');
      return;
    }

    await simulateApiCall(() => {
      if (editingBooking) {
        updateData('bookings', editingBooking.id, newBooking);
        setMessage('Booking updated successfully!');
      } else {
        addData('bookings', newBooking);
        setMessage('Booking added successfully!');
      }
      setMessageType('success');
    });
    closeBookingModal();
  };

  const handleBookingDelete = (id) => {
    openConfirmModal(
      'Are you sure you want to delete this booking? This cannot be undone.',
      async () => {
        await simulateApiCall(() => {
          deleteData('bookings', id);
          setMessage('Booking deleted successfully!');
          setMessageType('success');
        });
      },
      'danger'
    );
  };

  const handleAddOnChange = (index, field, value) => {
    const updatedAddOns = [...newBooking.addOns];
    updatedAddOns[index][field] = value;
    setNewBooking({ ...newBooking, addOns: updatedAddOns });
  };

  const addAddOnToBooking = () => {
    setNewBooking({ ...newBooking, addOns: [...newBooking.addOns, { id: '', name: '', quantity: 1 }] });
  };

  const removeAddOnFromBooking = (index) => {
    const updatedAddOns = newBooking.addOns.filter((_, i) => i !== index);
    setNewBooking({ ...newBooking, addOns: updatedAddOns });
  };

  const handleBulkBookingApproval = (bookingId) => {
    openConfirmModal(
      'Are you sure you want to approve this bulk booking?',
      async () => {
        await simulateApiCall(() => {
          updateData('bookings', bookingId, { status: 'Approved (Bulk)' });
          setMessage('Bulk booking approved!');
          setMessageType('success');
        });
      },
      'info'
    );
  };

  const filteredBookings = data.bookings.filter(booking => {
    const matchesSearch = searchTerm === '' ||
      booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || booking.status === statusFilter;
    const matchesDate = dateFilter === '' || booking.date === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
  });

  // --- Ticket Type Management (New Section) ---
  const [isTicketTypeModalOpen, setIsTicketTypeModalOpen] = useState(false);
  const [editingTicketType, setEditingTicketType] = useState(null);
  const [newTicketType, setNewTicketType] = useState({
    name: '', baseCost: 0, isActive: true, validityDays: 1, dailyBookingLimit: 0, description: ''
  });

  const openTicketTypeModal = (ticketType = null) => {
    setEditingTicketType(ticketType);
    setNewTicketType(ticketType ? { ...ticketType } : { name: '', baseCost: 0, isActive: true, validityDays: 1, dailyBookingLimit: 0, description: '' });
    setIsTicketTypeModalOpen(true);
    setMessage('');
  };

  const closeTicketTypeModal = () => {
    setIsTicketTypeModalOpen(false);
    setEditingTicketType(null);
    setNewTicketType({ name: '', baseCost: 0, isActive: true, validityDays: 1, dailyBookingLimit: 0, description: '' });
  };

  const handleTicketTypeSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!newTicketType.name || newTicketType.baseCost < 0 || newTicketType.dailyBookingLimit < 0) {
      setMessage('Name, Base Cost (>=0), and Daily Booking Limit (>=0) are required.');
      setMessageType('error');
      return;
    }

    await simulateApiCall(() => {
      if (editingTicketType) {
        updateData('ticketTypes', editingTicketType.id, newTicketType);
        setMessage('Ticket Type updated successfully!');
      } else {
        addData('ticketTypes', newTicketType);
        setMessage('Ticket Type added successfully!');
      }
      setMessageType('success');
    });
    closeTicketTypeModal();
  };

  const handleTicketTypeDelete = (id) => {
    openConfirmModal(
      'Are you sure you want to delete this ticket type? Bookings associated with this type might be affected.',
      async () => {
        await simulateApiCall(() => {
          deleteData('ticketTypes', id);
          setMessage('Ticket Type deleted successfully!');
          setMessageType('success');
        });
      },
      'danger'
    );
  };

  const TicketTypeManagement = () => (
    <div className="p-8 bg-gray-50 rounded-xl shadow-md">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><Ticket className="h-6 w-6 mr-3 text-purple-600" /> Ticket Type Management</h3>
      <p className="text-gray-600 mb-4">Define and manage different categories of tickets offered.</p>

      <button
        onClick={() => openTicketTypeModal()}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg flex items-center mb-6 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <Plus className="h-5 w-5 mr-2" /> Add New Ticket Type
      </button>

      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Base Cost</th>
              <th className="py-3 px-6 text-left">Active</th>
              <th className="py-3 px-6 text-left">Validity (Days)</th>
              <th className="py-3 px-6 text-left">Daily Limit</th>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {data.ticketTypes.map(type => (
              <tr key={type.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left">{type.name}</td>
                <td className="py-3 px-6 text-left">${type.baseCost.toFixed(2)}</td>
                <td className="py-3 px-6 text-left">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${type.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {type.isActive ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="py-3 px-6 text-left">{type.validityDays}</td>
                <td className="py-3 px-6 text-left">{type.dailyBookingLimit}</td>
                <td className="py-3 px-6 text-left max-w-xs truncate" title={type.description}>{type.description}</td>
                <td className="py-3 px-6 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <button onClick={() => openTicketTypeModal(type)} className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 flex items-center justify-center transition-colors duration-200" title="Edit Ticket Type">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleTicketTypeDelete(type.id)} className="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition-colors duration-200" title="Delete Ticket Type">
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isTicketTypeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-xl w-11/12 relative animate-scale-in">
            <button
              onClick={closeTicketTypeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <XCircle className="h-7 w-7" />
            </button>
            <h3 className="text-2xl font-bold mb-6 text-gray-800">{editingTicketType ? 'Edit Ticket Type' : 'Add New Ticket Type'}</h3>
            <form onSubmit={handleTicketTypeSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Name</label>
                  <input type="text" value={newTicketType.name} onChange={(e) => setNewTicketType({ ...newTicketType, name: e.target.value })} className="shadow-sm bg-white border border-gray-300 text-gray-900 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200" required />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Base Cost ($)</label>
                  <input type="number" step="0.01" value={newTicketType.baseCost} onChange={(e) => setNewTicketType({ ...newTicketType, baseCost: parseFloat(e.target.value) })} className="shadow-sm bg-white border border-gray-300 text-gray-900 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200" min="0" required />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Validity Period (Days)</label>
                  <input type="number" value={newTicketType.validityDays} onChange={(e) => setNewTicketType({ ...newTicketType, validityDays: parseInt(e.target.value) || 0 })} className="shadow-sm bg-white border border-gray-300 text-gray-900 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200" min="0" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Daily Booking Limit</label>
                  <input type="number" value={newTicketType.dailyBookingLimit} onChange={(e) => setNewTicketType({ ...newTicketType, dailyBookingLimit: parseInt(e.target.value) || 0 })} className="shadow-sm bg-white border border-gray-300 text-gray-900 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200" min="0" />
                </div>
                <div className="flex items-center mt-6">
                  <input type="checkbox" id="ticketIsActive" checked={newTicketType.isActive} onChange={(e) => setNewTicketType({ ...newTicketType, isActive: e.target.checked })} className="form-checkbox h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <label htmlFor="ticketIsActive" className="ml-2 text-gray-700 text-sm font-semibold">Is Active?</label>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">Description</label>
                <textarea value={newTicketType.description} onChange={(e) => setNewTicketType({ ...newTicketType, description: e.target.value })} className="shadow-sm bg-white border border-gray-300 text-gray-900 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 h-20"></textarea>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button type="button" onClick={closeTicketTypeModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400">
                  Cancel
                </button>
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <Save className="h-5 w-5 mr-2" /> {editingTicketType ? 'Update Ticket' : 'Add Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  // --- Time Slot & Capacity Management (New Section) ---
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [isTimeSlotModalOpen, setIsTimeSlotModalOpen] = useState(false);
  const [editingTimeSlot, setEditingTimeSlot] = useState(null);
  const [newTimeSlot, setNewTimeSlot] = useState({
    dayOfWeek: ['Monday'], startTime: '09:00', endTime: '10:00', totalCapacity: 100, publicCapacity: 70, schoolCapacity: 20, vipCapacity: 10, description: ''
  });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const openTimeSlotModal = (slot = null) => {
    setEditingTimeSlot(slot);
    setNewTimeSlot(slot ? { ...slot } : {
      dayOfWeek: [selectedDay], startTime: '09:00', endTime: '10:00', totalCapacity: 100, publicCapacity: 70, schoolCapacity: 20, vipCapacity: 10, description: ''
    });
    setIsTimeSlotModalOpen(true);
    setMessage('');
  };

  const closeTimeSlotModal = () => {
    setIsTimeSlotModalOpen(false);
    setEditingTimeSlot(null);
    setNewTimeSlot({
      dayOfWeek: [selectedDay], startTime: '09:00', endTime: '10:00', totalCapacity: 100, publicCapacity: 70, schoolCapacity: 20, vipCapacity: 10, description: ''
    });
  };

  const handleTimeSlotSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!newTimeSlot.startTime || !newTimeSlot.endTime || newTimeSlot.totalCapacity <= 0 || newTimeSlot.dayOfWeek.length === 0) {
      setMessage('Start Time, End Time, Total Capacity (>0), and at least one Day of Week are required.');
      setMessageType('error');
      return;
    }

    await simulateApiCall(() => {
      if (editingTimeSlot) {
        updateData('timeSlots', editingTimeSlot.id, newTimeSlot);
        setMessage('Time Slot updated successfully!');
      } else {
        addData('timeSlots', newTimeSlot);
        setMessage('Time Slot added successfully!');
      }
      setMessageType('success');
    });
    closeTimeSlotModal();
  };

  const handleTimeSlotDelete = (id) => {
    openConfirmModal(
      'Are you sure you want to delete this time slot?',
      async () => {
        await simulateApiCall(() => {
          deleteData('timeSlots', id);
          setMessage('Time Slot deleted successfully!');
          setMessageType('success');
        });
      },
      'danger'
    );
  };

  const TimeSlotCapacityManagement = () => (
    <div className="p-8 bg-gray-50 rounded-xl shadow-md">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><Clock className="h-6 w-6 mr-3 text-indigo-600" /> Time Slot & Capacity Management</h3>
      <p className="text-gray-600 mb-4">Configure available time slots and adjust capacities for different visitor types on a daily basis.</p>

      <div className="mb-6 flex items-center space-x-4">
        <label className="block text-gray-700 text-sm font-semibold">Filter by Day:</label>
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          className="shadow-sm bg-white border border-gray-300 text-gray-900 rounded-md py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
        >
          {daysOfWeek.map(day => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
        <button
          onClick={() => openTimeSlotModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <Plus className="h-5 w-5 mr-2" /> Add New Slot
        </button>
      </div>

      <h4 className="text-xl font-semibold text-gray-700 mb-4">Slots for {selectedDay}</h4>
      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Time Slot</th>
              <th className="py-3 px-6 text-left">Total Capacity</th>
              <th className="py-3 px-6 text-left">Public Capacity</th>
              <th className="py-3 px-6 text-left">School Capacity</th>
              <th className="py-3 px-6 text-left">VIP Capacity</th>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {data.timeSlots.filter(slot => slot.dayOfWeek.includes(selectedDay)).map(slot => (
              <tr key={slot.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left">{slot.startTime} - {slot.endTime}</td>
                <td className="py-3 px-6 text-left">{slot.totalCapacity}</td>
                <td className="py-3 px-6 text-left">{slot.publicCapacity}</td>
                <td className="py-3 px-6 text-left">{slot.schoolCapacity}</td>
                <td className="py-3 px-6 text-left">{slot.vipCapacity}</td>
                <td className="py-3 px-6 text-left max-w-xs truncate" title={slot.description}>{slot.description}</td>
                <td className="py-3 px-6 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <button onClick={() => openTimeSlotModal(slot)} className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 flex items-center justify-center transition-colors duration-200" title="Edit Time Slot">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleTimeSlotDelete(slot.id)} className="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition-colors duration-200" title="Delete Time Slot">
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isTimeSlotModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-xl w-11/12 relative animate-scale-in">
            <button
              onClick={closeTimeSlotModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <XCircle className="h-7 w-7" />
            </button>
            <h3 className="text-2xl font-bold mb-6 text-gray-800">{editingTimeSlot ? 'Edit Time Slot' : 'Add New Time Slot'}</h3>
            <form onSubmit={handleTimeSlotSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Start Time</label>
                  <input type="time" value={newTimeSlot.startTime} onChange={(e) => setNewTimeSlot({ ...newTimeSlot, startTime: e.target.value })} className="shadow-sm bg-white border border-gray-300 text-gray-900 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200" required />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">End Time</label>
                  <input type="time" value={newTimeSlot.endTime} onChange={(e) => setNewTimeSlot({ ...newTimeSlot, endTime: e.target.value })} className="shadow-sm bg-white border border-gray-300 text-gray-900 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200" required />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Total Capacity</label>
                  <input type="number" value={newTimeSlot.totalCapacity} onChange={(e) => setNewTimeSlot({ ...newTimeSlot, totalCapacity: parseInt(e.target.value) || 0 })} className="shadow-sm bg-white border border-gray-300 text-gray-900 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200" min="0" required />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Public Capacity</label>
                  <input type="number" value={newTimeSlot.publicCapacity} onChange={(e) => setNewTimeSlot({ ...newTimeSlot, publicCapacity: parseInt(e.target.value) || 0 })} className="shadow-sm bg-white border border-gray-300 text-gray-900 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200" min="0" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">School Capacity</label>
                  <input type="number" value={newTimeSlot.schoolCapacity} onChange={(e) => setNewTimeSlot({ ...newTimeSlot, schoolCapacity: parseInt(e.target.value) || 0 })} className="shadow-sm bg-white border border-gray-300 text-gray-900 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200" min="0" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">VIP Capacity</label>
                  <input type="number" value={newTimeSlot.vipCapacity} onChange={(e) => setNewTimeSlot({ ...newTimeSlot, vipCapacity: parseInt(e.target.value) || 0 })} className="shadow-sm bg-white border border-gray-300 text-gray-900 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200" min="0" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold mb-2">Days of Week</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {daysOfWeek.map(day => (
                    <label key={day} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        value={day}
                        checked={newTimeSlot.dayOfWeek.includes(day)}
                        onChange={(e) => {
                          const { checked, value } = e.target;
                          setNewTimeSlot(prev => ({
                            ...prev,
                            dayOfWeek: checked
                              ? [...prev.dayOfWeek, value]
                              : prev.dayOfWeek.filter(d => d !== value)
                          }));
                        }}
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-gray-700">{day}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">Description</label>
                <textarea value={newTimeSlot.description} onChange={(e) => setNewTimeSlot({ ...newTimeSlot, description: e.target.value })} className="shadow-sm bg-white border border-gray-300 text-gray-900 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 h-20"></textarea>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button type="button" onClick={closeTimeSlotModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400">
                  Cancel
                </button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <Save className="h-5 w-5 mr-2" /> {editingTimeSlot ? 'Update Time Slot' : 'Add Time Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-8 p-6 bg-white rounded-xl shadow-md">
        <h4 className="text-xl font-semibold text-gray-700 mb-4 flex items-center"><Calendar className="h-6 w-6 mr-3 text-green-600" /> Booking Window Control</h4>
        <p className="text-gray-600 mb-4">Modify how many days in advance visitors can book tickets.</p>
        <div className="flex items-center space-x-4">
          <label className="text-gray-700 font-semibold">Max Booking Window (Days):</label>
          <input
            type="number"
            value={data.systemSettings.maxBookingWindowDays}
            onChange={(e) => updateSetting('maxBookingWindowDays', parseInt(e.target.value) || 0)} // Using updateSetting for a system setting
            className="shadow-sm bg-white border border-gray-300 text-gray-900 rounded-md py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 w-24"
            min="0"
          />
          <button onClick={() => setMessage('Max Booking Window Saved!') & setMessageType('success')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <Save className="h-5 w-5 mr-2" /> Save
          </button>
        </div>
      </div>
    </div>
  );

  // --- Booking Overview Calendar (New Section) ---
  const today = new Date();
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];
    let currentDay = new Date(firstDay);
    while (currentDay <= lastDay) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    return days;
  };

  const padDays = (days) => {
    const firstDayOfWeek = days[0].getDay(); // 0 for Sunday, 1 for Monday
    const paddingStart = firstDayOfWeek; // Number of empty cells at the start

    const lastDayOfWeek = days[days.length - 1].getDay();
    const paddingEnd = (6 - lastDayOfWeek); // Number of empty cells at the end

    return [...Array(paddingStart).fill(null), ...days, ...Array(paddingEnd).fill(null)];
  };

  const getDailyStats = (date) => {
    const formattedDate = date.toISOString().split('T')[0]; //YYYY-MM-DD
    const dailyBookings = data.bookings.filter(b => b.date === formattedDate);
    const totalBookings = dailyBookings.reduce((sum, b) => sum + b.ticketCount, 0);

    // Simulate total capacity for the day (can be improved by summing slot capacities)
    const totalDayCapacity = data.timeSlots.reduce((sum, slot) => {
        if (slot.dayOfWeek.includes(new Date(formattedDate).toLocaleString('en-US', { weekday: 'long' }))) {
            return sum + slot.totalCapacity;
        }
        return sum;
    }, 0);

    const utilization = totalDayCapacity > 0 ? (totalBookings / totalDayCapacity) * 100 : 0;
    const availableSlots = Math.max(0, totalDayCapacity - totalBookings);

    let colorCode = 'bg-green-200 text-green-800'; // Low utilization
    if (utilization > 50 && utilization <= 80) {
      colorCode = 'bg-yellow-200 text-yellow-800'; // Medium utilization
    } else if (utilization > 80) {
      colorCode = 'bg-red-200 text-red-800'; // High utilization
    }

    return { totalBookings, availableSlots, utilization: utilization.toFixed(0), colorCode, totalDayCapacity };
  };

  const BookingOverviewCalendar = () => {
    const days = padDays(getDaysInMonth(calendarMonth));

    const handlePrevMonth = () => {
      setCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
      setCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    return (
      <div className="p-8 bg-gray-50 rounded-xl shadow-md">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><Calendar className="h-6 w-6 mr-3 text-blue-600" /> Booking Overview Calendar</h3>
        <p className="text-gray-600 mb-4">Visual representation of booking density and availability.</p>

        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
          >
            <Minus className="h-5 w-5 text-gray-600" />
          </button>
          <span className="text-lg font-semibold text-gray-800">
            {calendarMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
          >
            <Plus className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-500 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-2">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 text-sm">
          {days.map((day, index) => {
            if (!day) return <div key={index} className="p-2"></div>;

            const isCurrentMonth = day.getMonth() === calendarMonth.getMonth();
            const isToday = day.toDateString() === today.toDateString();
            const { totalBookings, availableSlots, utilization, colorCode, totalDayCapacity } = getDailyStats(day);

            return (
              <div
                key={index}
                className={`p-2 rounded-md h-24 flex flex-col justify-between items-center
                  ${isCurrentMonth ? 'bg-white' : 'bg-gray-100 text-gray-400'}
                  ${isToday ? 'border-2 border-blue-500' : ''}
                  ${colorCode}
                  hover:shadow-lg transition-shadow duration-200 cursor-pointer
                `}
                title={`Details for ${day.toDateString()}: Total Bookings: ${totalBookings}, Available Slots: ${availableSlots}, Total Capacity: ${totalDayCapacity}`}
                // onClick={() => alert(`Details for ${day.toDateString()}: Total Bookings: ${totalBookings}, Available Slots: ${availableSlots}`)}
              >
                <span className={`font-bold ${isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}`}>{day.getDate()}</span>
                {totalDayCapacity > 0 && isCurrentMonth && (
                    <div className="text-center text-xs mt-1">
                        <p className="font-semibold">{totalBookings} booked</p>
                        <p className="text-gray-600">{availableSlots} available</p>
                        <p className="text-gray-700">{utilization}% util.</p>
                    </div>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-sm text-gray-600 mt-4 text-center">Color indicates capacity utilization: Green (low), Yellow (medium), Red (high).</p>
      </div>
    );
  };


  // --- Placeholder Sections ---
  const AddOnManagementSection = () => (
    <div className="p-8 bg-gray-50 rounded-xl shadow-md">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><Plus className="h-6 w-6 mr-3 text-teal-600" /> Add-On Management</h3>
      <p className="text-gray-600 mb-4">Add-on configuration is managed in a dedicated section.</p>
      <p className="text-blue-600 italic">Please navigate to the "Add-on Management" section in the sidebar for full functionality.</p>
      {/* You could optionally embed a simplified view here or link directly */}
      <div className="mt-4 overflow-x-auto bg-white rounded-xl shadow-sm">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Price</th>
              <th className="py-3 px-6 text-left">Active</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {data.addOns.map(addOn => (
              <tr key={addOn.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left">{addOn.name}</td>
                <td className="py-3 px-6 text-left">${addOn.price.toFixed(2)}</td>
                <td className="py-3 px-6 text-left">{addOn.isActive ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const DiscountPromotionManagement = () => {
    const { data, addData, updateData, deleteData, simulateApiCall } = useContext(AdminDashboardContext);
    const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
    const [editingDiscount, setEditingDiscount] = useState(null);
    const [newDiscount, setNewDiscount] = useState({
        code: '',
        type: 'percentage',
        value: 0,
        minTickets: 1,
        expiryDate: '',
        isActive: true,
        usageLimit: null,
        currentUsage: 0,
    });

    const openDiscountModal = (discount = null) => {
        setEditingDiscount(discount);
        const initialState = {
            code: '',
            type: 'percentage',
            value: 0,
            minTickets: 1,
            expiryDate: '',
            isActive: true,
            usageLimit: null,
            currentUsage: 0,
        };
        setNewDiscount(discount ? { ...discount } : initialState);
        setIsDiscountModalOpen(true);
        setMessage('');
    };

    const closeDiscountModal = () => {
        setIsDiscountModalOpen(false);
        setEditingDiscount(null);
    };

    const handleDiscountSubmit = async (e) => {
        e.preventDefault();
        if (!newDiscount.code || newDiscount.value <= 0) {
            setMessage('Discount Code and a value greater than 0 are required.');
            setMessageType('error');
            return;
        }

        await simulateApiCall(() => {
            const discountData = {
              ...newDiscount,
              value: parseFloat(newDiscount.value),
              minTickets: parseInt(newDiscount.minTickets),
              usageLimit: newDiscount.usageLimit ? parseInt(newDiscount.usageLimit) : null,
            };

            if (editingDiscount) {
                updateData('discounts', editingDiscount.id, discountData);
                setMessage('Discount updated successfully!');
            } else {
                addData('discounts', discountData);
                setMessage('Discount added successfully!');
            }
            setMessageType('success');
        });
        closeDiscountModal();
    };

    const handleDiscountDelete = (id) => {
        openConfirmModal(
            'Are you sure you want to delete this discount?',
            async () => {
                await simulateApiCall(() => {
                    deleteData('discounts', id);
                    setMessage('Discount deleted successfully!');
                    setMessageType('success');
                });
            },
            'danger'
        );
    };

    const handleToggleActive = async (discount) => {
        await simulateApiCall(() => {
            updateData('discounts', discount.id, { isActive: !discount.isActive });
            setMessage(`Discount ${discount.code} has been ${!discount.isActive ? 'activated' : 'deactivated'}.`);
            setMessageType('success');
        });
    };

    return (
        <div className="p-8 bg-gray-50 rounded-xl shadow-md">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><Percent className="h-6 w-6 mr-3 text-pink-600" /> Discount & Promotion Management</h3>
            <p className="text-gray-600 mb-4">Create and manage discount codes, rule-based offers, and partner promotions.</p>
            <button
                onClick={() => openDiscountModal()}
                className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-lg flex items-center mb-6 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
                <Plus className="h-5 w-5 mr-2" /> Add New Discount
            </button>

            <div className="overflow-x-auto bg-white rounded-xl shadow-md">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">Code</th>
                            <th className="py-3 px-6 text-left">Type</th>
                            <th className="py-3 px-6 text-left">Value</th>
                            <th className="py-3 px-6 text-left">Expiry Date</th>
                            <th className="py-3 px-6 text-left">Status</th>
                            <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 text-sm">
                        {data.discounts.map(discount => (
                            <tr key={discount.id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left font-mono">{discount.code}</td>
                                <td className="py-3 px-6 text-left capitalize">{discount.type.replace('_', ' ')}</td>
                                <td className="py-3 px-6 text-left">{discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value.toFixed(2)}`}</td>
                                <td className="py-3 px-6 text-left">{discount.expiryDate || 'No Expiry'}</td>
                                <td className="py-3 px-6 text-left">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${discount.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {discount.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="py-3 px-6 text-center">
                                    <div className="flex items-center justify-center space-x-2">
                                        <button onClick={() => handleToggleActive(discount)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 border ${discount.isActive ? 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200' : 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200'}`} title={discount.isActive ? 'Deactivate' : 'Activate'}>
                                            {discount.isActive ? 
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m4.93 4.93 14.14 14.14"/></svg>
                                                : 
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64A9 9 0 1 1 5.64 6.64"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
                                            }
                                        </button>
                                        <button onClick={() => openDiscountModal(discount)} className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-300 hover:bg-yellow-200 flex items-center justify-center transition-colors duration-200" title="Edit Discount">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                        </button>
                                        <button onClick={() => handleDiscountDelete(discount.id)} className="w-8 h-8 rounded-full bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 flex items-center justify-center transition-colors duration-200" title="Delete Discount">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isDiscountModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white p-8 rounded-xl shadow-2xl max-w-xl w-11/12 relative animate-scale-in">
                        <button onClick={closeDiscountModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"><XCircle className="h-7 w-7" /></button>
                        <h3 className="text-2xl font-bold mb-6 text-gray-800">{editingDiscount ? 'Edit Discount' : 'Add New Discount'}</h3>
                        <form onSubmit={handleDiscountSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2">Discount Code</label>
                                    <input type="text" value={newDiscount.code} onChange={(e) => setNewDiscount({ ...newDiscount, code: e.target.value.toUpperCase() })} className="shadow-sm bg-white border border-gray-300 text-gray-900 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition duration-200" required />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2">Discount Type</label>
                                    <select value={newDiscount.type} onChange={(e) => setNewDiscount({ ...newDiscount, type: e.target.value })} className="shadow-sm bg-white border border-gray-300 text-gray-900 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition duration-200">
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount ($)</option>
                                        <option value="auto_birthday">Auto Birthday</option>
                                        <option value="partner">Partner</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2">Value</label>
                                    <input type="number" step="0.01" value={newDiscount.value} onChange={(e) => setNewDiscount({ ...newDiscount, value: e.target.value })} className="shadow-sm bg-white border border-gray-300 text-gray-900 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition duration-200" min="0" required />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2">Min. Tickets Required</label>
                                    <input type="number" value={newDiscount.minTickets} onChange={(e) => setNewDiscount({ ...newDiscount, minTickets: e.target.value })} className="shadow-sm bg-white border border-gray-300 text-gray-900 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition duration-200" min="1" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2">Expiry Date</label>
                                    <input type="date" value={newDiscount.expiryDate} onChange={(e) => setNewDiscount({ ...newDiscount, expiryDate: e.target.value })} className="shadow-sm bg-white border border-gray-300 text-gray-900 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition duration-200" />
                                </div>
                                 <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2">Usage Limit (optional)</label>
                                    <input type="number" value={newDiscount.usageLimit || ''} onChange={(e) => setNewDiscount({ ...newDiscount, usageLimit: e.target.value })} className="shadow-sm bg-white border border-gray-300 text-gray-900 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition duration-200" min="0" />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-4 mt-6">
                                <button type="button" onClick={closeDiscountModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors duration-200">Cancel</button>
                                <button type="submit" className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors duration-200 shadow-md"><Save className="h-5 w-5 mr-2" /> {editingDiscount ? 'Update Discount' : 'Add Discount'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

  // Helper to generate unique IDs for new pricing rules
  const generateUniqueId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const CustomPricingModels = () => {
    // State for bulk pricing modal
    const [isBulkPricingModalOpen, setIsBulkPricingModalOpen] = useState(false);
    const [editingBulkRule, setEditingBulkRule] = useState(null);
    const [newBulkRule, setNewBulkRule] = useState({
      minTickets: 0, maxTickets: null, discountPercentage: 0, type: 'group'
    });

    // Helper to open bulk pricing modal
    const openBulkPricingModal = (rule = null) => {
      setEditingBulkRule(rule);
      setNewBulkRule(rule ? { ...rule } : { minTickets: 0, maxTickets: null, discountPercentage: 0, type: 'group' });
      setIsBulkPricingModalOpen(true);
      setMessage('');
    };

    // Helper to close bulk pricing modal
    const closeBulkPricingModal = () => {
      setIsBulkPricingModalOpen(false);
      setEditingBulkRule(null);
      setNewBulkRule({ minTickets: 0, maxTickets: null, discountPercentage: 0, type: 'group' });
    };

    // Handle submit for bulk pricing rules
    const handleBulkPricingSubmit = async (e) => {
      e.preventDefault();
      setMessage('');
      if (newBulkRule.minTickets < 0 || newBulkRule.discountPercentage < 0) {
        setMessage('Min Tickets and Discount Percentage must be non-negative.');
        setMessageType('error');
        return;
      }
      if (newBulkRule.maxTickets !== null && newBulkRule.maxTickets < newBulkRule.minTickets) {
        setMessage('Max Tickets cannot be less than Min Tickets.');
        setMessageType('error');
        return;
      }

      await simulateApiCall(() => {
        let updatedBulkPricing;
        if (editingBulkRule) {
          updatedBulkPricing = data.pricingModels.bulkPricing.map(rule =>
            rule.id === editingBulkRule.id ? { ...newBulkRule, id: rule.id } : rule
          );
          setMessage('Bulk pricing rule updated successfully!');
        } else {
          updatedBulkPricing = [...data.pricingModels.bulkPricing, { ...newBulkRule, id: generateUniqueId() }];
          setMessage('Bulk pricing rule added successfully!');
        }
        // This assumes updateData can handle updating a nested array by replacing the whole array.
        // In a real app, you might have a dedicated updatePricingModels or a more flexible updateData.
        updateData('pricingModels', 'bulkPricing', updatedBulkPricing); // This won't work as is.
        // As a workaround given the current context functions, we must replace the whole pricingModels object.
        updateSetting('pricingModels', { // THIS IS THE CRITICAL ASSUMPTION/WORKAROUND
          ...data.pricingModels,
          bulkPricing: updatedBulkPricing
        });
        setMessageType('success');
      });
      closeBulkPricingModal();
    };

    // Handle delete for bulk pricing rules
    const handleBulkPricingDelete = (id) => {
      openConfirmModal(
        'Are you sure you want to delete this bulk pricing rule?',
        async () => {
          await simulateApiCall(() => {
            const updatedBulkPricing = data.pricingModels.bulkPricing.filter(rule => rule.id !== id);
            updateSetting('pricingModels', { // WORKAROUND: update entire pricingModels object
              ...data.pricingModels,
              bulkPricing: updatedBulkPricing
            });
            setMessage('Bulk pricing rule deleted successfully!');
            setMessageType('success');
          });
        },
        'danger'
      );
    };

    // Handle changes for student pricing
    const handleStudentPricingChange = async (field, value) => {
      await simulateApiCall(() => {
        const updatedStudentPricing = {
          ...data.pricingModels.studentPricing,
          [field]: value
        };
        updateSetting('pricingModels', { // WORKAROUND: update entire pricingModels object
          ...data.pricingModels,
          studentPricing: updatedStudentPricing
        });
        setMessage('Student pricing setting updated successfully!');
        setMessageType('success');
      });
    };


    return (
      <div className="p-8 bg-gray-50 rounded-xl shadow-md">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><DollarSign className="h-6 w-6 mr-3 text-yellow-600" /> Custom Pricing Models</h3>
        <p className="text-gray-600 mb-4">Configure tiered pricing for large groups and special student rates.</p>

        {/* Bulk Pricing Configuration */}
        <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <h4 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <ClipboardList className="h-5 w-5 mr-2 text-blue-600" /> Bulk Pricing Configuration
          </h4>
          <p className="text-gray-600 mb-4">Set up tiered pricing based on ticket quantity for different group types.</p>
          <button
            onClick={() => openBulkPricingModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center mb-6 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Plus className="h-5 w-5 mr-2" /> Add New Bulk Rule
          </button>
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Min Tickets</th>
                  <th className="py-3 px-6 text-left">Max Tickets</th>
                  <th className="py-3 px-6 text-left">Discount (%)</th>
                  <th className="py-3 px-6 text-left">Type</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm">
                {data.pricingModels?.bulkPricing?.length > 0 ? (
                  data.pricingModels.bulkPricing.map((rule) => (
                    <tr key={rule.id || generateUniqueId()} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-6 text-left">{rule.minTickets}</td>
                      <td className="py-3 px-6 text-left">{rule.maxTickets === null ? 'No Max' : rule.maxTickets}</td>
                      <td className="py-3 px-6 text-left">{rule.discountPercentage}%</td>
                      <td className="py-3 px-6 text-left capitalize">{rule.type}</td>
                      <td className="py-3 px-6 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button onClick={() => openBulkPricingModal(rule)} className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 flex items-center justify-center transition-colors duration-200" title="Edit Rule">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleBulkPricingDelete(rule.id || rule.minTickets)} className="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition-colors duration-200" title="Delete Rule">
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-4 text-center text-gray-500">No bulk pricing rules defined.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bulk Pricing Modal */}
        {isBulkPricingModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-xl w-11/12 relative animate-scale-in">
              <button
                onClick={closeBulkPricingModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <XCircle className="h-7 w-7" />
              </button>
              <h3 className="text-2xl font-bold mb-6 text-gray-800">{editingBulkRule ? 'Edit Bulk Pricing Rule' : 'Add New Bulk Pricing Rule'}</h3>
              <form onSubmit={handleBulkPricingSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Min Tickets</label>
                    <input type="number" value={newBulkRule.minTickets} onChange={(e) => setNewBulkRule({ ...newBulkRule, minTickets: parseInt(e.target.value) || 0 })} className="shadow-sm bg-white border border-gray-300 text-gray-900 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" min="0" required />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Max Tickets (Leave blank for no max)</label>
                    <input type="number" value={newBulkRule.maxTickets === null ? '' : newBulkRule.maxTickets} onChange={(e) => setNewBulkRule({ ...newBulkRule, maxTickets: e.target.value === '' ? null : parseInt(e.target.value) })} className="shadow-sm bg-white border border-gray-300 text-gray-900 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" min="0" />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Discount Percentage (%)</label>
                    <input type="number" step="0.01" value={newBulkRule.discountPercentage} onChange={(e) => setNewBulkRule({ ...newBulkRule, discountPercentage: parseFloat(e.target.value) || 0 })} className="shadow-sm bg-white border border-gray-300 text-gray-900 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" min="0" max="100" required />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Type</label>
                    <select value={newBulkRule.type} onChange={(e) => setNewBulkRule({ ...newBulkRule, type: e.target.value })} className="shadow-sm bg-white border border-gray-300 text-gray-900 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" required>
                      <option value="group">Group</option>
                      <option value="corporate">Corporate</option>
                      <option value="seasonal">Seasonal</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <button type="button" onClick={closeBulkPricingModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400">
                    Cancel
                  </button>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <Save className="h-5 w-5 mr-2" /> {editingBulkRule ? 'Update Rule' : 'Add Rule'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Student Pricing Configuration */}
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <h4 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <GraduationCap className="h-5 w-5 mr-2 text-green-600" /> Student Pricing
          </h4>
          <p className="text-gray-600 mb-4">Configure reduced pricing for verified students.</p>
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
              <span className="text-gray-800 font-medium">Student Pricing Enabled:</span>
              <button
                onClick={() => handleStudentPricingChange('enabled', !data.pricingModels.studentPricing.enabled)}
                className={`toggle-button ${data.pricingModels.studentPricing.enabled ? 'active' : ''}`}
              >
                <span className="toggle-button-handle" />
              </button>
            </div>

            <div className="bg-gray-50 p-3 rounded-md">
              <label className="block text-gray-700 text-sm font-semibold mb-2">Discount Percentage (%)</label>
              <input
                type="number"
                step="0.01"
                value={data.pricingModels.studentPricing.discountPercentage}
                onChange={(e) => handleStudentPricingChange('discountPercentage', parseFloat(e.target.value) || 0)}
                className="shadow-sm bg-white border border-gray-300 text-gray-900 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                min="0"
                max="100"
              />
            </div>

            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
              <span className="text-gray-800 font-medium">Verification Required:</span>
              <button
                onClick={() => handleStudentPricingChange('requiredVerification', !data.pricingModels.studentPricing.requiredVerification)}
                className={`toggle-button ${data.pricingModels.studentPricing.requiredVerification ? 'active' : ''}`}
              >
                <span className="toggle-button-handle" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };


  const PlatformControl = () => (
    <div className="p-8 bg-gray-50 rounded-xl shadow-md">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><Settings className="h-6 w-6 mr-3 text-gray-600" /> Platform Control</h3>
      <p className="text-gray-600 mb-4">Enable or disable booking capabilities per platform and manage unique identifiers.</p>

      <div className="mb-6">
        <h4 className="text-xl font-semibold text-gray-700 mb-3">Platform Status</h4>
        <p className="text-gray-600 mb-3">Toggle booking capabilities for different platforms.</p>
        <div className="space-y-4">
          {data.platforms.map((platform, index) => (
            <div key={platform.id} className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
              <span className="text-gray-800 font-medium flex items-center">
                {platform.type === 'digital' && <Laptop className="h-5 w-5 mr-2 text-blue-500" />}
                {platform.type === 'physical' && platform.name.includes('Kiosk') && <Tablet className="h-5 w-5 mr-2 text-green-500" />}
                {platform.type === 'physical' && platform.name.includes('Counter') && <Building className="h-5 w-5 mr-2 text-purple-500" />}
                {platform.name}
              </span>
              <button
                onClick={async () => {
                  // Simulate API call to update platform status
                  await simulateApiCall(() => {
                    const updatedPlatforms = data.platforms.map((p, i) =>
                      i === index ? { ...p, isEnabled: !p.isEnabled } : p
                    );
                    // This assumes updateData can handle updating an array within 'data' by replacing it
                    // Or ideally, a specific function for platform updates.
                    // As a workaround, we would need to pass the entire data object to a setData function
                    // that is not exposed via current context, or use updateSetting if platforms was directly under systemSettings.
                    // For now, this acts as a visual toggle and simulates save.
                    // A proper implementation would require a dedicated updatePlatforms function in data.js
                    updateSetting('platforms', updatedPlatforms); // Assuming 'platforms' can be a top-level setting key. This is a workaround.
                    setMessage(`Platform ${platform.name} ${platform.isEnabled ? 'disabled' : 'enabled'}!`);
                    setMessageType('success');
                  });
                }}
                className={`toggle-button ${platform.isEnabled ? 'active' : ''}`}
              >
                <span className="toggle-button-handle" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xl font-semibold text-gray-700 mb-3">Unique Platform Identifiers</h4>
        <p className="text-gray-600 mb-3">Manage IDs for physical units for granular tracking.</p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          {data.platforms.filter(p => p.type === 'physical').map(p => (
            <li key={p.id}>{p.name}: <span className="font-mono bg-gray-100 p-1 rounded-md text-sm">{p.id}</span> {p.location && `(${p.location})`}</li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'manageBookings':
        return (
          <>
            <div className="bg-white p-6 rounded-xl shadow-md mb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Filter Bookings</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Search (User Name, Booking ID)</label>
                  <input
                    type="text"
                    className="shadow-sm bg-white border border-gray-300 text-gray-900 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Status</label>
                  <select
                    className="shadow-sm bg-white border border-gray-300 text-gray-900 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All</option>
                    <option value="Booked">Booked</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Used">Used</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Approved (Bulk)">Approved (Bulk)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Date</label>
                  <input
                    type="date"
                    className="shadow-sm bg-white border border-gray-300 text-gray-900 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  />
                </div>
              </div>
              <button
                onClick={() => openBookingModal()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Plus className="h-5 w-5 mr-2" /> Add New Booking
              </button>
            </div>

            <div className="overflow-x-auto bg-white rounded-xl shadow-md">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Booking ID</th>
                    <th className="py-3 px-6 text-left">User Name</th>
                    <th className="py-3 px-6 text-left">Ticket Type</th>
                    <th className="py-3 px-6 text-left">Date</th>
                    <th className="py-3 px-6 text-left">Amount</th>
                    <th className="py-3 px-6 text-left">Status</th>
                    <th className="py-3 px-6 text-left">Add-ons</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm">
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-gray-200 hover:bg-gray-100">
                        <td className="py-3 px-6 text-left whitespace-nowrap">{booking.id.substring(0, 8)}...</td>
                        <td className="py-3 px-6 text-left">{booking.userName}</td>
                        <td className="py-3 px-6 text-left">{data.ticketTypes.find(t => t.id === booking.ticketTypeId)?.name || 'N/A'}</td>
                        <td className="py-3 px-6 text-left">{booking.date}</td>
                        <td className="py-3 px-6 text-left">${booking.amount.toFixed(2)}</td>
                        <td className="py-3 px-6 text-left">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status.includes('Confirmed') || booking.status.includes('Approved') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-left">
                          {booking.addOns.length > 0 ? booking.addOns.map(a => `${a.name} (x${a.quantity})`).join(', ') : 'None'}
                        </td>
                        <td className="py-3 px-6 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button onClick={() => openBookingModal(booking)} className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 flex items-center justify-center transition-colors duration-200" title="Edit Booking">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleBookingDelete(booking.id)} className="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition-colors duration-200" title="Delete Booking">
                              <Trash className="h-4 w-4" />
                            </button>
                            {booking.status === 'Booked' && (
                              <button onClick={() => handleBulkBookingApproval(booking.id)} className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 flex items-center justify-center transition-colors duration-200" title="Approve Bulk Booking">
                                <CheckCircle className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="py-4 text-center text-gray-500">No bookings found matching your criteria.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {isBookingModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in">
                <div className="bg-white p-8 rounded-xl shadow-2xl max-w-3xl w-11/12 relative animate-scale-in">
                  <button
                    onClick={closeBookingModal}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <XCircle className="h-7 w-7" />
                  </button>
                  <h3 className="text-2xl font-bold mb-6 text-gray-800">{editingBooking ? 'Edit Booking' : 'Add New Booking'}</h3>
                  <form onSubmit={handleBookingSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2">User Name</label>
                        <input type="text" value={newBooking.userName} onChange={(e) => setNewBooking({ ...newBooking, userName: e.target.value })} className="shadow-sm bg-white border border-gray-300 text-gray-900 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" required />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Ticket Type</label>
                        <select value={newBooking.ticketTypeId} onChange={(e) => setNewBooking({ ...newBooking, ticketTypeId: e.target.value })} className="shadow-sm bg-white border border-gray-300 text-gray-900 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" required>
                          <option value="">Select Ticket Type</option>
                          {data.ticketTypes.map(type => (
                            <option key={type.id} value={type.id}>{type.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Date</label>
                        <input type="date" value={newBooking.date} onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })} className="shadow-sm bg-white border border-gray-300 text-gray-900 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" required />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Time</label>
                        <input type="time" value={newBooking.time} onChange={(e) => setNewBooking({ ...newBooking, time: e.target.value })} className="shadow-sm bg-white border border-gray-300 text-gray-900 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Amount</label>
                        <input type="number" step="0.01" value={newBooking.amount} onChange={(e) => setNewBooking({ ...newBooking, amount: parseFloat(e.target.value) })} className="shadow-sm bg-white border border-gray-300 text-gray-900 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" required />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Status</label>
                        <select value={newBooking.status} onChange={(e) => setNewBooking({ ...newBooking, status: e.target.value })} className="shadow-sm bg-white border border-gray-300 text-gray-900 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200">
                          <option value="Booked">Booked</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Used">Used</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="Approved (Bulk)">Approved (Bulk)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Platform</label>
                        <select value={newBooking.platform} onChange={(e) => setNewBooking({ ...newBooking, platform: e.target.value })} className="shadow-sm bg-white border border-gray-300 text-gray-900 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200">
                          <option value="Online">Online</option>
                          <option value="Kiosk">Kiosk</option>
                          <option value="Counter">Counter</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Ticket Count</label>
                        <input type="number" value={newBooking.ticketCount} onChange={(e) => setNewBooking({ ...newBooking, ticketCount: parseInt(e.target.value) })} className="shadow-sm bg-white border border-gray-300 text-gray-900 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" min="1" />
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-lg font-semibold text-gray-700 mb-2">Add-ons</h4>
                      {newBooking.addOns.map((ao, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-2">
                          <select value={ao.id} onChange={(e) => handleAddOnChange(index, 'id', e.target.value)} className="shadow-sm bg-white border border-gray-300 text-gray-900 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 flex-grow">
                            <option value="">Select Add-on</option>
                            {data.addOns.map(addon => (
                              <option key={addon.id} value={addon.id}>{addon.name}</option>
                            ))}
                          </select>
                          <input type="number" value={ao.quantity} onChange={(e) => handleAddOnChange(index, 'quantity', parseInt(e.target.value))} placeholder="Quantity" className="shadow-sm bg-white border border-gray-300 text-gray-900 rounded-md py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 w-24" min="1" />
                          <button type="button" onClick={() => removeAddOnFromBooking(index)} className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200">
                            <Minus className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                      <button type="button" onClick={addAddOnToBooking} className="text-blue-600 hover:text-blue-800 flex items-center mt-2 focus:outline-none">
                        <Plus className="h-5 w-5 mr-1" /> Add Add-on
                      </button>
                    </div>

                    <div className="flex justify-end space-x-4 mt-6">
                      <button type="button" onClick={closeBookingModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400">
                        Cancel
                      </button>
                      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <Save className="h-5 w-5 mr-2" /> {editingBooking ? 'Update Booking' : 'Add Booking'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        );
      case 'ticketTypes':
        return <TicketTypeManagement />;
      case 'addOns':
        return <AddOnManagementSection />;
      case 'timeSlotsCapacity':
        return <TimeSlotCapacityManagement />;
      case 'bookingCalendar':
        return <BookingOverviewCalendar />;
      case 'spotBooking':
        return <SpotBookingDashboard />; 
      case 'discountsPromotions':
        return <DiscountPromotionManagement />;
      case 'customPricing':
        return <CustomPricingModels />;
      case 'platformControl':
        return <PlatformControl />;
      default:
        return null;
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen md:pb-24">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Booking & Operations Management</h2>

      {message && (
        <div className={`p-4 mb-6 rounded-lg flex items-center ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {messageType === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <XCircle className="h-5 w-5 mr-2" />}
          {message}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('manageBookings')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${activeTab === 'manageBookings' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Manage Bookings
        </button>
        <button
          onClick={() => setActiveTab('ticketTypes')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${activeTab === 'ticketTypes' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Ticket Types
        </button>
        <button
          onClick={() => setActiveTab('addOns')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${activeTab === 'addOns' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Add-Ons
        </button>
        <button
          onClick={() => setActiveTab('timeSlotsCapacity')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${activeTab === 'timeSlotsCapacity' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Time Slots & Capacity
        </button>
        <button
          onClick={() => setActiveTab('bookingCalendar')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${activeTab === 'bookingCalendar' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Booking Calendar
        </button>
        <button
          onClick={() => setActiveTab('discountsPromotions')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${activeTab === 'discountsPromotions' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Discounts & Promotions
        </button>
        <button
          onClick={() => setActiveTab('customPricing')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${activeTab === 'customPricing' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Custom Pricing
        </button>
        <button
          onClick={() => setActiveTab('spotBooking')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${activeTab === 'spotBooking' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Spot Booking
        </button>
        <button
          onClick={() => setActiveTab('platformControl')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${activeTab === 'platformControl' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Platform Control
        </button>
      </div>

      {renderContent()}

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        message={confirmModalMessage}
        onConfirm={handleConfirm}
        onCancel={handleCancelConfirm}
        type={confirmModalType}
      />
    </div>
  );
};

export default BookingsManagement;
