import React, { useState, useEffect } from 'react';

// --- Utility Functions ---
export const generateUniqueId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Helper function to create dependent users from initial structure
const createDependentUsers = (parentId, parentName, parentPhone, dependentsArray) => {
  return dependentsArray.map(dep => ({
    id: generateUniqueId(),
    name: dep.name,
    email: `${dep.name.toLowerCase().replace(/\s/g, '.')}-${parentId.substring(0,4)}@example.com`,
    phone: parentPhone,
    type: 'Dependent',
    status: 'Active',
    parentId: parentId,
    lastLogin: null,
    pointsEarned: 0,
    zonesCovered: [],
    numVisits: 0
  }));
};

const initialUsersRaw = [
  { id: generateUniqueId(), name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890', type: 'Full User', status: 'Active', dependents: [], lastLogin: '2023-10-26T10:00:00Z', pointsEarned: 1250, zonesCovered: ['Gaming Zone', 'Discovery Hub'], numVisits: 5, facePhotoStatus: 'Captured', seasonalPass: true },
  { id: generateUniqueId(), name: 'Jane Smith', email: 'jane.smith@example.com', phone: '987-654-3210', type: 'Full User', status: 'Active', dependents: [{ name: 'Billy Smith', type: 'Dependent' }], lastLogin: '2023-10-25T14:30:00Z', pointsEarned: 2300, zonesCovered: ['MakerSpace', 'Art Gallery', 'Discovery Hub'], numVisits: 8, facePhotoStatus: 'Pending', seasonalPass: false },
  { id: generateUniqueId(), name: 'Admin User', email: 'admin@example.com', phone: '555-123-4567', type: 'Admin', status: 'Active', dependents: [], lastLogin: '2023-10-26T15:00:00Z', pointsEarned: 0, zonesCovered: [], numVisits: 0, facePhotoStatus: 'Captured', seasonalPass: false },
  { id: generateUniqueId(), name: 'Alice Johnson', email: 'alice.j@example.com', phone: '111-222-3333', type: 'Full User', status: 'Suspended', dependents: [], lastLogin: '2023-10-24T09:00:00Z', pointsEarned: 500, zonesCovered: ['Gaming Zone'], numVisits: 2, facePhotoStatus: 'Pending', seasonalPass: true },
  { id: generateUniqueId(), name: 'Robert Brown', email: 'robert.b@example.com', phone: '444-555-6666', type: 'Full User', status: 'Active', dependents: [], lastLogin: '2023-10-26T11:45:00Z', pointsEarned: 800, zonesCovered: ['VR Experience', 'Discovery Hub'], numVisits: 3, facePhotoStatus: 'Captured', seasonalPass: false },
  { id: generateUniqueId(), name: 'Emily White', email: 'emily.w@example.com', phone: '777-888-9999', type: 'Full User', status: 'Active', dependents: [{ name: 'Max White', type: 'Dependent' }, { name: 'Lily White', type: 'Dependent' }], lastLogin: '2023-10-25T16:00:00Z', pointsEarned: 3500, zonesCovered: ['MakerSpace', 'Art Gallery', 'Gaming Zone', 'VR Experience'], numVisits: 12, facePhotoStatus: 'Captured', seasonalPass: true },
  { id: generateUniqueId(), name: 'Michael Green', email: 'michael.g@example.com', phone: '222-333-4444', type: 'Full User', status: 'Active', dependents: [], lastLogin: '2023-10-26T09:10:00Z', pointsEarned: 150, zonesCovered: ['Cafeteria'], numVisits: 1, facePhotoStatus: 'Pending', seasonalPass: false },
  { id: generateUniqueId(), name: 'Sarah Black', email: 'sarah.b@example.com', phone: '666-777-8888', type: 'Full User', status: 'Active', dependents: [], lastLogin: '2023-10-24T18:20:00Z', pointsEarned: 1800, zonesCovered: ['Discovery Hub', 'Science Lab'], numVisits: 7, facePhotoStatus: 'Captured', seasonalPass: true },
  { id: generateUniqueId(), name: 'David Blue', email: 'david.bl@example.com', phone: '999-000-1111', type: 'Full User', status: 'Suspended', dependents: [], lastLogin: '2023-10-23T12:00:00Z', pointsEarned: 0, zonesCovered: [], numVisits: 0, facePhotoStatus: 'Pending', seasonalPass: false },
  { id: generateUniqueId(), name: 'Olivia Red', email: 'olivia.r@example.com', phone: '333-222-1111', type: 'Full User', status: 'Active', dependents: [{ name: 'Leo Red', type: 'Dependent' }], lastLogin: '2023-10-26T13:00:00Z', pointsEarned: 950, zonesCovered: ['Gaming Zone'], numVisits: 4, facePhotoStatus: 'Captured', seasonalPass: true },
  { id: generateUniqueId(), name: 'Chris Grey', email: 'chris.g@example.com', phone: '123-123-1234', type: 'Full User', status: 'Active', dependents: [], lastLogin: '2023-10-26T10:30:00Z', pointsEarned: 2100, zonesCovered: ['MakerSpace', 'VR Experience', 'Discovery Hub'], numVisits: 9, facePhotoStatus: 'Captured', seasonalPass: true },
  { id: generateUniqueId(), name: 'Sophia Pink', email: 'sophia.p@example.com', phone: '555-444-3333', type: 'Full User', status: 'Active', dependents: [], lastLogin: '2023-10-25T11:00:00Z', pointsEarned: 600, zonesCovered: ['Art Gallery'], numVisits: 2, facePhotoStatus: 'Pending', seasonalPass: false },
  { id: generateUniqueId(), name: 'Daniel Orange', email: 'daniel.o@example.com', phone: '111-000-2222', type: 'Full User', status: 'Active', dependents: [], lastLogin: '2023-10-26T08:00:00Z', pointsEarned: 700, zonesCovered: ['Discovery Hub'], numVisits: 3, facePhotoStatus: 'Captured', seasonalPass: true },
  { id: generateUniqueId(), name: 'Grace Yellow', email: 'grace.y@example.com', phone: '222-111-3333', type: 'Full User', status: 'Active', dependents: [{ name: 'Sam Yellow', type: 'Dependent' }], lastLogin: '2023-10-25T09:45:00Z', pointsEarned: 1800, zonesCovered: ['Gaming Zone', 'MakerSpace'], numVisits: 6, facePhotoStatus: 'Captured', seasonalPass: true },
  { id: generateUniqueId(), name: 'Liam Purple', email: 'liam.p@example.com', phone: '333-444-5555', type: 'Full User', status: 'Suspended', dependents: [], lastLogin: '2023-10-24T14:00:00Z', pointsEarned: 0, zonesCovered: [], numVisits: 0, facePhotoStatus: 'Pending', seasonalPass: false },
  { id: generateUniqueId(), name: 'Mia Aqua', email: 'mia.a@example.com', phone: '666-555-4444', type: 'Full User', status: 'Active', dependents: [], lastLogin: '2023-10-26T16:30:00Z', pointsEarned: 2500, zonesCovered: ['VR Experience', 'Art Gallery', 'Science Lab'], numVisits: 10, facePhotoStatus: 'Captured', seasonalPass: true },
  { id: generateUniqueId(), name: 'Noah Gold', email: 'noah.g@example.com', phone: '777-666-5555', type: 'Full User', status: 'Active', dependents: [{ name: 'Zoe Gold', type: 'Dependent' }], lastLogin: '2023-10-25T17:00:00Z', pointsEarned: 1100, zonesCovered: ['Discovery Hub'], numVisits: 4, facePhotoStatus: 'Captured', seasonalPass: true },
  { id: generateUniqueId(), name: 'Chloe Silver', email: 'chloe.s@example.com', phone: '888-999-0000', type: 'Full User', status: 'Active', dependents: [], lastLogin: '2023-10-26T11:00:00Z', pointsEarned: 300, zonesCovered: ['Cafeteria'], numVisits: 1, facePhotoStatus: 'Pending', seasonalPass: false },
];

const transformedUsers = [];
initialUsersRaw.forEach(user => {
  const newUser = { ...user };
  if (newUser.dependents && newUser.dependents.length > 0) {
    const dependentUsers = createDependentUsers(newUser.id, newUser.name, newUser.phone, newUser.dependents);
    transformedUsers.push(...dependentUsers);
    delete newUser.dependents;
  } else {
    delete newUser.dependents;
  }
  transformedUsers.push(newUser);
});

const consolidatedUsers = transformedUsers.map(user => ({
  pointsEarned: 0,
  zonesCovered: [],
  numVisits: 0,
  parentId: null,
  facePhotoStatus: 'Pending', // Default for new users
  seasonalPass: false, // Default for new users
  ...user,
}));

// Function to generate hourly time slots
const generateHourlyTimeSlots = () => {
  const slots = [];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  for (let i = 9; i < 18; i++) { // From 9 AM to 5 PM (17:00)
    const startTime = `${i.toString().padStart(2, '0')}:00`;
    const endTime = `${(i + 1).toString().padStart(2, '0')}:00`;
    slots.push({
      id: generateUniqueId(),
      dayOfWeek: daysOfWeek, // Apply to all days initially
      startTime: startTime,
      endTime: endTime,
      totalCapacity: 100, // Default capacity
      publicCapacity: 70,
      schoolCapacity: 20,
      vipCapacity: 10,
      description: `Slot ${startTime}-${endTime}`
    });
  }
  return slots;
};


export const initialMockData = {
  users: consolidatedUsers,
  bookings: [
    { id: generateUniqueId(), userId: 'user_john_id_1', userName: 'John Doe', groupId: null, date: '2023-11-01', time: '10:00', amount: 50.00, status: 'Confirmed', platform: 'Online', ticketCount: 1, addOns: [], ticketTypeId: 'ticket_general' },
    { id: generateUniqueId(), userId: 'user_jane_id_2', userName: 'Jane Smith', groupId: 'group_family_id_1', date: '2023-11-05', time: '14:00', amount: 120.00, status: 'Booked', platform: 'Online', ticketCount: 3, addOns: [{ id: 'addon_gaming', name: 'Gaming Zone', quantity: 3 }], ticketTypeId: 'ticket_school' },
    { id: generateUniqueId(), userId: 'user_alice_id_3', userName: 'Alice Johnson', groupId: null, date: '2023-11-01', time: '11:30', amount: 30.00, status: 'Cancelled', platform: 'Kiosk', ticketCount: 1, addOns: [], ticketTypeId: 'ticket_general' },
    { id: generateUniqueId(), userId: 'user_john_id_1', userName: 'John Doe', groupId: null, date: '2023-11-10', time: '16:00', amount: 75.00, status: 'Confirmed', platform: 'Counter', ticketCount: 2, addOns: [{ id: 'addon_makerspace', name: 'MakerSpace Workshop', quantity: 2 }], ticketTypeId: 'ticket_premium' },
    { id: generateUniqueId(), userId: 'user_robert_id_1', userName: 'Robert Brown', groupId: null, date: '2023-11-02', time: '09:30', amount: 40.00, status: 'Confirmed', platform: 'Online', ticketCount: 1, addOns: [], ticketTypeId: 'ticket_general' },
    { id: generateUniqueId(), userId: 'user_emily_id_1', userName: 'Emily White', groupId: null, date: '2023-11-03', time: '13:00', amount: 90.00, status: 'Booked', platform: 'Online', ticketCount: 3, addOns: [{ id: 'addon_gaming', name: 'Gaming Zone', quantity: 3 }], ticketTypeId: 'ticket_general' },
    { id: generateUniqueId(), userId: 'user_michael_id_1', userName: 'Michael Green', groupId: null, date: '2023-11-04', time: '10:00', amount: 20.00, status: 'Confirmed', platform: 'Kiosk', ticketCount: 1, addOns: [], ticketTypeId: 'ticket_general' },
    { id: generateUniqueId(), userId: 'user_sarah_id_1', userName: 'Sarah Black', groupId: null, date: '2023-11-05', time: '15:00', amount: 60.00, status: 'Confirmed', platform: 'Counter', ticketCount: 2, addOns: [{ id: 'addon_makerspace', name: 'MakerSpace Workshop', quantity: 2 }], ticketTypeId: 'ticket_premium' },
    { id: generateUniqueId(), userId: 'user_daniel_id_1', userName: 'Daniel Orange', groupId: null, date: '2023-11-06', time: '11:00', amount: 35.00, status: 'Confirmed', platform: 'Online', ticketCount: 1, addOns: [], ticketTypeId: 'ticket_general' },
    { id: generateUniqueId(), userId: 'user_grace_id_1', userName: 'Grace Yellow', groupId: null, date: '2023-11-07', time: '14:00', amount: 80.00, status: 'Booked', platform: 'Online', ticketCount: 2, addOns: [{ id: 'addon_gaming', name: 'Gaming Zone', quantity: 2 }], ticketTypeId: 'ticket_general' },
    { id: generateUniqueId(), userId: 'user_mia_id_1', userName: 'Mia Aqua', groupId: null, date: '2023-11-08', time: '10:30', amount: 55.00, status: 'Confirmed', platform: 'Kiosk', ticketCount: 1, addOns: [{ id: 'addon_vrexp', name: 'VR Experience Pass', quantity: 1 }], ticketTypeId: 'ticket_general' },
    { id: generateUniqueId(), userId: 'user_noah_id_1', userName: 'Noah Gold', groupId: null, date: '2023-11-09', time: '16:00', amount: 45.00, status: 'Confirmed', platform: 'Counter', ticketCount: 1, addOns: [], ticketTypeId: 'ticket_general' },
    // New bookings for new groups
    { id: generateUniqueId(), userId: 'user_michael_id_1', userName: 'Michael Green', groupId: 'group_tech_innovators_id_1', date: '2023-12-01', time: '11:00', amount: 90.00, status: 'Confirmed', platform: 'Online', ticketCount: 5, addOns: [{ id: 'addon_makerspace', name: 'MakerSpace Workshop', quantity: 5 }], ticketTypeId: 'ticket_partner' },
    { id: generateUniqueId(), userId: 'user_sophia_id_1', userName: 'Sophia Pink', groupId: 'group_art_lovers_id_1', date: '2023-12-03', time: '14:30', amount: 70.00, status: 'Booked', platform: 'Counter', ticketCount: 3, addOns: [{ id: 'addon_art_supply', name: 'Art Supply Kit', quantity: 3 }], ticketTypeId: 'ticket_school' },
    { id: generateUniqueId(), userId: 'user_michael_id_1', userName: 'Michael Green', groupId: 'group_tech_innovators_id_1', date: '2023-12-05', time: '09:00', amount: 120.00, status: 'Confirmed', platform: 'Online', ticketCount: 7, addOns: [], ticketTypeId: 'ticket_partner' },
    { id: generateUniqueId(), userId: 'user_emily_id_1', userName: 'Emily White', groupId: 'group_family_adventure_id_1', date: '2023-12-10', time: '10:00', amount: 150.00, status: 'Confirmed', platform: 'Online', ticketCount: 4, addOns: [{ id: 'addon_vrexp', name: 'VR Experience Pass', quantity: 4 }, { id: 'addon_gaming', name: 'Gaming Zone Pass', quantity: 4 }], ticketTypeId: 'ticket_premium' },
    { id: generateUniqueId(), userId: 'user_david_id_1', userName: 'David Blue', groupId: 'group_history_buffs_id_1', date: '2023-12-12', time: '13:00', amount: 80.00, status: 'Booked', platform: 'Kiosk', ticketCount: 2, addOns: [], ticketTypeId: 'ticket_general' },
  ],
  groups: [
    { id: 'group_family_id_1', name: 'Smith Family', primaryBookerId: 'user_jane_id_2', primaryBookerName: 'Jane Smith', status: 'Active', isPublic: false, members: [{ id: generateUniqueId(), userId: 'user_jane_id_2', name: 'Jane Smith', status: 'Joined' }, { id: generateUniqueId(), name: 'Billy Smith', status: 'Joined (Dependent)' }] },
    { id: 'group_friends_id_1', name: 'Weekend Explorers', primaryBookerId: 'user_robert_id_1', primaryBookerName: 'Robert Brown', status: 'Active', isPublic: true, members: [{ id: generateUniqueId(), userId: 'user_robert_id_1', name: 'Robert Brown', status: 'Joined' }, { id: generateUniqueId(), name: 'Chris Grey', status: 'Joined' }] },
    { id: generateUniqueId(), name: 'Gaming Enthusiasts', primaryBookerId: 'user_grace_id_1', primaryBookerName: 'Grace Yellow', status: 'Active', isPublic: true, members: [{ id: generateUniqueId(), userId: 'user_grace_id_1', name: 'Grace Yellow', status: 'Joined' }] },
    // New Groups
    { id: 'group_tech_innovators_id_1', name: 'Tech Innovators', primaryBookerId: 'user_michael_id_1', primaryBookerName: 'Michael Green', status: 'Active', isPublic: false, members: [{ id: generateUniqueId(), userId: 'user_michael_id_1', name: 'Michael Green', status: 'Joined' }, { id: generateUniqueId(), name: 'Alex Lee', status: 'Pending' }, { id: generateUniqueId(), name: 'Sarah Black', status: 'Joined' }] },
    { id: 'group_art_lovers_id_1', name: 'Art Lovers Club', primaryBookerId: 'user_sophia_id_1', primaryBookerName: 'Sophia Pink', status: 'Active', isPublic: true, members: [{ id: generateUniqueId(), userId: 'user_sophia_id_1', name: 'Sophia Pink', status: 'Joined' }, { id: generateUniqueId(), name: 'Daniel Orange', status: 'Joined' }] },
    { id: 'group_science_club_id_1', name: 'Science Club', primaryBookerId: 'user_chloe_id_1', primaryBookerName: 'Chloe Silver', status: 'Pending', isPublic: true, members: [{ id: generateUniqueId(), userId: 'user_chloe_id_1', name: 'Chloe Silver', status: 'Joined' }] },
    { id: 'group_family_adventure_id_1', name: 'Family Adventure Crew', primaryBookerId: 'user_emily_id_1', primaryBookerName: 'Emily White', status: 'Active', isPublic: false, members: [{ id: generateUniqueId(), userId: 'user_emily_id_1', name: 'Emily White', status: 'Joined' }, { id: generateUniqueId(), name: 'Max White', status: 'Joined (Dependent)' }, { id: generateUniqueId(), name: 'Lily White', status: 'Joined (Dependent)' }] },
    { id: 'group_history_buffs_id_1', name: 'History Buffs', primaryBookerId: 'user_david_id_1', primaryBookerName: 'David Blue', status: 'Active', isPublic: true, members: [{ id: generateUniqueId(), userId: 'user_david_id_1', name: 'David Blue', status: 'Joined' }] },
    { id: generateUniqueId(), name: 'Local Explorers', primaryBookerId: 'user_john_id_1', primaryBookerName: 'John Doe', status: 'Pending', isPublic: true, members: [{ id: generateUniqueId(), userId: 'user_john_id_1', name: 'John Doe', status: 'Joined' }] },
  ],
  rooms: [
    { id: generateUniqueId(), name: 'Main Exhibition Hall', type: 'Public', moderator: 'Admin User', capacity: 200, bookedCapacity: { '2023-11-01': 50, '2023-11-05': 100 } },
    { id: generateUniqueId(), name: 'VIP Lounge', type: 'Private', moderator: 'Admin User', capacity: 50, bookedCapacity: { '2023-11-01': 10, '2023-11-10': 20 } },
    { id: generateUniqueId(), name: 'Gaming Zone', type: 'Public', moderator: 'Admin User', capacity: 100, bookedCapacity: { '2023-11-03': 70, '2023-11-07': 40 } },
    { id: generateUniqueId(), name: 'MakerSpace', type: 'Public', moderator: 'Admin User', capacity: 75, bookedCapacity: { '2023-11-05': 30, '2023-11-10': 25 } },
    { id: generateUniqueId(), name: 'Discovery Hub', type: 'Public', moderator: 'Admin User', capacity: 150, bookedCapacity: { '2023-11-02': 80, '2023-11-06': 60 } },
    { id: generateUniqueId(), name: 'Art Gallery', type: 'Public', moderator: 'Admin User', capacity: 80, bookedCapacity: { '2023-11-03': 30, '2023-12-03': 50 } },
    { id: generateUniqueId(), name: 'VR Experience', type: 'Private', moderator: 'Admin User', capacity: 30, bookedCapacity: { '2023-11-08': 15, '2023-12-10': 25 } },
    { id: generateUniqueId(), name: 'Science Lab', type: 'Public', moderator: 'Admin User', capacity: 60, bookedCapacity: { '2023-11-05': 20 } },
    { id: generateUniqueId(), name: 'Cafeteria', type: 'Public', moderator: 'Admin User', capacity: 120, bookedCapacity: { '2023-11-04': 90 } },
  ],
  addOns: [
    { id: 'addon_gaming', name: 'Gaming Zone Pass', price: 25.00, isActive: true, linkedTimeSlot: '14:00' },
    { id: 'addon_makerspace', name: 'MakerSpace Workshop', price: 35.00, isActive: true, linkedTimeSlot: null },
    { id: generateUniqueId(), name: 'Lunch Meal Pack', price: 15.00, isActive: true, linkedTimeSlot: '12:00' },
    { id: generateUniqueId(), name: 'Souvenir Photo', price: 10.00, isActive: true, linkedTimeSlot: null },
    { id: 'addon_vrexp', name: 'VR Experience Pass', price: 20.00, isActive: true, linkedTimeSlot: '10:30' },
    { id: 'addon_art_supply', name: 'Art Supply Kit', price: 18.00, isActive: true, linkedTimeSlot: null },
  ],
  payments: [
    { id: generateUniqueId(), bookingId: 'booking_id_1', userId: 'user_john_id_1', amount: 50.00, status: 'Successful', method: 'Credit Card', timestamp: '2023-10-26T09:55:00Z' },
    { id: generateUniqueId(), bookingId: 'booking_id_2', userId: 'user_jane_id_2', amount: 120.00, status: 'Successful', method: 'UPI', timestamp: '2023-10-25T13:50:00Z' },
    { id: generateUniqueId(), bookingId: 'booking_id_3', userId: 'user_alice_id_3', amount: 30.00, status: 'Refunded', method: 'Cash', timestamp: '2023-11-01T10:00:00Z' },
    { id: generateUniqueId(), bookingId: 'booking_id_4', userId: 'user_john_id_1', amount: 75.00, status: 'Successful', method: 'Credit Card', timestamp: '2023-11-10T15:50:00Z' },
    { id: generateUniqueId(), bookingId: 'booking_id_5', userId: 'user_robert_id_1', amount: 40.00, status: 'Successful', method: 'Online', timestamp: '2023-11-02T09:30:00Z' },
    { id: generateUniqueId(), bookingId: 'booking_id_6', userId: 'user_emily_id_1', amount: 90.00, status: 'Successful', method: 'Online', timestamp: '2023-11-03T13:00:00Z' },
    { id: generateUniqueId(), bookingId: 'booking_id_7', userId: 'user_michael_id_1', amount: 20.00, status: 'Successful', method: 'Kiosk', timestamp: '2023-11-04T10:00:00Z' },
    { id: generateUniqueId(), bookingId: 'booking_id_8', userId: 'user_sarah_id_1', amount: 60.00, status: 'Successful', method: 'Counter', timestamp: '2023-11-05T15:00:00Z' },
    { id: generateUniqueId(), bookingId: 'booking_id_9', userId: 'user_daniel_id_1', amount: 35.00, status: 'Successful', method: 'Online', timestamp: '2023-11-06T11:00:00Z' },
    { id: generateUniqueId(), bookingId: 'booking_id_10', userId: 'user_grace_id_1', amount: 80.00, status: 'Successful', method: 'Online', timestamp: '2023-11-07T14:00:00Z' },
    { id: generateUniqueId(), bookingId: 'booking_id_11', userId: 'user_mia_id_1', amount: 55.00, status: 'Successful', method: 'Kiosk', timestamp: '2023-11-08T10:30:00Z' },
    { id: generateUniqueId(), bookingId: 'booking_id_12', userId: 'user_noah_id_1', amount: 45.00, status: 'Successful', method: 'Counter', timestamp: '2023-11-09T16:00:00Z' },
  ],
  notifications: [
    { id: generateUniqueId(), title: 'System Update', message: 'Upcoming maintenance on Nov 10th.', type: 'Announcement', status: 'Active' },
    { id: generateUniqueId(), title: 'New VR Experience', message: 'Check out our new virtual reality attractions!', type: 'Announcement', status: 'Active' },
    { id: generateUniqueId(), title: 'Holiday Hours', message: 'We will be open until 8 PM during the holiday season.', type: 'Announcement', status: 'Inactive' },
    { id: generateUniqueId(), title: 'Special Event Tomorrow', message: 'Join us for the annual Science Fair!', type: 'Event Details', status: 'Active' },
    { id: generateUniqueId(), title: 'New Privacy Policy', message: 'Our privacy policy has been updated. Please review.', type: 'Terms and Conditions', status: 'Active' },
  ],
  reports: [],
  adminAccounts: [
    { id: generateUniqueId(), username: 'admin', password: 'password', role: 'Super Admin' },
    { id: generateUniqueId(), username: 'editor', password: 'password', role: 'Content Editor' },
  ],
  featureToggles: {
    enableOnlineBooking: true,
    enableKioskFaceCapture: true,
    enableCompanionModule: true,
    enablePublicRallyCreation: false,
    enableGamifiedScoring: true,
    enableMemoryDashboard: true,
    enableBulkBookingMode: true,
  },
  systemSettings: {
    maxBookingWindowDays: 90,
    maxCompanionsPerBooking: 10,
    defaultCurrency: 'USD',
    otpResendDelaySeconds: 60,
  },
  currentDayBookings: 15,
  activePeopleInPark: 78,
  simulatedMetrics: {
    totalBookings: {
      daily: 15,
      weekly: 105,
      monthly: 450,
      yearly: 5000,
      allTime: 12345
    },
    totalUsers: {
      daily: 5,
      weekly: 30,
      monthly: 150,
      yearly: 1200,
      allTime: 5678
    },
    totalSales: {
      daily: 750,
      weekly: 5250,
      monthly: 22500,
      yearly: 250000,
      allTime: 1234567.89
    },
    activePeopleInPark: {
      daily: 78,
      weekly: 85,
      monthly: 90,
      yearly: 95,
      allTime: 100
    },
    currentDayBookings: {
      daily: 15,
      weekly: 105,
      monthly: 450,
      yearly: 5000,
      allTime: 12345
    }
  },
  ticketTypes: [
    { id: 'ticket_general', name: 'General Admission', baseCost: 30.00, isActive: true, validityDays: 1, dailyBookingLimit: 500, description: 'Standard entry ticket.' },
    { id: 'ticket_premium', name: 'Premium Pass', baseCost: 75.00, isActive: true, validityDays: 3, dailyBookingLimit: 100, description: 'Includes access to all zones for 3 days.' },
    { id: 'ticket_school', name: 'School Group', baseCost: 20.00, isActive: true, validityDays: 1, dailyBookingLimit: 200, description: 'Discounted rate for school groups.' },
    { id: 'ticket_partner', name: 'Partner Vouchers', baseCost: 0.00, isActive: false, validityDays: 1, dailyBookingLimit: 50, description: 'Vouchers from partner organizations.' },
    { id: 'ticket_free', name: 'Free Pass', baseCost: 0.00, isActive: true, validityDays: 1, dailyBookingLimit: 20, description: 'Special complimentary pass.' },
    { id: 'ticket_makerspace', name: 'Maker Space Only', baseCost: 25.00, isActive: true, validityDays: 1, dailyBookingLimit: 50, description: 'Access exclusively to the Maker Space.' },
    { id: 'ticket_gaming', name: 'Gaming Zone Only', baseCost: 20.00, isActive: true, validityDays: 1, dailyBookingLimit: 75, description: 'Access exclusively to the Gaming Zone.' },
  ],
  timeSlots: generateHourlyTimeSlots(), // Using the new function to generate hourly slots
  pricingModels: {
    bulkPricing: [
      { minTickets: 20, maxTickets: 50, discountPercentage: 10, type: 'corporate' },
      { minTickets: 51, maxTickets: 100, discountPercentage: 15, type: 'school' },
    ],
    studentPricing: {
      enabled: true,
      discountPercentage: 15,
      requiredVerification: true,
    }
  },
  discounts: [
    { id: generateUniqueId(), code: 'SUMMER20', type: 'percentage', value: 20, minTickets: 2, expiryDate: '2024-08-31', isActive: true },
    { id: generateUniqueId(), code: 'BIRTHDAYFUN', type: 'auto_birthday', value: 15, isActive: true },
    { id: generateUniqueId(), code: 'PARTNERXYZ', type: 'partner', value: 10, usageLimit: 100, currentUsage: 45, expiryDate: '2024-12-31', isActive: true },
  ],
  platforms: [
    { id: 'platform_online', name: 'Online Booking', isEnabled: true, type: 'digital' },
    { id: 'platform_kiosk_001', name: 'Kiosk Unit 001', isEnabled: true, type: 'physical', location: 'Main Entrance' },
    { id: 'platform_kiosk_002', name: 'Kiosk Unit 002', isEnabled: false, type: 'physical', location: 'West Wing' },
    { id: 'platform_counter_A', name: 'Counter A', isEnabled: true, type: 'physical', location: 'Main Counter' },
  ]
};

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('adminDashboardData');
    if (serializedState === null) {
      return initialMockData;
    }
    const storedState = JSON.parse(serializedState);
    const mergedUsers = initialMockData.users.map(initialUser => {
      const storedUser = storedState.users.find(u => u.id === initialUser.id);
      return storedUser ? { ...initialUser, ...storedUser } : initialUser;
    });
    const newStoredUsers = storedState.users.filter(storedUser => !initialMockData.users.some(initialUser => initialUser.id === storedUser.id));

    // Merge new add-ons from initial data if they don't exist in stored data
    const mergedAddOns = initialMockData.addOns.map(initialAddOn => {
        const storedAddOn = storedState.addOns.find(ao => ao.id === initialAddOn.id);
        return storedAddOn ? { ...initialAddOn, ...storedAddOn } : initialAddOn;
    });
    const newStoredAddOns = storedState.addOns.filter(storedAddOn => !initialMockData.addOns.some(initialAddOn => initialAddOn.id === storedAddOn.id));

    // Merge new ticket types
    const mergedTicketTypes = initialMockData.ticketTypes.map(initialTicketType => {
      const storedTicketType = storedState.ticketTypes?.find(tt => tt.id === initialTicketType.id);
      return storedTicketType ? { ...initialTicketType, ...storedTicketType } : initialTicketType;
    }) || [];
    const newStoredTicketTypes = storedState.ticketTypes?.filter(storedTicketType =>
      !initialMockData.ticketTypes.some(initialTicketType => initialTicketType.id === storedTicketType.id)
    ) || [];

    // Merge new time slots - ensure new hourly slots are picked up
    // Filter out old time slots if new structure is significantly different and replace with generated ones
    const currentInitialTimeSlots = generateHourlyTimeSlots(); // Regenerate current expected structure
    const mergedTimeSlots = currentInitialTimeSlots.map(initialTimeSlot => {
        const storedTimeSlot = storedState.timeSlots?.find(ts => ts.startTime === initialTimeSlot.startTime && ts.endTime === initialTimeSlot.endTime && JSON.stringify(ts.dayOfWeek) === JSON.stringify(initialTimeSlot.dayOfWeek));
        return storedTimeSlot ? { ...initialTimeSlot, ...storedTimeSlot } : initialTimeSlot;
    }) || [];

    // Add any time slots that were custom added by user if they don't overlap with generated ones
    const customStoredTimeSlots = storedState.timeSlots?.filter(storedTimeSlot =>
        !currentInitialTimeSlots.some(initialTimeSlot =>
            initialTimeSlot.startTime === storedTimeSlot.startTime &&
            initialTimeSlot.endTime === storedTimeSlot.endTime &&
            JSON.stringify(initialTimeSlot.dayOfWeek) === JSON.stringify(storedTimeSlot.dayOfWeek)
        )
    ) || [];


    return {
      ...initialMockData,
      ...storedState,
      users: [...mergedUsers, ...newStoredUsers],
      addOns: [...mergedAddOns, ...newStoredAddOns], // Ensure add-ons are merged properly
      ticketTypes: [...mergedTicketTypes, ...newStoredTicketTypes], // Merge ticket types
      timeSlots: [...mergedTimeSlots, ...customStoredTimeSlots], // Merge time slots, prioritizing new generated ones
    };
  } catch (error) {
    console.error("Error loading state from localStorage:", error);
    return initialMockData;
  }
};

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('adminDashboardData', serializedState);
  } catch (error) {
    console.error("Error saving state to localStorage:", error);
  }
};

