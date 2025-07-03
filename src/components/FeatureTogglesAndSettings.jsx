import React, { useState, useContext } from 'react';
import { AdminDashboardContext } from '../App.jsx'; // Adjusted import path for context
import { SlidersHorizontal, Settings, CheckCircle, XCircle, ToggleRight } from 'lucide-react'; // Icons

const FeatureTogglesAndSettings = () => {
  const { data, toggleFeature, updateSetting, simulateApiCall } = useContext(AdminDashboardContext);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isSavingSetting, setIsSavingSetting] = useState(false);

  const handleSettingChange = async (settingName, value) => {
    setIsSavingSetting(true);
    setMessage('');
    await updateSetting(settingName, value);
    setMessage('Setting updated successfully!');
    setMessageType('success');
    setIsSavingSetting(false);
  };

  const handleToggle = async (featureName) => {
    setMessage('');
    await toggleFeature(featureName);
    setMessage(`Feature '${featureName}' toggled successfully!`);
    setMessageType('success');
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen md:pb-24">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Feature Toggles & System Settings</h2>

      {message && (
        <div className={`p-4 mb-6 rounded-lg flex items-center ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {messageType === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <XCircle className="h-5 w-5 mr-2" />}
          {message}
        </div>
      )}

      {/* Feature Toggles Section */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <SlidersHorizontal className="h-6 w-6 mr-2 text-blue-600" /> Feature Toggles
        </h3>
        <p className="text-gray-600 mb-4">Control the availability of new or experimental features across the platform.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(data.featureToggles).map(([featureName, isEnabled]) => (
            <div key={featureName} className="bg-gray-50 p-4 rounded-lg shadow-sm flex items-center justify-between">
              <span className="text-gray-800 font-medium capitalize">{featureName.replace(/([A-Z])/g, ' $1')}</span>
              <button
                onClick={() => handleToggle(featureName)}
                className={`toggle-button ${isEnabled ? 'active' : ''}`}
              >
                <span className="toggle-button-handle" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <Settings className="h-6 w-6 mr-2 text-purple-600" /> System Settings
        </h3>
        <p className="text-gray-600 mb-4">Configure global operational parameters of the system.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(data.systemSettings).map(([key, value]) => (
            <div key={key} className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </label>
              <input
                type={typeof value === 'number' ? 'number' : 'text'}
                value={value}
                onChange={(e) => handleSettingChange(key, typeof value === 'number' ? parseFloat(e.target.value) : e.target.value)}
                className="shadow-sm appearance-none border rounded-md w-full py-2 px-3 bg-white text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>
          ))}
        </div>
        {isSavingSetting && (
          <p className="text-sm text-gray-500 mt-4 flex items-center">
            <span className="animate-spin mr-2">⚙️</span> Saving settings...
          </p>
        )}
      </div>
    </div>
  );
};

export default FeatureTogglesAndSettings;
