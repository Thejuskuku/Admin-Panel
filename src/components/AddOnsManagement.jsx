import React, { useState, useContext } from 'react';
import { AdminDashboardContext } from '../App.jsx'; // Adjusted import path for context
import { Plus, Edit, Trash, Save, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react'; // Icons

const AddOnsManagement = () => {
  const { data, updateData, addData, deleteData, simulateApiCall } = useContext(AdminDashboardContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddOn, setEditingAddOn] = useState(null);
  const [newAddOn, setNewAddOn] = useState({ name: '', price: 0, isActive: true });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const openModal = (addOn = null) => {
    setEditingAddOn(addOn);
    setNewAddOn(addOn ? { ...addOn } : { name: '', price: 0, isActive: true });
    setIsModalOpen(true);
    setMessage('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAddOn(null);
    setNewAddOn({ name: '', price: 0, isActive: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!newAddOn.name || newAddOn.price < 0) {
      setMessage('Name and Price (must be >= 0) are required.');
      setMessageType('error');
      return;
    }

    await simulateApiCall(() => {
      if (editingAddOn) {
        updateData('addOns', editingAddOn.id, newAddOn);
        setMessage('Add-on updated successfully!');
      } else {
        addData('addOns', newAddOn);
        setMessage('Add-on added successfully!');
      }
      setMessageType('success');
    });
    closeModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this add-on?')) {
      await simulateApiCall(() => {
        deleteData('addOns', id);
        setMessage('Add-on deleted successfully!');
        setMessageType('success');
      });
    }
  };

  const handleStatusToggle = async (addOn) => {
    await simulateApiCall(() => {
      updateData('addOns', addOn.id, { isActive: !addOn.isActive });
      setMessage(`Add-on ${addOn.name} status updated to ${addOn.isActive ? 'Inactive' : 'Active'}!`);
      setMessageType('success');
    });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen md:pb-24">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Add-on Management</h2>

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
        <Plus className="h-5 w-5 mr-2" /> Add New Add-on
      </button>

      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Price</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {data.addOns.map((addOn) => (
              <tr key={addOn.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left">{addOn.name}</td>
                <td className="py-3 px-6 text-left">${addOn.price.toFixed(2)}</td>
                <td className="py-3 px-6 text-left">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${addOn.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {addOn.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-center space-x-2">
                    <button onClick={() => openModal(addOn)} className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 flex items-center justify-center transition-colors duration-200" title="Edit Add-on">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(addOn.id)} className="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition-colors duration-200" title="Delete Add-on">
                      <Trash className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleStatusToggle(addOn)} className={`w-8 h-8 rounded-full ${addOn.isActive ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' : 'bg-green-100 text-green-600 hover:bg-green-200'} flex items-center justify-center transition-colors duration-200`} title={addOn.isActive ? 'Deactivate' : 'Activate'}>
                      {addOn.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-xl w-11/12 relative animate-scale-in">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <XCircle className="h-7 w-7" />
            </button>
            <h3 className="text-2xl font-bold mb-6 text-gray-800">{editingAddOn ? 'Edit Add-on' : 'Add New Add-on'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Name</label>
                  {/* Added bg-white and border-gray-300 for visibility */}
                  <input type="text" value={newAddOn.name} onChange={(e) => setNewAddOn({ ...newAddOn, name: e.target.value })} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200" required />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Price</label>
                  {/* Added bg-white and border-gray-300 for visibility */}
                  <input type="number" step="0.01" value={newAddOn.price} onChange={(e) => setNewAddOn({ ...newAddOn, price: parseFloat(e.target.value) })} className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200" min="0" required />
                </div>
                <div className="flex items-center mt-6">
                  <input type="checkbox" id="isActive" checked={newAddOn.isActive} onChange={(e) => setNewAddOn({ ...newAddOn, isActive: e.target.checked })} className="form-checkbox h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <label htmlFor="isActive" className="ml-2 text-gray-700 text-sm font-semibold">Is Active?</label>
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button type="button" onClick={closeModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <Save className="h-5 w-5 mr-2" /> {editingAddOn ? 'Update Add-on' : 'Add Add-on'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddOnsManagement;
