import React, { useState, useContext, useEffect } from 'react';
import { AdminDashboardContext } from './App.jsx'; // Changed path to './App.jsx'
import { PlusCircle, Save, XCircle, Edit, CheckCircle, Trash2, X, Tag as TagIcon, AlertTriangle } from 'lucide-react';
// Import Firebase modules for local data management in this component
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Only need getAuth, auth state is managed in App.jsx and userId is provided
import { getFirestore, collection, query, onSnapshot, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import ConfirmationModal from './ConfirmationModal.jsx';

const DiscountsPromotions = () => {
  // Access common functions and userId from the global context
  const { userId, simulateApiCall, addData, updateData, deleteData, loading: appLoading, error: appError } = useContext(AdminDashboardContext);

  // Component-specific state for promotions data and its loading/error status
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true); // Local loading for this component's data
  const [error, setError] = useState(null); // Local error for this component's data

  // State for the new promotion form
  const [newPromotion, setNewPromotion] = useState({
    name: '',
    type: 'percentage', // 'percentage' or 'fixed'
    value: 0,
    startDate: '',
    endDate: '',
    applicability: '', // e.g., 'All services', 'Specific service A'
    status: 'active', // 'active' or 'inactive'
  });

  // State for tracking which promotion is being edited
  const [editingId, setEditingId] = useState(null);

  // State for messages
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // --- Confirmation Modal States ---
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalMessage, setConfirmModalMessage] = useState('');
  const [confirmModalAction, setConfirmModalAction] = null;
  const [confirmModalType, setConfirmModalType] = useState('warning');

  // Initialize Firebase locally (will only run if not already initialized by App.jsx,
  // but it's good practice to ensure direct access to db instance if needed)
  const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  // No need to get auth instance or sign in here, userId comes from context.
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';


  // Effect to fetch and listen to 'discountsPromotions' data specifically for this component
  useEffect(() => {
    let unsubscribe;
    if (userId) {
      setLoading(true);
      setError(null);
      console.log("DiscountsPromotions: Setting up Firestore listener for discountsPromotions for user:", userId);
      // Firestore collection path for private user data
      const colRef = collection(db, `artifacts/${appId}/users/${userId}/discountsPromotions`);
      const q = query(colRef);

      unsubscribe = onSnapshot(q,
        (snapshot) => {
          const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          console.log("DiscountsPromotions: Received discountsPromotions data:", items);
          setPromotions(items);
          setLoading(false);
        },
        (err) => {
          console.error("DiscountsPromotions: Firestore Listen Error:", err);
          setError("Failed to load promotions. Please check your console.");
          setLoading(false);
        }
      );
    } else {
      console.log("DiscountsPromotions: userId not available yet, cannot set up Firestore listener.");
      setLoading(false); // If no user, stop loading, perhaps display a message
      setError("User not authenticated. Please wait for the dashboard to load fully.");
    }

    // Cleanup listener on component unmount or userId change
    return () => {
      if (unsubscribe) {
        unsubscribe();
        console.log("DiscountsPromotions: Unsubscribed from discountsPromotions listener.");
      }
    };
  }, [userId, db, appId]); // Dependencies: userId, db instance, and appId

  // Helper to open confirmation modal
  const openConfirmModal = (msg, action, type = 'warning') => {
    setConfirmModalMessage(msg);
    setConfirmModalAction(() => action); // Store the action to be executed
    setConfirmModalType(type);
    setIsConfirmModalOpen(true);
  };

  // Helper to close confirmation modal
  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setConfirmModalMessage('');
    setConfirmModalAction(null);
  };

  // Handle input changes for the new promotion form
  const handleNewPromotionChange = (e) => {
    const { name, value } = e.target;
    setNewPromotion(prev => ({ ...prev, [name]: value }));
  };

  // Handle adding a new promotion
  const handleAddPromotion = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!newPromotion.name || newPromotion.value === null || newPromotion.value === '' || !newPromotion.startDate || !newPromotion.endDate) {
      setMessage('Please fill in all required fields for the new promotion (Name, Value, Start Date, End Date).');
      setMessageType('error');
      return;
    }

    if (new Date(newPromotion.startDate) > new Date(newPromotion.endDate)) {
      setMessage('Start date cannot be after end date.');
      setMessageType('error');
      return;
    }
    if (newPromotion.type === 'percentage' && (newPromotion.value < 0 || newPromotion.value > 100)) {
        setMessage('Percentage value must be between 0 and 100.');
        setMessageType('error');
        return;
    }

    setMessage(''); // Clear previous messages
    await simulateApiCall(async () => {
      try {
        const promoToAdd = {
          ...newPromotion,
          value: parseFloat(newPromotion.value), // Ensure value is a number
        };
        // Use addData from context, it handles the Firestore part
        await addData('discountsPromotions', promoToAdd);
        setMessage('Promotion added successfully!');
        setMessageType('success');
        // Reset form
        setNewPromotion({
          name: '',
          type: 'percentage',
          value: 0,
          startDate: '',
          endDate: '',
          applicability: '',
          status: 'active',
        });
      } catch (err) {
        console.error("Error adding promotion:", err);
        setMessage('Failed to add promotion. Please try again.');
        setMessageType('error');
      }
    });
  };

  // Set promotion to be edited
  const handleEditClick = (id) => {
    setEditingId(id);
    setMessage(''); // Clear message when starting edit
  };

  // Handle changes in an existing promotion's fields for the currently edited item
  const handleEditChange = (id, field, value) => {
    setPromotions(prevPromotions =>
      prevPromotions.map(promo =>
        promo.id === id ? { ...promo, [field]: value } : promo
      )
    );
  };

  // Save changes to an existing promotion
  const handleSaveEdit = async (promotionToSave) => {
    setMessage(''); // Clear previous messages
    if (!promotionToSave.name || promotionToSave.value === null || promotionToSave.value === '' || !promotionToSave.startDate || !promotionToSave.endDate) {
      setMessage('Please fill in all required fields for the promotion (Name, Value, Start Date, End Date).');
      setMessageType('error');
      return;
    }

    if (new Date(promotionToSave.startDate) > new Date(promotionToSave.endDate)) {
      setMessage('Start date cannot be after end date.');
      setMessageType('error');
      return;
    }
    if (promotionToSave.type === 'percentage' && (promotionToSave.value < 0 || promotionToSave.value > 100)) {
        setMessage('Percentage value must be between 0 and 100.');
        setMessageType('error');
        return;
    }

    await simulateApiCall(async () => {
      try {
        const { id, ...fieldsToUpdate } = promotionToSave; // Exclude id from fields to update
        await updateData('discountsPromotions', id, { ...fieldsToUpdate, value: parseFloat(promotionToSave.value) });
        setMessage('Promotion updated successfully!');
        setMessageType('success');
        setEditingId(null); // Exit editing mode
      } catch (err) {
        console.error("Error updating promotion:", err);
        setMessage('Failed to update promotion. Please try again.');
        setMessageType('error');
      }
    });
  };

  // Delete a promotion using the confirmation modal
  const handleDeletePromotion = (id) => {
    openConfirmModal(
      'Are you sure you want to delete this promotion? This action cannot be undone.',
      async () => {
        setMessage(''); // Clear previous messages
        await simulateApiCall(async () => {
          try {
            await deleteData('discountsPromotions', id);
            setMessage('Promotion deleted successfully!');
            setMessageType('success');
          } catch (err) {
            console.error("Error deleting promotion:", err);
            setMessage('Failed to delete promotion. Please try again.');
            setMessageType('error');
          }
        });
        closeConfirmModal(); // Close modal after action
      },
      'danger' // Type of modal (e.g., 'danger', 'warning', 'info', 'success')
    );
  };


  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <TagIcon className="h-7 w-7 mr-3 text-indigo-600" />
        Discount & Promotion Management
      </h2>

      {/* Message display for success/error feedback */}
      {message && (
        <div className={`p-3 sm:p-4 mb-4 rounded-lg flex items-center shadow-sm ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {messageType === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <XCircle className="h-5 w-5 mr-2" />}
          {message}
          <button
            onClick={() => setMessage('')}
            className="ml-auto p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
            aria-label="Close message"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Overall loading/error from App.jsx's context if applicable, or local loading */}
      {(appLoading || loading) && !(appError || error) && (
        <div className="flex flex-col items-center justify-center p-6 text-indigo-600">
          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2 text-sm">Loading promotions data...</p>
        </div>
      )}

      {(appError || error) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 shadow-sm" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {appError || error}</span>
          <button
            onClick={() => { setError(null); /* Also clear appError if needed, or let App.jsx manage it */ }}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            aria-label="Close message"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {!(appLoading || loading) && !(appError || error) && ( // Only render content if not loading and no errors
        <>
          {/* Add New Promotion Form */}
          <div className="bg-white p-6 rounded-xl shadow-md mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Add New Promotion</h3>
            <form onSubmit={handleAddPromotion} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Promotion Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newPromotion.name}
                  onChange={handleNewPromotionChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Discount Type</label>
                <select
                  id="type"
                  name="type"
                  value={newPromotion.type}
                  onChange={handleNewPromotionChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              <div>
                <label htmlFor="value" className="block text-sm font-medium text-gray-700">Discount Value</label>
                <input
                  type="number"
                  id="value"
                  name="value"
                  value={newPromotion.value}
                  onChange={handleNewPromotionChange}
                  min="0"
                  step={newPromotion.type === 'percentage' ? "0.01" : "0.01"} // Allow decimals for both
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={newPromotion.startDate}
                  onChange={handleNewPromotionChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={newPromotion.endDate}
                  onChange={handleNewPromotionChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="applicability" className="block text-sm font-medium text-gray-700">Applicability (e.g., "All services", "Service A")</label>
                <input
                  type="text"
                  id="applicability"
                  name="applicability"
                  value={newPromotion.applicability}
                  onChange={handleNewPromotionChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  id="status"
                  name="status"
                  value={newPromotion.status}
                  onChange={handleNewPromotionChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="md:col-span-2 lg:col-span-3 flex justify-end">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <PlusCircle className="h-5 w-5 mr-2" /> Add Promotion
                </button>
              </div>
            </form>
          </div>

          {/* Existing Promotions List */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Existing Promotions</h3>
            {promotions.length === 0 ? (
              <p className="text-gray-500 italic">No promotions found. Add a new one above!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full leading-normal">
                  <thead>
                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                      <th className="py-3 px-6 text-left">Name</th>
                      <th className="py-3 px-6 text-left">Type</th>
                      <th className="py-3 px-6 text-left">Value</th>
                      <th className="py-3 px-6 text-left">Start Date</th>
                      <th className="py-3 px-6 text-left">End Date</th>
                      <th className="py-3 px-6 text-left">Applicability</th>
                      <th className="py-3 px-6 text-left">Status</th>
                      <th className="py-3 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {promotions.map((promo) => (
                      <tr key={promo.id} className="border-b border-gray-200 hover:bg-gray-100">
                        <td className="py-3 px-6 text-left">
                          {editingId === promo.id ? (
                            <input
                              type="text"
                              value={promo.name}
                              onChange={(e) => handleEditChange(promo.id, 'name', e.target.value)}
                              className="w-full p-1 border rounded-md"
                            />
                          ) : (
                            promo.name
                          )}
                        </td>
                        <td className="py-3 px-6 text-left">
                          {editingId === promo.id ? (
                            <select
                              value={promo.type}
                              onChange={(e) => handleEditChange(promo.id, 'type', e.target.value)}
                              className="w-full p-1 border rounded-md"
                            >
                              <option value="percentage">Percentage</option>
                              <option value="fixed">Fixed</option>
                            </select>
                          ) : (
                            promo.type
                          )}
                        </td>
                        <td className="py-3 px-6 text-left">
                          {editingId === promo.id ? (
                            <input
                              type="number"
                              value={promo.value}
                              onChange={(e) => handleEditChange(promo.id, 'value', e.target.value)}
                              min="0"
                              step={promo.type === 'percentage' ? "0.01" : "0.01"}
                              className="w-24 p-1 border rounded-md"
                            />
                          ) : (
                            `${promo.type === 'percentage' ? promo.value + '%' : '$' + (promo.value || 0).toFixed(2)}`
                          )}
                        </td>
                        <td className="py-3 px-6 text-left">
                          {editingId === promo.id ? (
                            <input
                              type="date"
                              value={promo.startDate}
                              onChange={(e) => handleEditChange(promo.id, 'startDate', e.target.value)}
                              className="w-full p-1 border rounded-md"
                            />
                          ) : (
                            promo.startDate
                          )}
                        </td>
                        <td className="py-3 px-6 text-left">
                          {editingId === promo.id ? (
                            <input
                              type="date"
                              value={promo.endDate}
                              onChange={(e) => handleEditChange(promo.id, 'endDate', e.target.value)}
                              className="w-full p-1 border rounded-md"
                            />
                          ) : (
                            promo.endDate
                          )}
                        </td>
                        <td className="py-3 px-6 text-left">
                          {editingId === promo.id ? (
                            <input
                              type="text"
                              value={promo.applicability}
                              onChange={(e) => handleEditChange(promo.id, 'applicability', e.target.value)}
                              className="w-full p-1 border rounded-md"
                            />
                          ) : (
                            promo.applicability || 'N/A'
                          )}
                        </td>
                        <td className="py-3 px-6 text-left">
                          {editingId === promo.id ? (
                            <select
                              value={promo.status}
                              onChange={(e) => handleEditChange(promo.id, 'status', e.target.value)}
                              className="w-full p-1 border rounded-md"
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          ) : (
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${promo.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {promo.status}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-6 text-center whitespace-nowrap">
                          {editingId === promo.id ? (
                            <>
                              <button
                                onClick={() => handleSaveEdit(promotions.find(p => p.id === promo.id))} // Pass the updated promo object
                                className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors duration-200 mr-2"
                                title="Save"
                              >
                                <CheckCircle className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => setEditingId(null)} // Cancel editing
                                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200"
                                title="Cancel"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditClick(promo.id)}
                                className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors duration-200 mr-2"
                                title="Edit"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDeletePromotion(promo.id)}
                                className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200"
                                title="Delete"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Confirmation Modal */}
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

export default DiscountsPromotions;
