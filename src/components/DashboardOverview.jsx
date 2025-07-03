import React, { useState, useContext } from 'react';
import { AdminDashboardContext } from '../App'; // Import context
import { Ticket, Users, DollarSign, CalendarDays, MapPin, CheckCircle, UserPlus, Bell, TrendingUp, TrendingDown, ChevronLeft, ChevronRight, CreditCard } from 'lucide-react'; // Added CreditCard icon

// Import date-fns for date manipulation directly within the component
// This would typically be installed via npm/yarn, but for Canvas, CDN is used.
// For a production app, you'd install: npm install date-fns
// For now, let's assume global availability or local import if bundled.
// For demonstration, we'll keep the logic simple, avoiding direct CDN import in JSX.
// Assuming date-fns functions are available or implemented manually for the demo.
const addMonths = (date, amount) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + amount);
  return d;
};
const startOfMonth = (date) => {
  const d = new Date(date);
  d.setDate(1);
  return d;
};
const endOfMonth = (date) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1);
  d.setDate(0);
  return d;
};
const startOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay(); // Sunday - Saturday : 0 - 6
  const diff = d.getDate() - day; // adjust when day is sunday
  d.setDate(diff);
  return d;
};
const addDays = (date, amount) => {
  const d = new Date(date);
  d.setDate(d.getDate() + amount);
  return d;
};
const isSameMonth = (date1, date2) => date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
const isSameDay = (date1, date2) => date1.getDate() === date2.getDate() && isSameMonth(date1, date2);
const format = (date, fmt) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  if (fmt === 'yyyy-MM-dd') return `${year}-${month}-${day}`;
  if (fmt === 'MMMMLLLL') return d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  return d.toLocaleDateString();
};

// New utility function to format "time ago" (simplified for demo)
const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = seconds / 60;
  if (interval >= 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};