// Custom Hook for Admin Dashboard Data
export const useAdminDashboardData = () => {
  const [data, setData] = useState(loadState);

  useEffect(() => {
    saveState(data);
  }, [data]);

  const simulateApiCall = (callback) => {
    return new Promise(resolve => {
      setTimeout(() => {
        callback();
        resolve();
      }, 500);
    });
  };

  const updateData = (category, id, newData) => {
    setData(prevData => ({
      ...prevData,
      [category]: prevData[category].map(item => item.id === id ? { ...item, ...newData } : item)
    }));
  };

  const addData = (category, newItem) => {
    setData(prevData => ({
      ...prevData,
      [category]: [...prevData[category], { id: generateUniqueId(), ...newItem }]
    }));
  };

  const deleteData = (category, id) => {
    setData(prevData => ({
      ...prevData,
      [category]: prevData[category].filter(item => item.id !== id)
    }));
  };

  const toggleFeature = async (featureName) => {
    await simulateApiCall(() => {
      setData(prevData => ({
        ...prevData,
        featureToggles: {
          ...prevData.featureToggles,
          [featureName]: !prevData.featureToggles[featureName]
        }
      }));
    });
  };

  const updateSetting = async (settingName, value) => {
    await simulateApiCall(() => {
      setData(prevData => ({
        ...prevData,
        systemSettings: {
          ...prevData.systemSettings,
          [settingName]: value
        }
      }));
    });
  };

  return { data, updateData, addData, deleteData, toggleFeature, updateSetting, simulateApiCall };
};
