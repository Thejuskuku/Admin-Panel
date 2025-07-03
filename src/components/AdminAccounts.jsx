import React, { useState, useContext } from 'react';
import { AdminDashboardContext } from '../App.jsx'; // Adjusted import path for context
import { UserPlus, Edit, Trash, Save, CheckCircle, XCircle, UserX, UserCheck, History, Eye, ChevronDown, ChevronUp } from 'lucide-react'; // Added ChevronDown, ChevronUp icons

const AdminAccounts = () => {
  const { data, updateData, addData, deleteData, simulateApiCall } = useContext(AdminDashboardContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '', role: 'Content Editor', isActive: true, lastLogin: null });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showActivityLogs, setShowActivityLogs] = useState(false); // State to toggle activity logs visibility

  // Define the allowed admin roles
  const adminRoles = [
    'Super Admin',
    'Admin',
    'Bookings and Ticketing Manager',
    'Customer Support',
    'Counter Staff',
    'Kiosk Operator',
    'Sales User',
    'IT Support',
    'Finance',
    '3rd Party'
  ];

  // Mock Admin Accounts Data (enhanced with isActive and lastLogin, and unique IDs)
  // In a real application, this data would come from your backend via AdminDashboardContext
  const [adminAccounts, setAdminAccounts] = useState([
    { id: 'admin_001', username: 'SuperAdmin', password: 'hashed_password_1', role: 'Super Admin', isActive: true, lastLogin: '2024-07-01T10:00:00Z' },
    { id: 'admin_002', username: 'BookingManager', password: 'hashed_password_2', role: 'Bookings and Ticketing Manager', isActive: true, lastLogin: '2024-06-28T14:30:00Z' },
    { id: 'admin_003', username: 'ContentEditor', password: 'hashed_password_3', role: 'Admin', isActive: false, lastLogin: '2024-06-20T09:15:00Z' },
    { id: 'admin_004', username: 'ReporterUser', password: 'hashed_password_4', role: 'Finance', isActive: true, lastLogin: '2024-07-02T11:00:00Z' },
    { id: 'admin_005', username: 'OpsManager', password: 'hashed_password_5', role: 'Operations Manager', isActive: true, lastLogin: '2024-07-01T16:00:00Z' },
    { id: 'admin_006', username: 'MarketingManager', password: 'hashed_password_6', role: 'Marketing Manager', isActive: false, lastLogin: '2024-06-25T10:00:00Z' },
    { id: 'admin_007', username: 'TechSupport', password: 'hashed_password_7', role: 'IT Support', isActive: true, lastLogin: '2024-07-02T09:00:00Z' },
  ]);

  // Mock Admin Activity Logs (linked to adminAccounts by adminId)
  const [adminActivityLogs, setAdminActivityLogs] = useState([
    { id: 'log_001', timestamp: '2024-07-01T10:05:00Z', adminId: 'admin_001', adminUsername: 'SuperAdmin', action: 'Approved Admin Access Request', details: 'Request req_admin_001 for Jane Doe.' },
    { id: 'log_002', timestamp: '2024-07-01T10:10:00Z', adminId: 'admin_002', adminUsername: 'BookingManager', action: 'Updated Booking', details: 'Booking BKG_123 slot changed.' },
    { id: 'log_003', timestamp: '2024-07-02T09:00:00Z', adminId: 'admin_007', adminUsername: 'TechSupport', action: 'Reset Password', details: 'Password reset for user_XYZ.' },
    { id: 'log_004', timestamp: '2024-07-02T11:30:00Z', adminId: 'admin_001', adminUsername: 'SuperAdmin', action: 'Deactivated Admin Account', details: 'Account admin_003 (ContentEditor) deactivated.' },
    { id: 'log_005', timestamp: '2024-07-02T14:00:00Z', adminId: 'admin_004', adminUsername: 'Finance', action: 'Generated Report', details: 'Monthly financial report generated for Q2.' },
    { id: 'log_006', timestamp: '2024-07-02T15:00:00Z', adminId: 'admin_005', adminUsername: 'OpsManager', action: 'Created New Exhibit', details: 'Exhibit "New Robot Arm" added to Roboland.' },
    { id: 'log_007', timestamp: '2024-07-02T16:00:00Z', adminId: 'admin_002', adminUsername: 'BookingManager', action: 'Processed Bulk Booking', details: 'Bulk booking BB_456 approved.' },
  ]);

  const openModal = (admin = null) => {
    setEditingAdmin(admin);
    setNewAdmin(admin ? { ...admin, password: '' } : { username: '', password: '', role: adminRoles[0], isActive: true, lastLogin: null }); // Set default role to the first in the list
    setIsModalOpen(true);
    setMessage('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAdmin(null);
    setNewAdmin({ username: '', password: '', role: adminRoles[0], isActive: true, lastLogin: null }); // Reset to first role
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!newAdmin.username || (!editingAdmin && !newAdmin.password) || !newAdmin.role) {
      setMessage('Username, Role, and Password (for new admin) are required.');
      setMessageType('error');
      return;
    }

    await simulateApiCall(() => {
      if (editingAdmin) {
        const updatedAdmin = { ...newAdmin };
        if (newAdmin.password) { // Only update password if provided
          updatedAdmin.password = newAdmin.password; // In a real app, this would be hashed
        } else {
          delete updatedAdmin.password; // Don't overwrite with empty string if not changed
          // Retain existing password if not updated
          const existingAdmin = adminAccounts.find(a => a.id === editingAdmin.id);
          if (existingAdmin && existingAdmin.password) {
            updatedAdmin.password = existingAdmin.password;
          }
        }
        setAdminAccounts(prev => prev.map(a => a.id === editingAdmin.id ? updatedAdmin : a));
        setMessage('Admin account updated successfully!');

        // Log the update action
        setAdminActivityLogs(prevLogs => [...prevLogs, {
          id: `log_${Date.now()}`,
          timestamp: new Date().toISOString(),
          adminId: updatedAdmin.id,
          adminUsername: updatedAdmin.username,
          action: 'Updated Admin Account',
          details: `Account ${updatedAdmin.username} (${updatedAdmin.id}) updated.`
        }]);

      } else {
        const newId = `admin_${Date.now()}`; // Simple unique ID generation
        const adminToAdd = {
          ...newAdmin,
          id: newId,
          lastLogin: new Date().toISOString(), // Set last login for new account
        };
        setAdminAccounts(prev => [...prev, adminToAdd]);
        setMessage('Admin account added successfully!');

        // Log the add action
        setAdminActivityLogs(prevLogs => [...prevLogs, {
          id: `log_${Date.now()}`,
          timestamp: new Date().toISOString(),
          adminId: adminToAdd.id,
          adminUsername: adminToAdd.username,
          action: 'Added New Admin Account',
          details: `New admin ${adminToAdd.username} (${adminToAdd.role}) created.`
        }]);
      }
      setMessageType('success');
    });
    closeModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this admin account?')) {
      await simulateApiCall(() => {
        const deletedAdmin = adminAccounts.find(admin => admin.id === id);
        setAdminAccounts(prev => prev.filter(admin => admin.id !== id));
        setMessage('Admin account deleted successfully!');
        setMessageType('success');

        // Log the delete action
        if (deletedAdmin) {
          setAdminActivityLogs(prevLogs => [...prevLogs, {
            id: `log_${Date.now()}`,
            timestamp: new Date().toISOString(),
            adminId: deletedAdmin.id,
            adminUsername: deletedAdmin.username,
            action: 'Deleted Admin Account',
            details: `Account ${deletedAdmin.username} (${deletedAdmin.id}) deleted.`
          }]);
        }
      });
    }
  };

  const handleStatusToggle = async (admin) => {
    await simulateApiCall(() => {
      const updatedAdmin = { ...admin, isActive: !admin.isActive };
      setAdminAccounts(prev => prev.map(a => a.id === admin.id ? updatedAdmin : a));
      setMessage(`Admin ${admin.username} status updated to ${updatedAdmin.isActive ? 'Active' : 'Inactive'}!`);
      setMessageType('success');

      // Log the status toggle action
      setAdminActivityLogs(prevLogs => [...prevLogs, {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        adminId: updatedAdmin.id,
        adminUsername: updatedAdmin.username,
        action: `Toggled Admin Status to ${updatedAdmin.isActive ? 'Active' : 'Inactive'}`,
        details: `Account ${updatedAdmin.username} (${updatedAdmin.id}) status changed.`
      }]);
    });
  };

  const handleResetPassword = async (admin) => {
    // In a real application, this would trigger a backend process
    // For this prototype, we'll simulate a success message.
    if (window.confirm(`Are you sure you want to reset the password for ${admin.username}?`)) {
      await simulateApiCall(() => {
        setMessage(`Password reset initiated for ${admin.username}. A temporary password has been sent.`);
        setMessageType('success');

        // Log the password reset action
        setAdminActivityLogs(prevLogs => [...prevLogs, {
          id: `log_${Date.now()}`,
          timestamp: new Date().toISOString(),
          adminId: admin.id,
          adminUsername: admin.username,
          action: 'Initiated Password Reset',
          details: `Password reset requested for ${admin.username} (${admin.id}).`
        }]);
      });
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen md:pb-24">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Admin Accounts Management</h2>

      {message && (
        <div className={`p-4 mb-6 rounded-lg flex items-center ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {messageType === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <XCircle className="h-5 w-5 mr-2" />}
          {message}
        </div>
      )}

      <button
        onClick={() => openModal()}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center mb-6 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <UserPlus className="h-5 w-5 mr-2" /> Add New Admin
      </button>

      <div className="overflow-x-auto bg-white rounded-xl shadow-md mb-8">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Admin ID</th> {/* Added Admin ID column */}
              <th className="py-3 px-6 text-left">Username</th>
              <th className="py-3 px-6 text-left">Role</th>
              <th className="py-3 px-6 text-left">Last Login</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {adminAccounts.map((admin) => (
              <tr key={admin.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left font-mono text-xs">{admin.id}</td> {/* Display Admin ID */}
                <td className="py-3 px-6 text-left">{admin.username}</td>
                <td className="py-3 px-6 text-left">{admin.role}</td>
                <td className="py-3 px-6 text-left">{admin.lastLogin ? new Date(admin.lastLogin).toLocaleString() : 'N/A'}</td>
                <td className="py-3 px-6 text-left">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${admin.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {admin.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-center space-x-2">
                    <button onClick={() => openModal(admin)} className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 flex items-center justify-center transition-colors duration-200" title="Edit Admin Permissions/Role">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleResetPassword(admin)} className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center transition-colors duration-200" title="Reset Password">
                      <History className="h-4 w-4" /> {/* Using History for password reset icon */}
                    </button>
                    <button onClick={() => handleStatusToggle(admin)} className={`w-8 h-8 rounded-full ${admin.isActive ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' : 'bg-green-100 text-green-600 hover:bg-green-200'} flex items-center justify-center transition-colors duration-200`} title={admin.isActive ? 'Deactivate Account' : 'Activate Account'}>
                      {admin.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                    </button>
                    <button onClick={() => handleDelete(admin.id)} className="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition-colors duration-200" title="Delete Admin">
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Admin Activity Logs Section */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-700 flex items-center">
            <History className="h-6 w-6 mr-2 text-gray-600" /> Admin Activity Logs
          </h3>
          <button
            onClick={() => setShowActivityLogs(!showActivityLogs)}
            className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200"
            title={showActivityLogs ? 'Hide Logs' : 'Show Logs'}
          >
            {showActivityLogs ? (
              <ChevronUp className="h-6 w-6" />
            ) : (
              <ChevronDown className="h-6 w-6" />
            )}
          </button>
        </div>

        {showActivityLogs && (
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full leading-normal">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-xs leading-normal">
                  <th className="py-3 px-6 text-left">Timestamp</th>
                  <th className="py-3 px-6 text-left">Admin (ID)</th>
                  <th className="py-3 px-6 text-left">Action</th>
                  <th className="py-3 px-6 text-left">Details</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm">
                {adminActivityLogs.length > 0 ? (
                  adminActivityLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map((log) => (
                    <tr key={log.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-6 text-left whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="py-3 px-6 text-left">{log.adminUsername} (<span className="font-mono text-xs">{log.adminId.substring(0, 8)}...</span>)</td>
                      <td className="py-3 px-6 text-left">{log.action}</td>
                      <td className="py-3 px-6 text-left">{log.details}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-4 text-center text-gray-500">No activity logs available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-xl w-11/12 relative animate-scale-in">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 hover:text-gray-900 flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              aria-label="Close modal"
            >
              <XCircle className="h-7 w-7" />
            </button>
            <h3 className="text-2xl font-bold mb-6 text-gray-800">{editingAdmin ? 'Edit Admin Account' : 'Add New Admin Account'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Username</label>
                  <input
                    type="text"
                    value={newAdmin.username}
                    onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                    className="shadow-sm appearance-none border rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Password {editingAdmin && '(Leave blank to keep current)'}</label>
                  <input
                    type="password"
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                    className="shadow-sm appearance-none border rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    // Password is only required for new admins, not for editing if left blank
                    required={!editingAdmin}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Role</label>
                  <select
                    value={newAdmin.role}
                    onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                    className="shadow-sm appearance-none border rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  >
                    {adminRoles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                {editingAdmin && ( // Show status toggle only when editing
                  <div className="flex items-center mt-6">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={newAdmin.isActive}
                      onChange={(e) => setNewAdmin({ ...newAdmin, isActive: e.target.checked })}
                      className="form-checkbox h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 text-gray-700 text-base font-semibold">Is Active?</label>
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <Save className="h-5 w-5 mr-2" /> {editingAdmin ? 'Update Admin' : 'Add Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAccounts;
