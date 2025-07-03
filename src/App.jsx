import './App.css';
import React, { useState, createContext } from 'react';

// --- Context for global state and data ---
// This context will hold the shared state and functions for the dashboard.
// It's exported so other components can consume it.
export const AdminDashboardContext = createContext(); // Corrected usage: createContext is a function call

// --- Mock Data and Local Storage Persistence (now imported from data.js) ---
// This custom hook manages the application's data, including mock data and
// persistence to local storage. It provides functions to interact with this data.
import { useAdminDashboardData } from './data.js'; // Explicit .js extension for clarity and better resolution

// --- Components (now imported from the components folder) ---
// Importing all sub-components used within the main App component.
// Explicit .jsx extensions are used to ensure correct module resolution.
import AuthScreen from './components/AuthScreen.jsx';
import Sidebar from './components/Sidebar.jsx';
import DashboardOverview from './components/DashboardOverview.jsx';
import UsersManagement from './components/UsersManagement.jsx';
import BookingsManagement from './components/BookingsManagement.jsx';
import GroupsManagement from './components/GroupsManagement.jsx';
import RoomsManagement from './components/RoomsManagement.jsx';
import AddOnsManagement from './components/AddOnsManagement.jsx';
import PaymentsManagement from './components/PaymentsManagement.jsx';
import ReportsAnalytics from './components/ReportsAnalytics.jsx';
import FeatureTogglesAndSettings from './components/FeatureTogglesAndSettings.jsx';
import AdminAccounts from './components/AdminAccounts.jsx';
import BulkBookingManagement from './components/BulkBookingManagement.jsx';
import InvoiceManagement from './components/InvoiceManagement.jsx';
import NotificationManagement from './components/NotificationManagement.jsx';
import RequestsManagement from './components/RequestsManagement.jsx'; // Corrected import to match component name

const App = () => {
  // State to manage user authentication status.
  // Initially set to false, meaning the user is not logged in.
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // State to manage the currently active view/page in the dashboard.
  // Default view is 'dashboard'.
  const [currentView, setCurrentView] = useState('dashboard');

  // Destructure data and functions from the custom data hook.
  // These will be provided globally via the AdminDashboardContext.
  const { data, updateData, addData, deleteData, toggleFeature, updateSetting, simulateApiCall } = useAdminDashboardData();

  // Function to render the appropriate component based on the 'currentView' state.
  // A console log is added here to help debug which component is being attempted to render.
  const renderContent = () => {
    console.log("Current View:", currentView); // Debugging: Logs the current view
    switch (currentView) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'users':
        return <UsersManagement />;
      case 'bookings':
        return <BookingsManagement />;
      case 'groups':
        return <GroupsManagement />;
      case 'rooms':
        return <RoomsManagement />;
      case 'addOns':
        return <AddOnsManagement />;
      case 'payments':
        return <PaymentsManagement />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'notifications': // New case for Notification Management
        return <NotificationManagement />;
      case 'settings':
        return <FeatureTogglesAndSettings />;
      case 'adminAccounts':
        return <AdminAccounts />;
      case 'bulkBookings':
        return <BulkBookingManagement />;
      case 'invoices':
        return <InvoiceManagement />;
      case 'requests': // Corrected to render RequestsManagement
        return <RequestsManagement />;
      default:
        // Fallback to DashboardOverview if currentView is not recognized.
        return <DashboardOverview />;
    }
  };

  // Conditional rendering: If not authenticated, show the AuthScreen.
  // Otherwise, show the main dashboard layout.
  if (!isAuthenticated) {
    return <AuthScreen onLogin={setIsAuthenticated} />;
  }

  // Main application layout, wrapped with the AdminDashboardContext.Provider.
  // This makes 'data', 'updateData', etc., available to all child components.
  return (
    <AdminDashboardContext.Provider value={{ data, updateData, addData, deleteData, toggleFeature, updateSetting, simulateApiCall }}>
      <div className="flex min-h-screen">
        {/* Sidebar component for navigation */}
        <Sidebar setCurrentView={setCurrentView} />
        {/* Main content area where different views are rendered */}
        <main className="flex-grow p-8 bg-gray-50 md:pb-24">
          {renderContent()}
        </main>
      </div>
    </AdminDashboardContext.Provider>
  );
};

export default App;
