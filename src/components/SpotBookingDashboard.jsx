import React, { useState, useContext, useEffect, useRef } from 'react';
import { AdminDashboardContext } from '../App';
import { Search, UserPlus, ReceiptText, Mail, XCircle, ShoppingCart, Tag, DollarSign as DollarIcon, Wallet, HandCoins, CreditCard, ScanText, BellRing, SquarePen, AlertTriangle, Ticket, Plus } from 'lucide-react';

// Notification component to display temporary messages
const Notification = ({ message, type, onClose }) => {
  const typeStyles = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  };

  const bgColorClass = typeStyles[type] || typeStyles.info;

  return (
    <div className={`p-3 rounded-lg shadow-lg text-white text-sm flex items-center space-x-2 transition-all duration-300 transform translate-x-0 opacity-100 ${bgColorClass}`}>
      <span>{message}</span>
      <button className="ml-auto text-white opacity-75 hover:opacity-100" onClick={onClose}>
        <XCircle className="h-4 w-4" />
      </button>
    </div>
  );
};

// Main SpotBookingDashboard component
const SpotBookingDashboard = () => {
  // Access data and functions from the AdminDashboardContext
  const { data, addData, updateData, simulateApiCall } = useContext(AdminDashboardContext);

  // State variables for the dashboard's functionality
  const [order, setOrder] = useState([]); // Stores items currently in the order
  const [currentDiscount, setCurrentDiscount] = useState(0); // Current discount applied
  const [selectedCustomer, setSelectedCustomer] = useState({ // Details of the selected customer
    id: 'walkin',
    name: 'Walk-in Customer',
    email: 'N/A',
    phone: 'N/A',
    loyaltyPoints: 0,
    pastBookings: 'None'
  });
  const [newCustomerName, setNewCustomerName] = useState(''); // Input for new customer name
  const [newCustomerEmail, setNewCustomerEmail] = useState(''); // Input for new customer email
  const [newCustomerPhone, setNewCustomerPhone] = useState(''); // Input for new customer phone
  const [discountCode, setDiscountCode] = useState(''); // Input for discount code
  const [cashTendered, setCashTendered] = useState(''); // Input for cash tendered
  const [notifications, setNotifications] = useState([]); // List of active notifications

  // Ref to manage notification timeouts for auto-dismissal
  const notificationTimeoutRefs = useRef({});

  // Effect hook to clear notification timeouts on component unmount
  useEffect(() => {
    return () => {
      Object.values(notificationTimeoutRefs.current).forEach(clearTimeout);
    };
  }, []);

  // Function to display a new notification
  const showNotification = (message, type = 'info') => {
    const id = Date.now(); // Unique ID for the notification
    setNotifications(prev => [...prev, { id, message, type }]); // Add new notification to state

    // Set a timeout to automatically dismiss the notification
    const timeout = setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id)); // Remove notification from state
      delete notificationTimeoutRefs.current[id]; // Clear the timeout reference
    }, 5000); // Notification disappears after 5 seconds
    notificationTimeoutRefs.current[id] = timeout; // Store timeout reference
  };

  // Function to manually close a notification
  const closeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id)); // Remove notification from state
    if (notificationTimeoutRefs.current[id]) {
      clearTimeout(notificationTimeoutRefs.current[id]); // Clear the associated timeout
      delete notificationTimeoutRefs.current[id]; // Delete the timeout reference
    }
  };

  // Function to calculate subtotal and total amount of the current order
  const calculateTotals = () => {
    let subtotal = order.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let total = subtotal - currentDiscount;
    return { subtotal, total: Math.max(0, total) }; // Ensure total doesn't go negative
  };

  // Handles quantity changes for tickets and add-ons using the +/- buttons
  const handleQuantityChange = (type, itemId, change) => {
    setOrder(prevOrder => {
      const existingItemIndex = prevOrder.findIndex(item => item.id === itemId);
      let newOrder = [...prevOrder];

      if (existingItemIndex > -1) {
        const itemBeforeUpdate = newOrder[existingItemIndex]; // Store reference before potential modification
        newOrder[existingItemIndex].quantity = Math.max(0, newOrder[existingItemIndex].quantity + change);

        if (newOrder[existingItemIndex].quantity === 0) {
          showNotification(`${itemBeforeUpdate?.name || 'Item'} removed from order.`, 'info'); // Use stored name with fallback
          newOrder = newOrder.filter(item => item.id !== itemId);
        } else {
          showNotification(`Updated quantity for ${itemBeforeUpdate?.name || 'Item'}.`, 'info'); // Use stored name with fallback
        }
      } else if (change > 0) {
        // If item doesn't exist and quantity is increasing, add it to the order
        // Ensure type has 'name' and 'baseCost'/'price'
        if (type && type.name && (type.baseCost !== undefined || type.price !== undefined)) {
          newOrder.push({
            id: itemId,
            name: type.name,
            price: type.baseCost !== undefined ? type.baseCost : type.price,
            quantity: change,
            isTicket: !!data?.ticketTypes?.find(t => t.id === itemId) // Added optional chaining for data.ticketTypes
          });
          showNotification(`${type.name} added to order.`, 'success');
        } else {
          console.error("Attempted to add item with missing 'name', 'baseCost', or 'price':", type);
          showNotification('Could not add item: missing price or name.', 'error');
        }
      }
      return newOrder;
    });
  };

  // Handles manual input quantity changes for tickets and add-ons
  const handleManualQuantityChange = (itemId, value) => {
    const quantity = parseInt(value) || 0;
    setOrder(prevOrder => {
      const existingItemIndex = prevOrder.findIndex(item => item.id === itemId);
      let newOrder = [...prevOrder];

      if (existingItemIndex > -1) {
        newOrder[existingItemIndex].quantity = Math.max(0, quantity);
        if (newOrder[existingItemIndex].quantity === 0) {
          showNotification(`${newOrder[existingItemIndex]?.name || 'Item'} removed from order.`, 'info'); // Use name with fallback
          newOrder = newOrder.filter(item => item.id !== itemId);
        } else {
          showNotification(`Updated quantity for ${newOrder[existingItemIndex]?.name || 'Item'}.`, 'info'); // Use name with fallback
        }
      } else if (quantity > 0) {
        const itemData = data?.ticketTypes?.find(t => t.id === itemId) || data?.addOns?.find(a => a.id === itemId); // Added optional chaining
        if (itemData && itemData.name && (itemData.baseCost !== undefined || itemData.price !== undefined)) {
          newOrder.push({
            id: itemId,
            name: itemData.name,
            price: itemData.baseCost !== undefined ? itemData.baseCost : itemData.price,
            quantity: quantity,
            isTicket: !!data?.ticketTypes?.find(t => t.id === itemId) // Added optional chaining
          });
          showNotification(`${itemData.name} added to order.`, 'success');
        } else {
          console.error("Attempted to add item with missing 'name', 'baseCost', or 'price':", itemData);
          showNotification('Could not add item: missing price or name.', 'error');
        }
      }
      return newOrder;
    });
  };

  // Handles applying discount code
  const handleApplyDiscount = () => {
    if (discountCode === 'SAVE10') {
      setCurrentDiscount(10.00); // Example fixed discount
      showNotification('Discount "SAVE10" applied!', 'success');
    } else if (discountCode === 'SAVE20') {
      setCurrentDiscount(20.00); // Another example fixed discount
      showNotification('Discount "SAVE20" applied!', 'success');
    } else {
      setCurrentDiscount(0); // No valid discount
      showNotification('Invalid or no discount code entered.', 'error');
    }
  };

  // Handles the payment process
  const handleProcessPayment = async () => {
    const { total } = calculateTotals(); // Get current total

    // Validate if there are items in the order
    if (order.length === 0) {
      showNotification('No items in order to process payment.', 'warning');
      return;
    }
    // Validate if cash tendered is sufficient for payment
    if (total > 0 && parseFloat(cashTendered || 0) < total) {
      showNotification('Cash tendered is less than total amount.', 'error');
      return;
    }

    // Simulate API call for payment processing and booking creation
    await simulateApiCall(async () => {
      const newBooking = {
        userId: selectedCustomer.id, // Use selected customer's ID
        userName: selectedCustomer.name,
        groupId: null, // Assuming spot bookings are usually individual
        date: new Date().toISOString().split('T')[0], // Current date (YYYY-MM-DD)
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }), // Current time
        amount: total,
        status: 'Confirmed',
        platform: 'Kiosk', // Or 'Counter' depending on context
        ticketCount: order.filter(item => item.isTicket).reduce((sum, item) => sum + item.quantity, 0), // Sum of all ticket quantities
        addOns: order.filter(item => !item.isTicket).map(item => ({ id: item.id, name: item.name, quantity: item.quantity })), // Filter out non-ticket items for add-ons
        ticketTypeId: order.find(item => item.isTicket)?.id || 'N/A' // ID of the first ticket type in the order, or 'N/A'
      };

      addData('bookings', newBooking); // Add the new booking to the global state
      showNotification('Payment processed and booking created successfully!', 'success');
      resetOrder(); // Clear the order after successful payment
    });
  };

  // Resets the entire order and related UI elements
  const resetOrder = () => {
    setOrder([]); // Clear all items from the order
    setCurrentDiscount(0); // Reset discount
    setCashTendered(''); // Clear cash tendered input
    setDiscountCode(''); // Clear discount code input
    setSelectedCustomer({ // Reset to default walk-in customer
      id: 'walkin',
      name: 'Walk-in Customer',
      email: 'N/A',
      phone: 'N/A',
      loyaltyPoints: 0,
      pastBookings: 'None'
    });
    setNewCustomerName(''); // Clear new customer fields
    setNewCustomerEmail('');
    setNewCustomerPhone('');
    showNotification('Order cleared and workstation reset.', 'info');
  };

  // Handles adding a new customer (simulated)
  const handleAddNewCustomer = () => {
    if (newCustomerName || newCustomerEmail || newCustomerPhone) {
      // In a real application, you would persist this new customer
      // to your `data.users` and assign a proper unique ID.
      const newCustId = `temp_cust_${Date.now()}`; // Simulate a new temporary ID
      setSelectedCustomer({
        id: newCustId,
        name: newCustomerName || 'New Customer',
        email: newCustomerEmail || 'N/A',
        phone: newCustomerPhone || 'N/A',
        loyaltyPoints: 0, // New customer starts with 0 loyalty points
        pastBookings: 'None'
      });
      showNotification(`Customer "${newCustomerName || 'New Customer'}" selected.`, 'info');
      setNewCustomerName(''); // Clear input fields
      setNewCustomerEmail('');
      setNewCustomerPhone('');
    } else {
      showNotification('Please enter at least one detail for the new customer.', 'warning');
    }
  };

  // Calculate totals for rendering
  const { subtotal, total } = calculateTotals();
  const changeDue = (parseFloat(cashTendered) || 0) - total; // Calculate change due

  return (
    <div className="flex flex-1 flex-col lg:flex-row bg-gray-100 text-gray-800 rounded-xl shadow-lg min-h-[80vh]">
      {/* Left Column: Sales Terminal & Product Selection */}
      <div className="lg:w-2/3 p-4 flex flex-col space-y-4">
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Spot Booking Terminal</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Logged in as: Staff User</span>
            {/* Placeholder for Logout button */}
            <button className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200">Logout</button>
          </div>
        </div>

        {/* Dynamic Dashboard Metrics (Simulated) */}
        <div id="dashboard-view" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-100 text-blue-800 p-4 rounded-lg shadow-sm flex flex-col items-center justify-center text-center">
                <p className="text-sm font-medium">Current Queue Length</p>
                <p className="text-4xl font-bold mt-1">7</p> {/* Static data for demo */}
            </div>
            <div className="bg-green-100 text-green-800 p-4 rounded-lg shadow-sm flex flex-col items-center justify-center text-center">
                <p className="text-sm font-medium">Next Available Slot</p>
                <p className="text-xl font-bold mt-1">11:45 AM</p> {/* Static data for demo */}
            </div>
            <div className="bg-purple-100 text-purple-800 p-4 rounded-lg shadow-sm flex flex-col items-center justify-center text-center">
                <p className="text-sm font-medium">Real-time Income</p>
                <p className="text-xl font-bold mt-1">${data?.simulatedMetrics?.totalSales?.daily?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg shadow-sm flex flex-col items-center justify-center text-center">
                <p className="text-sm font-medium">Total Bookings (Today)</p>
                <p className="text-xl font-bold mt-1">{data?.simulatedMetrics?.totalBookings?.daily || 0}</p>
            </div>
            <div className="bg-teal-100 text-teal-800 p-4 rounded-lg shadow-sm flex flex-col items-center justify-center text-center">
                <p className="text-sm font-medium">Active People In Park</p>
                <p className="text-xl font-bold mt-1">{data?.simulatedMetrics?.activePeopleInPark?.daily || 0}</p>
            </div>
             <div className="bg-orange-100 text-orange-800 p-4 rounded-lg shadow-sm flex flex-col items-center justify-center text-center col-span-full md:col-span-2 lg:col-span-1">
                <p className="text-sm font-medium">Pending Actions</p>
                <p className="text-xl font-bold mt-1">3 (Failed Payments)</p> {/* Static data for demo */}
            </div>
            <div className="bg-gray-200 text-gray-700 p-4 rounded-lg shadow-sm flex flex-col items-center justify-center text-center col-span-full md:col-span-2 lg:col-span-1">
                <p className="text-sm font-medium">Real-time Payment Method Count</p>
                <p className="text-md mt-1">Card: 45%, UPI: 30%, Cash: 20%, Other: 5%</p> {/* Static for demo */}
            </div>
            <div className="bg-gray-200 text-gray-700 p-4 rounded-lg shadow-sm flex flex-col items-center justify-center text-center col-span-full md:col-span-2 lg:col-span-1">
                <p className="text-sm font-medium">Real-time Activity Feed</p>
                <p className="text-md mt-1 text-left w-full"> {/* Static for demo */}
                    <span className="block text-xs"><ScanText className="inline h-4 w-4 mr-1"/> 11:30 AM: Zone A Scan</span>
                    <span className="block text-xs"><ShoppingCart className="inline h-4 w-4 mr-1"/> 11:20 AM: New Booking #2345</span>
                    <span className="block text-xs"><AlertTriangle className="inline h-4 w-4 mr-1"/> 11:15 AM: Alert: Gate 3 Offline</span>
                </p>
            </div>
        </div>

        {/* Customer Search Section */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <label htmlFor="customer-search" className="block text-sm font-medium text-gray-700 mb-2">Customer Search</label>
          <div className="relative">
            <input
              type="text"
              id="customer-search"
              placeholder="Search by name, phone, email, or booking ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              // In a real application, this input would trigger a search against your user data
              // and update the 'selectedCustomer' state based on search results.
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <div id="customer-search-results" className="mt-2 text-sm text-gray-600">
            <p className="text-gray-500">Selected: <span className="font-bold text-blue-600">{selectedCustomer.name}</span></p>
          </div>
        </div>

        {/* Tickets & Add-ons Selection Section */}
        <div className="bg-white rounded-lg shadow-md p-4 flex-1 overflow-hidden">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Tickets & Add-ons</h2>

          {/* Ticket Categories */}
          <h3 className="text-lg font-semibold text-gray-700 mb-3 mt-4 flex items-center">
            <Ticket className="h-5 w-5 mr-2 text-purple-600"/> Ticket Categories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Filter and map active ticket types from global data */}
            {data?.ticketTypes?.filter(t => t.isActive).map(type => (
              <div key={type.id} className="product-card bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{type.name}</h3>
                  <p className="text-sm text-gray-600">${type.baseCost?.toFixed(2) || '0.00'} {type.name.includes('Group') && <span className="text-xs">(per person)</span>}</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-1">
                    <button
                      className="quantity-btn bg-blue-500 text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
                      onClick={() => handleQuantityChange(type, type.id, -1)} // Decrease quantity
                    >-</button>
                    <input
                      type="number"
                      value={order.find(item => item.id === type.id)?.quantity || 0} // Display current quantity in order
                      min="0"
                      className="quantity-input w-12 text-center border border-gray-300 rounded-md text-sm"
                      onChange={(e) => handleManualQuantityChange(type.id, e.target.value)} // Handle manual input
                    />
                    <button
                      className="quantity-btn bg-blue-500 text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
                      onClick={() => handleQuantityChange(type, type.id, 1)} // Increase quantity
                    >+</button>
                  </div>
                  <button
                    className="add-to-order-btn px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition-colors duration-200"
                    onClick={() => handleQuantityChange(type, type.id, 1)} // Add 1 on click, or update existing
                  >Add</button>
                </div>
              </div>
            ))}
          </div>

          {/* Add-Ons */}
          <h3 className="text-lg font-semibold text-gray-700 mb-3 mt-4 flex items-center">
            <Plus className="h-5 w-5 mr-2 text-teal-600"/> Add-Ons
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto h-full hide-scrollbar" style={{ maxHeight: 'calc(100vh - 400px)' }}>
            {/* Filter and map active add-ons from global data */}
            {data?.addOns?.filter(a => a.isActive).map(addOn => (
              <div key={addOn.id} className="product-card bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{addOn.name}</h3>
                  <p className="text-sm text-gray-600">${addOn.price?.toFixed(2) || '0.00'}</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-1">
                    <button
                      className="quantity-btn bg-blue-500 text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
                      onClick={() => handleQuantityChange(addOn, addOn.id, -1)} // Decrease quantity
                    >-</button>
                    <input
                      type="number"
                      value={order.find(item => item.id === addOn.id)?.quantity || 0} // Display current quantity in order
                      min="0"
                      className="quantity-input w-12 text-center border border-gray-300 rounded-md text-sm"
                      onChange={(e) => handleManualQuantityChange(addOn.id, e.target.value)} // Handle manual input
                    />
                    <button
                      className="quantity-btn bg-blue-500 text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
                      onClick={() => handleQuantityChange(addOn, addOn.id, 1)} // Increase quantity
                    >+</button>
                  </div>
                  <button
                    className="add-to-order-btn px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition-colors duration-200"
                    onClick={() => handleQuantityChange(addOn, addOn.id, 1)} // Add 1 on click, or update existing
                  >Add</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Order Summary, Customer, Payment, Tools */}
      <div className="lg:w-1/3 p-4 flex flex-col space-y-4">
        {/* Order Summary Section */}
        <div className="bg-white rounded-lg shadow-md p-4 flex-grow flex flex-col">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <ShoppingCart className="h-6 w-6 mr-2 text-blue-600" /> Order Summary
          </h2>
          <div id="order-items" className="flex-grow overflow-y-auto hide-scrollbar mb-4 border-b border-gray-200 pb-4">
            {order.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No items in order.</p>
            ) : (
              order.map((item, index) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex-grow">
                    <p className="font-medium text-gray-900">{item?.name || 'Unknown Item'}</p>
                    <p className="text-sm text-gray-600">{item?.quantity || 0} x ${item?.price?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-800">${((item?.price || 0) * (item?.quantity || 0))?.toFixed(2) || '0.00'}</span>
                    <button
                      className="remove-item-btn text-red-500 hover:text-red-700 transition-colors duration-200"
                      onClick={() => {
                        setOrder(prevOrder => prevOrder.filter((_, i) => i !== index)); // Remove item by index
                        showNotification('Item removed from order.', 'info');
                      }}
                    >
                      <Trash className="h-5 w-5" /> {/* Trash icon */}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="space-y-2 text-lg">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span id="order-subtotal" className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discounts:</span>
              <span id="order-discounts" className="font-medium text-red-600">-${currentDiscount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-xl border-t pt-2 mt-2">
              <span>Total:</span>
              <span id="order-total">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Customer & Transaction Section */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <UserPlus className="h-6 w-6 mr-2 text-green-600" /> Customer & Transaction
          </h2>
          <div id="customer-details" className="mb-4">
            <h3 className="font-medium text-gray-700 mb-2">Selected Customer: <span id="selected-customer-name" className="font-bold text-blue-600">{selectedCustomer.name}</span></h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Email:</strong> <span id="selected-customer-email">{selectedCustomer.email}</span></p>
              <p><strong>Phone:</strong> <span id="selected-customer-phone">{selectedCustomer.phone}</span></p>
              <p><strong>Loyalty Points:</strong> <span id="selected-customer-loyalty">{selectedCustomer.loyaltyPoints}</span></p>
              <p><strong>Past Bookings:</strong> <span id="selected-customer-history">{selectedCustomer.pastBookings}</span></p>
            </div>
          </div>

          <div className="mb-4 border-t pt-4">
            <h3 className="font-medium text-gray-700 mb-2">New Customer Details</h3>
            <input
              type="text"
              id="new-customer-name"
              placeholder="Name"
              className="w-full p-2 border border-gray-300 rounded-md mb-2 text-sm"
              value={newCustomerName}
              onChange={(e) => setNewCustomerName(e.target.value)}
            />
            <input
              type="email"
              id="new-customer-email"
              placeholder="Email"
              className="w-full p-2 border border-gray-300 rounded-md mb-2 text-sm"
              value={newCustomerEmail}
              onChange={(e) => setNewCustomerEmail(e.target.value)}
            />
            <input
              type="tel"
              id="new-customer-phone"
              placeholder="Phone"
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              value={newCustomerPhone}
              onChange={(e) => setNewCustomerPhone(e.target.value)}
            />
            <button
              id="add-new-customer-btn"
              className="mt-2 w-full px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors duration-200 flex items-center justify-center"
              onClick={handleAddNewCustomer}
            >
              <UserPlus className="h-5 w-5 mr-2" /> Add New Customer
            </button>
          </div>

          <div className="mb-4 border-t pt-4">
            <h3 className="font-medium text-gray-700 mb-2 flex items-center">
              <Tag className="h-5 w-5 mr-2 text-yellow-600" /> Discounts & Vouchers
            </h3>
            <input
              type="text"
              id="discount-code"
              placeholder="Enter discount code"
              className="w-full p-2 border border-gray-300 rounded-md mb-2 text-sm"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
            />
            <button
              id="apply-discount-btn"
              className="w-full px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors duration-200 flex items-center justify-center"
              onClick={handleApplyDiscount}
            >
              <DollarIcon className="h-5 w-5 mr-2" /> Apply Discount
            </button>
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Wallet className="h-6 w-6 mr-2 text-pink-600" /> Payment
          </h2>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {/* Payment method buttons (static for demo) */}
            <button className="payment-method-btn px-4 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center">
              <HandCoins className="h-6 w-6 mr-2" /> Cash
            </button>
            <button className="payment-method-btn px-4 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center">
              <CreditCard className="h-6 w-6 mr-2" /> Card
            </button>
            <button className="payment-method-btn px-4 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-200">UPI</button>
            <button className="payment-method-btn px-4 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-200">Other</button>
          </div>
          <div className="mb-4">
            <label htmlFor="cash-tendered" className="block text-sm font-medium text-gray-700 mb-1">Cash Tendered:</label>
            <input
              type="number"
              id="cash-tendered"
              placeholder="0.00"
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              value={cashTendered}
              onChange={(e) => setCashTendered(e.target.value)} // Update cash tendered state
            />
          </div>
          <div className="flex justify-between text-lg font-medium mb-4">
            <span>Change Due:</span>
            <span id="change-due">${Math.max(0, changeDue).toFixed(2)}</span>
          </div>
          <button
            id="process-payment-btn"
            className="w-full px-4 py-3 bg-green-700 text-white rounded-lg text-xl font-bold hover:bg-green-800 transition-colors duration-200 shadow-lg flex items-center justify-center"
            onClick={handleProcessPayment} // Trigger payment process
          >
            <DollarIcon className="h-6 w-6 mr-2" /> Process Payment
          </button>
        </div>

        {/* Tools & Options Section */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <SquarePen className="h-6 w-6 mr-2 text-gray-600" /> Tools & Options
          </h2>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {/* Action buttons (static for demo) */}
            <button className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors duration-200">Admin Tools</button>
            <button className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors duration-200">Refund</button>
            <button className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors duration-200">Reschedule</button>
            <button className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors duration-200">Audit Logs</button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center">
              <ReceiptText className="h-5 w-5 mr-2" /> Print Receipt
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center">
              <Mail className="h-5 w-5 mr-2" /> Email Receipt
            </button>
          </div>
        </div>
      </div>

      {/* Notification Area for displaying toasts */}
      <div id="notification-area" className="fixed bottom-4 right-4 space-y-2 z-50">
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            onClose={() => closeNotification(notification.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default SpotBookingDashboard;
