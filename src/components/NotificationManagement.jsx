import React, { useState } from 'react';
import {
  BellRing, Mail, MessageSquare, Phone, CheckCircle, XCircle, Settings, Edit, AlertCircle, CalendarDays, Users, Award, MapPin, Save, Plus // Added Plus icon
} from 'lucide-react';

const NotificationManagement = () => {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [deliveryChannels, setDeliveryChannels] = useState({
    email: true,
    whatsApp: true,
    sms: true,
  });

  // State for Notification Content Editor Modal
  const [isContentEditorModalOpen, setIsContentEditorModalOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false); // New state to differentiate add/edit mode
  const [selectedTemplateCategory, setSelectedTemplateCategory] = useState('preVisit'); // Default category
  const [selectedTemplateType, setSelectedTemplateType] = useState('otpDelivery'); // Default type for edit
  const [currentEditedContent, setCurrentEditedContent] = useState('');

  // States for adding new notification
  const [newNotificationLabel, setNewNotificationLabel] = useState('');
  const [newNotificationValue, setNewNotificationValue] = useState(''); // This will be the 'value' for the template type

  // Mock data for notification templates
  const [notificationTemplates, setNotificationTemplates] = useState({
    preVisit: {
      otpDelivery: "Your OTP for login is {OTP}. Do not share this with anyone.",
      bookingConfirmation: "Your booking {BookingID} for {Date} is confirmed. Total amount: {Amount}.",
      faceUploadStatusPending: "Reminder: Please upload your face photo for faster entry. Link: {UploadLink}",
      faceUploadStatusSuccessful: "Your face photo has been successfully uploaded and verified.",
      faceUploadStatusReupload: "Your face photo needs re-upload. Reason: {Reason}. Link: {UploadLink}",
      visitReminder1Day: "Reminder: Your visit is tomorrow, {Date}, at {Time}. We look forward to seeing you!",
      visitReminder1Week: "Your exciting visit to the park is in 1 week, on {Date}!",
      slotChangeConfirmation: "Your booking {BookingID} slot has been changed to {NewDate} at {NewTime}.",
      addOnReminder: "Don't forget your upcoming add-on, {AddOnName}, on {Date} at {Time}!",
      birthdayDiscount: "Happy Birthday, {VisitorName}! Enjoy a special {Discount}% discount on your next visit!",
    },
    companionHandling: {
      groupLinkSent: "You've been invited to join a group! Click here to accept: {GroupLink}",
      companionJoining: "{CompanionName} has joined your group {GroupName}.",
      qrCodeIssued: "Your QR code for entry is ready. Download here: {QRCodeLink}",
      childDependentAdded: "{ChildName} has been added as a dependent to your account.",
    },
    inPark: {
      badgeUnlocked: "Congratulations! You've unlocked the '{BadgeName}' badge! Check your profile for details.",
      rallyJoined: "You've successfully joined the rally '{RallyName}'. Good luck!",
      zoneBonusAlert: "Special XP bonus available in the {ZoneName} zone! Visit now to earn more!",
    },
    postVisit: {
      profileCompletionReminder: "Thanks for visiting! Complete your profile to unlock more features: {ProfileLink}",
      photoUploadReminder: "Did you miss uploading photos? Upload them here: {PhotoUploadLink}",
      followUpSurvey: "We hope you enjoyed your visit! Please share your feedback: {SurveyLink}",
      memoryRecap: "Here's a recap of your amazing day at the park: {RecapLink}",
    },
  });

  // Structure for dropdown options in content editor - dynamically generated
  const [notificationOptions, setNotificationOptions] = useState([]);

  // Function to initialize/update notificationOptions based on notificationTemplates
  const updateNotificationOptions = (templates) => {
    const options = [
      {
        label: "Pre-Visit Notifications",
        category: "preVisit",
        types: Object.keys(templates.preVisit).map(key => ({ value: key, label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) }))
      },
      {
        label: "Companion Handling Notifications",
        category: "companionHandling",
        types: Object.keys(templates.companionHandling).map(key => ({ value: key, label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) }))
      },
      {
        label: "In-Park Notifications",
        category: "inPark",
        types: Object.keys(templates.inPark).map(key => ({ value: key, label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) }))
      },
      {
        label: "Post-Visit Notifications",
        category: "postVisit",
        types: Object.keys(templates.postVisit).map(key => ({ value: key, label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) }))
      },
    ];
    setNotificationOptions(options);
  };

  // Initial load and whenever notificationTemplates change
  React.useEffect(() => {
    updateNotificationOptions(notificationTemplates);
  }, [notificationTemplates]);


  // Effect to load content when selectedTemplateCategory or selectedTemplateType changes (for edit mode)
  React.useEffect(() => {
    if (!isAddMode && selectedTemplateCategory && selectedTemplateType && notificationTemplates[selectedTemplateCategory]) {
      setCurrentEditedContent(notificationTemplates[selectedTemplateCategory][selectedTemplateType] || '');
    }
  }, [selectedTemplateCategory, selectedTemplateType, notificationTemplates, isAddMode]);


  const handleSaveConfiguration = (sectionName) => {
    setMessage(`Configuration for "${sectionName}" saved successfully!`);
    setMessageType('success');
    // In a real application, you would send this configuration to a backend.
    setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
  };

  const handleToggleDeliveryChannel = (channel) => {
    setDeliveryChannels(prevChannels => ({
      ...prevChannels,
      [channel]: !prevChannels[channel]
    }));
  };

  const openContentEditorModal = (mode, category = 'preVisit', type = '') => {
    setIsAddMode(mode === 'add');
    setSelectedTemplateCategory(category);
    setNewNotificationLabel('');
    setNewNotificationValue('');
    setCurrentEditedContent('');

    if (mode === 'edit') {
      setSelectedTemplateType(type);
      // Content will be loaded by useEffect
    } else { // Add mode
      // Set a default type for 'Add' mode if needed, or leave empty
      setSelectedTemplateType('');
    }
    setIsContentEditorModalOpen(true);
    setMessage(''); // Clear any previous messages
  };

  const closeContentEditorModal = () => {
    setIsContentEditorModalOpen(false);
    setIsAddMode(false);
    setSelectedTemplateCategory('preVisit'); // Reset to default
    setSelectedTemplateType('otpDelivery'); // Reset to default
    setCurrentEditedContent('');
    setNewNotificationLabel('');
    setNewNotificationValue('');
  };

  const handleContentChange = (e) => {
    setCurrentEditedContent(e.target.value);
  };

  const handleSaveContent = () => {
    if (isAddMode) {
      if (!newNotificationLabel || !newNotificationValue || !currentEditedContent || !selectedTemplateCategory) {
        setMessage('Please fill in all fields (Label, Type Value, Content, and select a Category) for the new notification.');
        setMessageType('error');
        return;
      }
      if (notificationTemplates[selectedTemplateCategory] && notificationTemplates[selectedTemplateCategory][newNotificationValue]) {
        setMessage(`A notification with type "${newNotificationValue}" already exists in this category. Please choose a different type value.`);
        setMessageType('error');
        return;
      }

      setNotificationTemplates(prevTemplates => ({
        ...prevTemplates,
        [selectedTemplateCategory]: {
          ...prevTemplates[selectedTemplateCategory],
          [newNotificationValue]: currentEditedContent
        }
      }));
      setMessage(`New notification "${newNotificationLabel}" added successfully!`);
    } else { // Edit mode
      if (!selectedTemplateCategory || !selectedTemplateType || !currentEditedContent) {
        setMessage('Please select a notification type and provide content to save.');
        setMessageType('error');
        return;
      }
      setNotificationTemplates(prevTemplates => ({
        ...prevTemplates,
        [selectedTemplateCategory]: {
          ...prevTemplates[selectedTemplateCategory],
          [selectedTemplateType]: currentEditedContent
        }
      }));
      setMessage(`Content for "${notificationOptions.find(opt => opt.category === selectedTemplateCategory)?.types.find(type => type.value === selectedTemplateType)?.label}" saved successfully!`);
    }
    setMessageType('success');
    closeContentEditorModal();
  };

  const getTypesForSelectedCategory = () => {
    const category = notificationOptions.find(opt => opt.category === selectedTemplateCategory);
    return category ? category.types : [];
  };


  return (
    <div className="p-8 bg-gray-50 min-h-screen md:pb-24 container mx-auto max-w-7xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
        <BellRing className="h-8 w-8 mr-3 text-indigo-600" /> Notification System Configuration
      </h2>

      {message && (
        <div className={`p-4 mb-6 rounded-lg flex items-center ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {messageType === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <XCircle className="h-5 w-5 mr-2" />}
          {message}
        </div>
      )}

      {/* Pre-Visit Notifications */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <CalendarDays className="h-6 w-6 mr-2 text-blue-600" /> Pre-Visit Notification Triggers
        </h3>
        <div className="space-y-4 text-gray-600">
          <p>Configure automated notifications sent to visitors before their visit:</p>
          <ul className="list-disc list-inside ml-4 space-y-2">
            <li><strong>OTP Delivery:</strong> Alerts for OTP generation and incorrect OTP attempts.</li>
            <li><strong>Booking Confirmations:</strong> Send notifications upon successful booking and payment (or failure).</li>
            <li><strong>Face Upload Status:</strong> Reminders for pending face uploads, confirmation of successful uploads, or requests for re-upload.</li>
            <li><strong>Visit Reminders:</strong> Automated reminders (e.g., 1 day, 1 week before visit).</li>
            <li><strong>Slot/Add-on Changes:</strong> Confirmations for booking slot changes and reminders for upcoming add-on experiences.</li>
            <li><strong>Birthday Discount Alerts:</strong> Automated birthday greetings with special discount offers.</li>
          </ul>
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={() => handleSaveConfiguration('Pre-Visit Notifications')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Settings className="h-5 w-5 mr-2" /> Configure
            </button>
            <button
              onClick={() => openContentEditorModal('add', 'preVisit')}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <Plus className="h-5 w-5 mr-2" /> Add New
            </button>
          </div>
        </div>
      </div>

      {/* Companion Handling Notifications */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <Users className="h-6 w-6 mr-2 text-purple-600" /> Companion Handling Notifications
        </h3>
        <div className="space-y-4 text-gray-600">
          <p>Manage alerts related to group interactions and companion additions:</p>
          <ul className="list-disc list-inside ml-4 space-y-2">
            <li><strong>Group Link Sent:</strong> Notify when a group invitation link is shared.</li>
            <li><strong>Companion Joining:</strong> Alert group organizer when a companion successfully joins their group.</li>
            <li><strong>QR Codes Issued:</strong> Notifications for individual or group QR code issuance.</li>
            <li><strong>Child/Dependent Additions:</strong> Confirmations when children or dependents are added to a main account.</li>
          </ul>
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={() => handleSaveConfiguration('Companion Handling Notifications')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Settings className="h-5 w-5 mr-2" /> Configure
            </button>
            <button
              onClick={() => openContentEditorModal('add', 'companionHandling')}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <Plus className="h-5 w-5 mr-2" /> Add New
            </button>
          </div>
        </div>
      </div>

      {/* In-Park Notifications */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <MapPin className="h-6 w-6 mr-2 text-green-600" /> In-Park Notifications
        </h3>
        <div className="space-y-4 text-gray-600">
          <p>Configure real-time notifications for visitors during their park experience:</p>
          <ul className="list-disc list-inside ml-4 space-y-2">
            <li><strong>Badge Unlocked:</strong> Notify visitors when they unlock a new digital badge or achievement.</li>
            <li><strong>Rally Joined:</strong> Confirm participation when a visitor joins a virtual rally or event.</li>
            <li><strong>Zone Bonus Alerts:</strong> Send alerts for special XP bonuses or offers in specific zones.</li>
          </ul>
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={() => handleSaveConfiguration('In-Park Notifications')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Settings className="h-5 w-5 mr-2" /> Configure
            </button>
            <button
              onClick={() => openContentEditorModal('add', 'inPark')}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <Plus className="h-5 w-5 mr-2" /> Add New
            </button>
          </div>
        </div>
      </div>

      {/* Post-Visit Notifications */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <CheckCircle className="h-6 w-6 mr-2 text-orange-600" /> Post-Visit Notifications
        </h3>
        <div className="space-y-4 text-gray-600">
          <p>Set up follow-up communications after a visitor's experience:</p>
          <ul className="list-disc list-inside ml-4 space-y-2">
            <li><strong>Profile Completion Reminders:</strong> Prompt visitors to complete their profiles or upload skipped photos.</li>
            <li><strong>Follow-up Communications:</strong> Send emails, SMS, or WhatsApp messages with survey links, memory recaps, or personalized offers.</li>
          </ul>
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={() => handleSaveConfiguration('Post-Visit Notifications')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Settings className="h-5 w-5 mr-2" /> Configure
            </button>
            <button
              onClick={() => openContentEditorModal('add', 'postVisit')}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <Plus className="h-5 w-5 mr-2" /> Add New
            </button>
          </div>
        </div>
      </div>

      {/* Notification Content Editor */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <Edit className="h-6 w-6 mr-2 text-gray-600" /> Notification Content Editor
        </h3>
        <p className="text-gray-600 mb-4">
          For each notification trigger, administrators can access a dedicated text editor or template builder
          to modify the exact wording, add dynamic fields (e.g., visitor name, booking ID), and preview the message.
        </p>
        <div className="flex justify-end">
            <button
              onClick={() => openContentEditorModal('edit')} // Default to edit mode without specific category/type
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <Edit className="h-5 w-5 mr-2" /> Open Content Editor
            </button>
          </div>
      </div>

      {/* Delivery Channel Configuration */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <Phone className="h-6 w-6 mr-2 text-teal-600" /> Delivery Channel Configuration
        </h3>
        <p className="text-gray-600 mb-4">
          Configure preferred delivery methods for various notification types.
        </p>
        <div className="space-y-4">
          {/* Email Toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <label htmlFor="toggle-email" className="flex items-center text-gray-700 text-base font-semibold cursor-pointer">
              <Mail className="inline-block h-5 w-5 mr-2 text-red-500" /> Email
            </label>
            <label htmlFor="toggle-email" className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="toggle-email"
                className="sr-only peer"
                checked={deliveryChannels.email}
                onChange={() => handleToggleDeliveryChannel('email')}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* WhatsApp Toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <label htmlFor="toggle-whatsapp" className="flex items-center text-gray-700 text-base font-semibold cursor-pointer">
              <MessageSquare className="inline-block h-5 w-5 mr-2 text-green-500" /> WhatsApp
            </label>
            <label htmlFor="toggle-whatsapp" className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="toggle-whatsapp"
                className="sr-only peer"
                checked={deliveryChannels.whatsApp}
                onChange={() => handleToggleDeliveryChannel('whatsApp')}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* SMS Toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <label htmlFor="toggle-sms" className="flex items-center text-gray-700 text-base font-semibold cursor-pointer">
              <Phone className="inline-block h-5 w-5 mr-2 text-blue-500" /> SMS
            </label>
            <label htmlFor="toggle-sms" className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="toggle-sms"
                className="sr-only peer"
                checked={deliveryChannels.sms}
                onChange={() => handleToggleDeliveryChannel('sms')}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
        <p className="text-gray-600 mt-4">
          Administrators can prioritize channels, set fallback options, and integrate with third-party messaging services.
        </p>
        <div className="flex justify-end">
            <button
              onClick={() => handleSaveConfiguration('Delivery Channel Configuration')}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <Settings className="h-5 w-5 mr-2" /> Save Channel Settings
            </button>
          </div>
      </div>

      {/* Notification Content Editor Modal */}
      {isContentEditorModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-2xl w-full relative animate-scale-in transform transition-all duration-300 ease-out border border-gray-200 overflow-y-auto max-h-[90vh]">
            <button
              onClick={closeContentEditorModal}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 hover:text-gray-900 flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              aria-label="Close modal"
            >
              <XCircle className="h-6 w-6" />
            </button>
            <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">{isAddMode ? 'Add New Notification Template' : 'Edit Notification Content'}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="category-select" className="block text-gray-700 text-sm font-semibold mb-1">Notification Category</label>
                <select
                  id="category-select"
                  value={selectedTemplateCategory}
                  onChange={(e) => {
                    setSelectedTemplateCategory(e.target.value);
                    // Reset selected type to the first one in the new category
                    const newCategory = notificationOptions.find(opt => opt.category === e.target.value);
                    if (newCategory && newCategory.types.length > 0 && !isAddMode) { // Only set default type if not in add mode
                      setSelectedTemplateType(newCategory.types[0].value);
                    } else {
                      setSelectedTemplateType('');
                    }
                  }}
                  className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {notificationOptions.map(option => (
                    <option key={option.category} value={option.category}>{option.label}</option>
                  ))}
                </select>
              </div>
              {isAddMode ? (
                <>
                  <div>
                    <label htmlFor="new-type-value" className="block text-gray-700 text-sm font-semibold mb-1">New Notification Type Value (e.g., newFeatureAlert)</label>
                    <input
                      type="text"
                      id="new-type-value"
                      value={newNotificationValue}
                      onChange={(e) => setNewNotificationValue(e.target.value)}
                      className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., newFeatureAlert"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="new-type-label" className="block text-gray-700 text-sm font-semibold mb-1">New Notification Label (e.g., New Feature Alert)</label>
                    <input
                      type="text"
                      id="new-type-label"
                      value={newNotificationLabel}
                      onChange={(e) => setNewNotificationLabel(e.target.value)}
                      className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., New Feature Alert"
                      required
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label htmlFor="type-select" className="block text-gray-700 text-sm font-semibold mb-1">Notification Type</label>
                  <select
                    id="type-select"
                    value={selectedTemplateType}
                    onChange={(e) => setSelectedTemplateType(e.target.value)}
                    className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {getTypesForSelectedCategory().map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="content-editor" className="block text-gray-700 text-sm font-semibold mb-1">Message Content</label>
              <textarea
                id="content-editor"
                value={currentEditedContent}
                onChange={handleContentChange}
                rows="8"
                className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">Use placeholders like {'{VisitorName}'}, {'{BookingID}'}, {'{Date}'}, etc., which will be dynamically replaced.</p>
            </div>

            <div className="flex justify-end space-x-4 mt-6 border-t pt-4">
              <button
                type="button"
                onClick={closeContentEditorModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-5 rounded-lg transition-colors duration-200 shadow-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveContent}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg flex items-center transition-colors duration-200 shadow-md"
              >
                <Save className="h-5 w-5 mr-2" /> {isAddMode ? 'Add Notification' : 'Save Content'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationManagement;