const DashboardOverview = () => {
  const { data } = useContext(AdminDashboardContext);

  const timePeriods = ['daily', 'weekly', 'monthly', 'yearly', 'allTime'];
  const [globalTimePeriod, setGlobalTimePeriod] = useState('allTime');

  // State for the calendar's current month
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const simulateMetricData = (metricName, period) => {
    const metricData = data.simulatedMetrics[metricName];
    if (metricData && metricData[period] !== undefined) {
      return metricData[period];
    }
    if (metricName === 'totalBookings') return data.bookings.length;
    if (metricName === 'totalSales') return data.bookings.reduce((sum, b) => sum + b.amount, 0);
    if (metricName === 'currentDayBookings') return data.currentDayBookings;
    return 0;
  };

  // Simulates payment data based on the period
  const simulatePaymentModeData = (mode, period) => {
    // This is hardcoded for demonstration. In a real app, this would query backend.
    const base = {
      'Online': { daily: 15, weekly: 100, monthly: 450, yearly: 5000, allTime: 12345 },
      'Counter': { daily: 5, weekly: 30, monthly: 120, yearly: 1500, allTime: 3456 },
      'Kiosk': { daily: 8, weekly: 50, monthly: 200, yearly: 2500, allTime: 5678 }
    };
    return base[mode][period] || 0;
  };


  const generateRandomPercentage = () => {
    const isIncrease = Math.random() > 0.5;
    const percentage = (Math.random() * 10 + 1).toFixed(1);
    return { value: percentage, isIncrease };
  };

  const { value: bookingsPercentage, isIncrease: bookingsIsIncrease } = generateRandomPercentage();
  const { value: salesPercentage, isIncrease: salesIsIncrease } = generateRandomPercentage();

  const generateSlotRush = () => {
    const rushLevels = ['Low', 'Medium', 'High'];
    const randomIndex = Math.floor(Math.random() * rushLevels.length);
    return rushLevels[randomIndex];
  };

  const timeSlots = [];
  for (let i = 11; i <= 18; i++) {
    const hour = i > 12 ? i - 12 : i;
    const ampm = i >= 12 ? 'PM' : 'AM';
    timeSlots.push({
      time: `${hour}:00 ${ampm}`,
      rush: generateSlotRush()
    });
  }

  const getRushBorderColor = (rush) => {
    switch (rush) {
      case 'Low':
        return 'border-green-500';
      case 'Medium':
        return 'border-yellow-500';
      case 'High':
        return 'border-red-500';
      default:
        return 'border-gray-300';
    }
  };

  // Calendar Logic
  const today = new Date();
  const maxBookingDate = addDays(today, 90); // 90 days from today

  const bookedDates = data.bookings.map(booking => new Date(booking.date));

  const daysInMonth = () => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfMonth(currentMonth);
    const endDate = addDays(end, 6 - end.getDay()); // End of week containing end of month
    const days = [];
    let day = start;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  };

  const hasBooking = (date) => {
    return bookedDates.some(bookedDate => isSameDay(bookedDate, date));
  };

  const handlePrevMonth = () => {
    setCurrentMonth(addMonths(currentMonth, -1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Calculate max value for bar graph scaling
  const paymentModes = ['Online', 'Counter', 'Kiosk'];
  const maxPaymentValue = Math.max(
    ...paymentModes.map(mode => simulatePaymentModeData(mode, globalTimePeriod))
  );

  // Simulated Recent Activities with timestamps
  const recentActivities = [
    { id: 1, message: 'New booking by John Doe', type: 'success', timestamp: new Date(Date.now() - Math.random() * 60000) }, // Up to 1 minute ago
    { id: 2, message: 'Jane Smith updated her profile', type: 'info', timestamp: new Date(Date.now() - Math.random() * 300000) }, // Up to 5 minutes ago
    { id: 3, message: 'System maintenance notification sent', type: 'warning', timestamp: new Date(Date.now() - Math.random() * 60000 * 10) }, // Up to 10 minutes ago
    { id: 4, message: 'New admin account created for "editor"', type: 'success', timestamp: new Date(Date.now() - Math.random() * 60000 * 2) }, // Up to 2 minutes ago
    { id: 5, message: 'VIP Lounge capacity updated', type: 'info', timestamp: new Date(Date.now() - Math.random() * 60000 * 15) }, // Up to 15 minutes ago
  ];


  return (
    <div className="p-8 bg-gray-50 min-h-screen md:pb-24">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h2>

      {/* Global Time Period Selector */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-700">View Data By:</h3>
        <select
          value={globalTimePeriod}
          onChange={(e) => setGlobalTimePeriod(e.target.value)}
          className="shadow-sm appearance-none border rounded-md py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
        >
          {timePeriods.map(period => (
            <option key={period} value={period} className="capitalize">
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Bookings Card */}
        <div
          className="bg-white p-6 rounded-xl shadow-lg border-l-8 border-blue-500 flex flex-col justify-between transition-all duration-300 hover:scale-105"
          title={`Total Bookings for ${globalTimePeriod}`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700">Total Bookings</h3>
            <Ticket className="h-8 w-8 text-blue-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-4xl font-bold text-blue-600">{simulateMetricData('totalBookings', globalTimePeriod)}</p>
            <span className={`flex items-center text-lg font-semibold ml-2 ${bookingsIsIncrease ? 'text-green-600' : 'text-red-600'}`}>
              {bookingsIsIncrease ? <TrendingUp className="h-5 w-5 mr-1" /> : <TrendingDown className="h-5 w-5 mr-1" />}
              {bookingsPercentage}%
            </span>
          </div>
          <p className="text-sm text-gray-500 capitalize mt-2">Period: {globalTimePeriod}</p>
        </div>

        {/* Active Users Card (Fixed to Current Day) */}
        <div
          className="bg-white p-6 rounded-xl shadow-lg border-l-8 border-cyan-500 flex flex-col justify-between transition-all duration-300 hover:scale-105"
          title="Active Users in Park Currently"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700">Active Users</h3>
            <MapPin className="h-8 w-8 text-cyan-500" />
          </div>
          <p className="text-4xl font-bold text-cyan-600">{data.activePeopleInPark}/123</p>
          <p className="text-sm text-gray-500 capitalize mt-2">Current Day</p>
        </div>

        {/* Total Sales Card (Now includes percentage and uses globalTimePeriod) */}
        <div
          className="bg-white p-6 rounded-xl shadow-lg border-l-8 border-purple-500 flex flex-col justify-between transition-all duration-300 hover:scale-105"
          title={`Total Sales for ${globalTimePeriod}`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700">Total Sales</h3>
            <DollarSign className="h-8 w-8 text-purple-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-4xl font-bold text-purple-600">${simulateMetricData('totalSales', globalTimePeriod).toFixed(2)}</p>
            <span className={`flex items-center text-lg font-semibold ml-2 ${salesIsIncrease ? 'text-green-600' : 'text-red-600'}`}>
              {salesIsIncrease ? <TrendingUp className="h-5 w-5 mr-1" /> : <TrendingDown className="h-5 w-5 mr-1" />}
              {salesPercentage}%
            </span>
          </div>
          <p className="text-sm text-gray-500 capitalize mt-2">Period: {globalTimePeriod}</p>
        </div>

        {/* SLOTS AVAILABILITY CARD */}
        <div
          className="bg-white p-6 rounded-xl shadow-lg border-l-8 border-orange-500 flex flex-col transition-all duration-300 hover:scale-105 overflow-hidden"
          title="Time Slot Availability and Rush"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700">Slots Availability</h3>
            <CalendarDays className="h-8 w-8 text-orange-500" />
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            {timeSlots.map((slot, index) => (
              <div
                key={index}
                className={`p-2 rounded-md border-b-4 ${getRushBorderColor(slot.rush)} bg-gray-50 shadow-sm`}
              >
                <p className="text-md font-semibold text-gray-800">{slot.time}</p>
                <p className={`text-sm font-medium ${slot.rush === 'Low' ? 'text-green-600' : slot.rush === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                  {slot.rush} Rush
                </p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">Today's Slots</p>
        </div>

        {/* UPCOMING BOOKINGS CARD (Calendar View) */}
        <div
          className="bg-white p-6 rounded-xl shadow-lg border-l-8 border-blue-500 flex flex-col transition-all duration-300 hover:scale-105 overflow-hidden"
          title="Upcoming Bookings Calendar (90 days advance booking)"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700">Upcoming Bookings</h3>
            <CalendarDays className="h-8 w-8 text-blue-500" /> {/* Changed icon color for distinction */}
          </div>

          {/* Calendar Header */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
            <span className="text-lg font-semibold text-gray-800">
              {format(currentMonth, 'MMMMLLLL')}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-500 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-sm">
            {daysInMonth().map((day, index) => {
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, today);
              const isBooked = hasBooking(day);
              const isPastDate = day < today && !isSameDay(day, today);
              const isBeyond90Days = day > maxBookingDate;

              return (
                <div
                  key={index}
                  className={`p-2 rounded-md flex items-center justify-center cursor-pointer relative
                    ${isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}
                    ${isToday ? 'bg-blue-200 font-bold text-blue-800' : ''}
                    ${isBooked ? 'bg-green-200 text-green-800 font-semibold' : ''}
                    ${isPastDate || isBeyond90Days ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-70' : 'hover:bg-gray-100'}
                  `}
                  title={isBooked ? 'Bookings on this day' : isBeyond90Days ? 'Booking not available beyond 90 days' : 'No bookings'}
                >
                  {day.getDate()}
                </div>
              );
            })}
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">
            Booking available up to 90 days in advance.
          </p>
        </div>

        {/* PAYMENT MODES SECTION (Bar Graph Style - Rounded Rectangles) */}
        <div
          className="bg-white p-6 rounded-xl shadow-lg border-l-8 border-red-500 flex flex-col justify-between transition-all duration-300 hover:scale-105"
          title={`Payment Modes by ${globalTimePeriod}`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700">Payment Modes</h3>
            <CreditCard className="h-8 w-8 text-red-500" />
          </div>
          <div className="space-y-4">
            {paymentModes.map(mode => {
              const value = simulatePaymentModeData(mode, globalTimePeriod);
              const barWidthPercentage = maxPaymentValue > 0 ? (value / maxPaymentValue) * 100 : 0;
              const barColor =
                mode === 'Online' ? 'bg-blue-500' :
                mode === 'Counter' ? 'bg-green-500' :
                mode === 'Kiosk' ? 'bg-purple-500' : 'bg-gray-400';

              return (
                <div key={mode} className="flex items-center">
                  <span className="font-medium text-gray-800 w-20">{mode}:</span>
                  <div className="flex-grow bg-gray-200 rounded-md h-6 relative ml-2">
                    <div
                      className={`h-full rounded-md ${barColor}`}
                      style={{ width: `${barWidthPercentage}%` }}
                    ></div>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-bold text-white text-shadow-sm">
                      {value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-sm text-gray-500 capitalize mt-4">Period: {globalTimePeriod}</p>
        </div>

      </div> {/* End of grid */}

      <div className="bg-white p-6 rounded-xl shadow-lg border-l-8 border-gray-400">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Recent Activity (Simulated)</h3>
        <ul className="space-y-3">
          {recentActivities.map(activity => (
            <li key={activity.id} className="flex items-center justify-between text-gray-600">
              <div className="flex items-center">
                {activity.type === 'success' && <CheckCircle className="h-5 w-5 text-green-500 mr-2" />}
                {activity.type === 'info' && <UserPlus className="h-5 w-5 text-blue-500 mr-2" />}
                {activity.type === 'warning' && <Bell className="h-5 w-5 text-yellow-500 mr-2" />}
                <span>{activity.message}</span>
              </div>
              <span className="text-xs text-gray-500 ml-4">{formatTimeAgo(activity.timestamp)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardOverview;
