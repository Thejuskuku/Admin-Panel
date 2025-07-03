import React, { useState, useContext } from 'react';
import { AdminDashboardContext } from '../App';
import UserProfileModal from './UserProfileModal';
import {
  UserPlus, Edit, Trash, CheckCircle, XCircle, Eye, UserX, Save, UserRoundCog, List, Award, UserRound
} from 'lucide-react';

const UsersManagement = () => {
  const { data, updateData, addData, deleteData, simulateApiCall } = useContext(AdminDashboardContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: '', email: '', phone: '', type: 'Full User', status: 'Active', parentId: null,
    pointsEarned: 0, zonesCovered: [], numVisits: 0,
    facePhotoStatus: 'Pending', // New field for photo status
    seasonalPass: false, // New field for seasonal pass
    lastLogin: null // Will be updated on new user creation for consistency, but not editable
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  // Profile modal states
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedUserForProfile, setSelectedUserForProfile] = useState(null);

  const openModal = (user = null) => {
    setEditingUser(user);
    setNewUser(user ? {
      ...user,
      pointsEarned: user.pointsEarned !== undefined ? user.pointsEarned : 0,
      zonesCovered: user.zonesCovered !== undefined ? user.zonesCovered : [],
      numVisits: user.numVisits !== undefined ? user.numVisits : 0,
      parentId: user.parentId !== undefined ? user.parentId : null,
      facePhotoStatus: user.facePhotoStatus || 'Pending', // Default if not set
      seasonalPass: user.seasonalPass !== undefined ? user.seasonalPass : false, // Default if not set
    } : {
      name: '', email: '', phone: '', type: 'Full User', status: 'Active', parentId: null,
      pointsEarned: 0, zonesCovered: [], numVisits: 0,
      facePhotoStatus: 'Pending',
      seasonalPass: false,
      lastLogin: null
    });
    setIsModalOpen(true);
    setMessage('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setNewUser({
      name: '', email: '', phone: '', type: 'Full User', status: 'Active', parentId: null,
      pointsEarned: 0, zonesCovered: [], numVisits: 0,
      facePhotoStatus: 'Pending',
      seasonalPass: false,
      lastLogin: null
    });
  };

  const openProfileModal = (user) => {
    setSelectedUserForProfile(user);
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
    setSelectedUserForProfile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!newUser.name || !newUser.email || !newUser.phone) {
      setMessage('Name, Email, and Phone are required.');
      setMessageType('error');
      return;
    }
    if (newUser.type === 'Dependent' && !newUser.parentId) {
      setMessage('Dependent users must have a Parent Account selected.');
      setMessageType('error');
      return;
    }

    await simulateApiCall(() => {
      let finalNewUser = { ...newUser };
      if (finalNewUser.type === 'Dependent' && finalNewUser.parentId) {
        const parent = data.users.find(u => u.id === finalNewUser.parentId);
        if (parent) {
          finalNewUser.phone = parent.phone;
        }
      }
      if (!editingUser) {
        // Set lastLogin for new users upon creation
        finalNewUser.lastLogin = new Date().toISOString();
      }


      if (editingUser) {
        updateData('users', editingUser.id, finalNewUser);
        setMessage('User updated successfully!');
      } else {
        addData('users', finalNewUser);
        setMessage('User added successfully!');
      }
      setMessageType('success');
    });
    closeModal();
  };

  const handleDelete = async (id) => {
    const hasDependents = data.users.some(user => user.parentId === id);
    if (hasDependents) {
      setMessage('Cannot delete a Full User account that has active dependent accounts linked to it. Please delete dependent accounts first.');
      setMessageType('error');
      return;
    }

    if (window.confirm('Are you sure you want to delete this user? This cannot be undone.')) {
      await simulateApiCall(() => {
        deleteData('users', id);
        setMessage('User deleted successfully!');
        setMessageType('success');
      });
    }
  };

  const handleStatusToggle = async (user) => {
    await simulateApiCall(() => {
      updateData('users', user.id, { status: user.status === 'Active' ? 'Suspended' : 'Active' });
      setMessage(`User ${user.name} status updated to ${user.status === 'Active' ? 'Suspended' : 'Active'}!`);
      setMessageType('success');
    });
  };

  const filteredUsers = data.users.filter(user => {
    const matchesSearch = searchTerm === '' ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    const matchesType = typeFilter === 'All' || user.type === typeFilter;

    // Exclude Admin accounts from the table display
    const excludeAdmin = user.type !== 'Admin';

    return matchesSearch && matchesStatus && matchesType && excludeAdmin;
  });

  const fullUserAccounts = data.users.filter(user => user.type === 'Full User' || user.type === 'Admin');


  return (
    <div className="p-8 bg-gray-50 min-h-screen md:pb-24">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Visitor Management</h2>

      {message && (
        <div className={`p-4 mb-6 rounded-lg flex items-center ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {messageType === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <XCircle className="h-5 w-5 mr-2" />}
          {message}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Filter Visitors</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Search (Name, Email, Phone, ID)</label>
            <input
              type="text"
              className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              placeholder="Search visitors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Status</label>
            <select
              className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Visitor Type</label>
            <select
              className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Full User">Full Visitor</option>
              <option value="Dependent">Dependent</option>
              {/* Admin option removed from filter as they are excluded from the table */}
            </select>
          </div>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <UserPlus className="h-5 w-5 mr-2" /> Add New Visitor
        </button>
        <p className="text-sm text-gray-600 mt-4">Total Visitors (excluding Admins): {filteredUsers.length}</p>
      </div>


      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Visitor ID</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Phone</th>
              <th className="py-3 px-6 text-left">Type</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Photo Status</th> {/* New Column */}
              <th className="py-3 px-6 text-left">Seasonal Pass</th> {/* New Column */}
              <th className="py-3 px-6 text-left">Last Visit</th>    {/* New Column */}
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{user.id.substring(0, 8)}...</td>
                  <td className="py-3 px-6 text-left">{user.name}</td>
                  <td className="py-3 px-6 text-left">{user.email}</td>
                  <td className="py-3 px-6 text-left">{user.phone}</td>
                  <td className="py-3 px-6 text-left">{user.type}</td>
                  <td className="py-3 px-6 text-left">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-left">{user.facePhotoStatus || 'Pending'}</td> {/* Display Photo Status */}
                  <td className="py-3 px-6 text-left">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.seasonalPass ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}`}>
                      {user.seasonalPass ? 'Opted In' : 'Opted Out'}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-left">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center space-x-2">
                      <button onClick={() => openProfileModal(user)} className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center transition-colors duration-200" title="View Profile">
                        <Eye className="h-5 w-5 flex-shrink-0" />
                      </button>
                      <button onClick={() => openModal(user)} className="w-9 h-9 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 flex items-center justify-center transition-colors duration-200" title="Edit Visitor">
                        <Edit className="h-5 w-5 flex-shrink-0" />
                      </button>
                      <button onClick={() => handleDelete(user.id)} className="w-9 h-9 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition-colors duration-200" title="Delete Visitor">
                        <Trash className="h-5 w-5 flex-shrink-0" />
                      </button>
                      <button onClick={() => handleStatusToggle(user)} className={`w-9 h-9 rounded-full ${user.status === 'Active' ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' : 'bg-green-100 text-green-600 hover:bg-green-200'} flex items-center justify-center transition-colors duration-200`} title={user.status === 'Active' ? 'Suspend Account' : 'Activate Account'}>
                        {user.status === 'Active' ? <UserX className="h-5 w-5 flex-shrink-0" /> : <CheckCircle className="h-5 w-5 flex-shrink-0" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="py-4 text-center text-gray-500">No visitors found matching your criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-3xl w-11/12 relative animate-scale-in">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <XCircle className="h-7 w-7" />
            </button>
            <h3 className="text-2xl font-bold mb-6 text-gray-800">{editingUser ? 'Edit Visitor' : 'Add New Visitor'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Name</label>
                  <input type="text" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200" required />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
                  <input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200" required />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Phone</label>
                  <input
                    type="text"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    required
                    disabled={newUser.type === 'Dependent' && newUser.parentId !== null && newUser.parentId !== ''}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Type</label>
                  <select
                    value={newUser.type}
                    onChange={(e) => setNewUser({ ...newUser, type: e.target.value, parentId: e.target.value === 'Dependent' ? (newUser.parentId || '') : null })}
                    className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                  >
                    <option value="Full User">Full Visitor</option>
                    <option value="Dependent">Dependent</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                {newUser.type === 'Dependent' && (
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Parent Account</label>
                    <select
                      value={newUser.parentId || ''}
                      onChange={(e) => setNewUser({ ...newUser, parentId: e.target.value })}
                      className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                      required={newUser.type === 'Dependent'}
                    >
                      <option value="">Select Parent</option>
                      {fullUserAccounts.map(parent => (
                        <option key={parent.id} value={parent.id}>{parent.name} ({parent.email})</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Status</label>
                  <select value={newUser.status} onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                    className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200">
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Points Earned</label>
                  <input type="number" value={newUser.pointsEarned} onChange={(e) => setNewUser({ ...newUser, pointsEarned: parseInt(e.target.value) || 0 })}
                    className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200" min="0" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Zones Covered (comma-separated)</label>
                  <input type="text" value={(newUser.zonesCovered || []).join(', ')} onChange={(e) => setNewUser({ ...newUser, zonesCovered: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '') })}
                    className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Number of Visits</label>
                  <input type="number" value={newUser.numVisits} onChange={(e) => setNewUser({ ...newUser, numVisits: parseInt(e.target.value) || 0 })}
                    className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200" min="0" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Face Photo Status</label>
                  <select value={newUser.facePhotoStatus} onChange={(e) => setNewUser({ ...newUser, facePhotoStatus: e.target.value })}
                    className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200">
                    <option value="Pending">Pending</option>
                    <option value="Captured">Captured</option>
                  </select>
                </div>
                <div className="flex items-center mt-6">
                  <input type="checkbox" id="seasonalPass" checked={newUser.seasonalPass} onChange={(e) => setNewUser({ ...newUser, seasonalPass: e.target.checked })}
                    className="form-checkbox h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                  <label htmlFor="seasonalPass" className="ml-2 text-gray-700 text-sm font-semibold">Seasonal Pass Opted In</label>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button type="button" onClick={closeModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400">
                  Cancel
                </button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <Save className="h-5 w-5 mr-2" /> {editingUser ? 'Update Visitor' : 'Add Visitor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isProfileModalOpen && (
        <UserProfileModal user={selectedUserForProfile} onClose={closeProfileModal} />
      )}
    </div>
  );
};

export default UsersManagement;
