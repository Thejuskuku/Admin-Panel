import React, { useContext } from 'react'; // Added useContext
import {
  Home, Users, Ticket, LayoutGrid, Building, Plus, DollarSign, BarChart, FileText,
  SlidersHorizontal, Key, ClipboardList, HelpCircle, BellRing, XCircle, LogOut // Added LogOut icon
} from 'lucide-react';
import { AdminDashboardContext } from '../App.jsx'; // Import AdminDashboardContext

const Sidebar = ({ setCurrentView }) => {
  // Use useContext to get the logout function from AdminDashboardContext
  const { logout } = useContext(AdminDashboardContext);

  const navItems = [
    { name: 'Dashboard', icon: Home, view: 'dashboard' },
    { name: 'Visitor Management', icon: Users, view: 'users' },
    { name: 'Booking Management', icon: Ticket, view: 'bookings' },
    { name: 'Bulk Booking Management', icon: ClipboardList, view: 'bulkBookings' },
    { name: 'Group Management', icon: LayoutGrid, view: 'groups' },
    { name: 'Room Management', icon: Building, view: 'rooms' },
    { name: 'Add-on Management', icon: Plus, view: 'addOns' },
    { name: 'Payment Management', icon: DollarSign, view: 'payments' },
    { name: 'Invoice Management', icon: FileText, view: 'invoices' },
    { name: 'Reports & Analytics', icon: BarChart, view: 'reports' },
    { name: 'Notification Management', icon: BellRing, view: 'notifications' },
    { name: 'Feature Toggles & Settings', icon: SlidersHorizontal, view: 'settings' },
    { name: 'Admin Accounts', icon: Key, view: 'adminAccounts' },
    { name: 'Requests', icon: HelpCircle, view: 'requests' },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col p-6 shadow-xl relative z-10">
      <h1 className="text-2xl font-bold text-indigo-400 mb-8 text-center">Admin Panel</h1>
      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="mb-2">
              <button
                onClick={() => setCurrentView(item.view)}
                className="flex items-center w-full py-3 px-4 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <item.icon className="h-6 w-6 mr-3 text-gray-400 group-hover:text-white transition-colors duration-200" />
                <span>{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto pt-6 border-t border-gray-700">
        <button
          onClick={logout} // Calls the logout function provided by AdminDashboardContext
          className="flex items-center w-full py-3 px-4 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <LogOut className="h-6 w-6 mr-3 text-gray-400 group-hover:text-white transition-colors duration-200" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
