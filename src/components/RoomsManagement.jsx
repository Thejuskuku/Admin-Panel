import React, { useState, useContext, useEffect } from 'react';
import { AdminDashboardContext } from '../App.jsx'; // This path is correct for a common src/components/ setup
import { ChevronDown, ChevronUp, Edit, Trash, PauseCircle, PlayCircle, Plus, Save, XCircle, Users, Award, Info, CalendarDays, BarChartBig } from 'lucide-react';

const RoomsManagement = () => {
  const { simulateApiCall } = useContext(AdminDashboardContext);

  const [expandedRoom, setExpandedRoom] = useState(null);
  const [expandedZone, setExpandedZone] = useState(null);
  const [expandedSubZone, setExpandedSubZone] = useState(null);

  const [isExhibitModalOpen, setIsExhibitModalOpen] = useState(false);
  const [editingExhibit, setEditingExhibit] = useState(null);
  const [newExhibitData, setNewExhibitData] = useState({
    name: '',
    xpPoints: 0,
    isPaused: false,
    visitors: 0,
    roomId: '',
    zoneName: '',
    subZoneName: ''
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // State for mock leaderboard data
  const [mockLeaderboardData, setMockLeaderboardData] = useState({});
  // State to manage active leaderboard period (daily/monthly) for each zone
  const [activeLeaderboardPeriod, setActiveLeaderboardPeriod] = useState({});

  const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const generateUniqueId = () => `exhibit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Mock user data for leaderboards
  const mockUsers = [
    { id: 'user_001', name: 'Alice Smith' },
    { id: 'user_002', name: 'Bob Johnson' },
    { id: 'user_003', name: 'Charlie Brown' },
    { id: 'user_004', name: 'Diana Prince' },
    { id: 'user_005', name: 'Eve Adams' },
  ];

  // Function to generate mock leaderboard data
  const generateMockLeaderboardData = (rooms) => {
    const leaderboards = {};
    rooms.forEach(room => {
      room.zones.forEach(zone => {
        const zoneKey = `${room.id}-${zone.name}`;
        leaderboards[zoneKey] = {
          daily: [],
          monthly: []
        };

        // Generate mock daily leaderboard entries
        const dailyEntries = [];
        mockUsers.forEach(user => {
          dailyEntries.push({
            userId: user.id,
            userName: user.name,
            score: getRandomNumber(50, 500) // Random score for daily
          });
        });
        // Sort by score descending
        leaderboards[zoneKey].daily = dailyEntries.sort((a, b) => b.score - a.score).slice(0, 5); // Top 5

        // Generate mock monthly leaderboard entries
        const monthlyEntries = [];
        mockUsers.forEach(user => {
          monthlyEntries.push({
            userId: user.id,
            userName: user.name,
            score: getRandomNumber(500, 5000) // Random score for monthly
          });
        });
        // Sort by score descending
        leaderboards[zoneKey].monthly = monthlyEntries.sort((a, b) => b.score - a.score).slice(0, 5); // Top 5

        // Initialize active period for this zone to 'daily'
        setActiveLeaderboardPeriod(prev => ({ ...prev, [zoneKey]: 'daily' }));
      });
    });
    return leaderboards;
  };


  const [roomDataWithZones, setRoomDataWithZones] = useState([
    {
      id: 'roboland',
      name: 'Roboland',
      zones: [
        {
          name: 'Futureverse',
          details: 'mechanical zone, electrical & electronics zone, Computer Science zone, AI zone, Robotics zone, VR/AR zone, IoT zone, Rapid prototyping zone, Agrizone, drone zone, EV zone, Autonomous zone',
          subZones: [
            {
              name: 'Mechanical Zone',
              exhibits: [
                { id: generateUniqueId(), name: 'Robot Arm Demo', xpPoints: 100, isPaused: false, visitors: getRandomNumber(5, 15) },
                { id: generateUniqueId(), name: 'Gear Assembly Challenge', xpPoints: 80, isPaused: false, visitors: getRandomNumber(3, 10) }
              ]
            },
            {
              name: 'Electrical & Electronics Zone',
              exhibits: [
                { id: generateUniqueId(), name: 'Circuit Building Station', xpPoints: 90, isPaused: false, visitors: getRandomNumber(7, 20) },
                { id: generateUniqueId(), name: 'Renewable Energy Display', xpPoints: 110, isPaused: false, visitors: getRandomNumber(4, 12) }
              ]
            },
            {
              name: 'Computer Science Zone',
              exhibits: [
                { id: generateUniqueId(), name: 'Coding Challenge', xpPoints: 120, isPaused: false, visitors: getRandomNumber(8, 25) },
                { id: generateUniqueId(), name: 'Data Visualization Lab', xpPoints: 95, isPaused: false, visitors: getRandomNumber(6, 18) }
              ]
            },
            {
              name: 'AI Zone',
              exhibits: [
                { id: generateUniqueId(), name: 'AI Chatbot Interaction', xpPoints: 150, isPaused: false, visitors: getRandomNumber(10, 30) },
                { id: generateUniqueId(), name: 'Machine Learning Demo', xpPoints: 130, isPaused: false, visitors: getRandomNumber(7, 22) }
              ]
            },
            {
              name: 'Robotics Zone',
              exhibits: [
                { id: generateUniqueId(), name: 'Humanoid Robot Show', xpPoints: 180, isPaused: false, visitors: getRandomNumber(15, 40) },
                { id: generateUniqueId(), name: 'Drone Obstacle Course', xpPoints: 140, isPaused: false, visitors: getRandomNumber(10, 35) }
              ]
            },
            {
              name: 'VR/AR Zone',
              exhibits: [
                { id: generateUniqueId(), name: 'Virtual Reality Experience', xpPoints: 200, isPaused: false, visitors: getRandomNumber(12, 30) },
                { id: generateUniqueId(), name: 'Augmented Reality Sandbox', xpPoints: 160, isPaused: false, visitors: getRandomNumber(9, 25) }
              ]
            },
            {
              name: 'IoT Zone',
              exhibits: [
                { id: generateUniqueId(), name: 'Smart Home Automation', xpPoints: 100, isPaused: false, visitors: getRandomNumber(5, 15) },
                { id: generateUniqueId(), name: 'Connected City Model', xpPoints: 115, isPaused: false, visitors: getRandomNumber(6, 18) }
              ]
            },
            {
              name: 'Rapid Prototyping Zone',
              exhibits: [
                { id: generateUniqueId(), name: '3D Printing Demo', xpPoints: 125, isPaused: false, visitors: getRandomNumber(8, 20) },
                { id: generateUniqueId(), name: 'Laser Cutting Workshop', xpPoints: 135, isPaused: false, visitors: getRandomNumber(7, 18) }
              ]
            },
            {
              name: 'Agrizone',
              exhibits: [
                { id: generateUniqueId(), name: 'Hydroponics Farming', xpPoints: 90, isPaused: false, visitors: getRandomNumber(4, 12) },
                { id: generateUniqueId(), name: 'Automated Crop Monitoring', xpPoints: 105, isPaused: false, visitors: getRandomNumber(5, 14) }
              ]
            },
            {
              name: 'Drone Zone',
              exhibits: [
                { id: generateUniqueId(), name: 'Drone Racing Simulator', xpPoints: 140, isPaused: false, visitors: getRandomNumber(10, 25) },
                { id: generateUniqueId(), name: 'Aerial Photography Workshop', xpPoints: 120, isPaused: false, visitors: getRandomNumber(8, 20) }
              ]
            },
            {
              name: 'EV Zone',
              exhibits: [
                { id: generateUniqueId(), name: 'Electric Vehicle Charging', xpPoints: 110, isPaused: false, visitors: getRandomNumber(6, 16) },
                { id: generateUniqueId(), name: 'Battery Technology Display', xpPoints: 100, isPaused: false, visitors: getRandomNumber(5, 15) }
              ]
            },
            {
              name: 'Autonomous Zone',
              exhibits: [
                { id: generateUniqueId(), name: 'Self-Driving Car Simulator', xpPoints: 170, isPaused: false, visitors: getRandomNumber(12, 28) },
                { id: generateUniqueId(), name: 'Autonomous Robot Navigation', xpPoints: 155, isPaused: false, visitors: getRandomNumber(10, 25) }
              ]
            }
          ]
        },
        {
          name: 'MakerSpace',
          details: 'Workshop, Drone Flying zone, Maker zone',
          subZones: [
            {
              name: 'Workshop Area',
              exhibits: [
                { id: generateUniqueId(), name: 'Woodworking Bench', xpPoints: 70, isPaused: false, visitors: getRandomNumber(2, 8) },
                { id: generateUniqueId(), name: 'Electronics Soldering Station', xpPoints: 85, isPaused: false, visitors: getRandomNumber(3, 10) }
              ]
            },
            {
              name: 'Drone Flying Zone',
              exhibits: [
                { id: generateUniqueId(), name: 'Indoor Drone Flight', xpPoints: 100, isPaused: false, visitors: getRandomNumber(5, 15) }
              ]
            }
          ]
        },
        {
          name: 'Eco Park',
          details: 'gaming zone, food court, merchandise shop',
          subZones: [
            {
              name: 'Gaming Zone',
              exhibits: [
                { id: generateUniqueId(), name: 'Retro Arcade', xpPoints: 60, isPaused: false, visitors: getRandomNumber(10, 30) },
                { id: generateUniqueId(), name: 'Esports Arena', xpPoints: 90, isPaused: false, visitors: getRandomNumber(15, 40) }
              ]
            },
            {
              name: 'Food Court',
              exhibits: [
                { id: generateUniqueId(), name: 'Cafe Corner', xpPoints: 10, isPaused: false, visitors: getRandomNumber(20, 50) }
              ]
            },
            {
              name: 'Merchandise Shop',
              exhibits: [
                { id: generateUniqueId(), name: 'Souvenir Stand', xpPoints: 5, isPaused: false, visitors: getRandomNumber(10, 25) }
              ]
            }
          ]
        },
      ],
    },
    {
      id: 'futuristech',
      name: 'Futuristech',
      zones: [
        {
          name: 'Innovation Hub',
          details: 'Focus on emerging technologies and groundbreaking research',
          subZones: [
            {
              name: 'AI & Robotics Showcase',
              exhibits: [
                { id: generateUniqueId(), name: 'AI Art Generator', xpPoints: 130, isPaused: false, visitors: getRandomNumber(8, 20) },
                { id: generateUniqueId(), name: 'Collaborative Robots', xpPoints: 150, isPaused: false, visitors: getRandomNumber(10, 25) }
              ]
            }
          ]
        },
        {
          name: 'Discovery Lab',
          details: 'Interactive exhibits and experimental projects',
          subZones: [
            {
              name: 'Science Experiments',
              exhibits: [
                { id: generateUniqueId(), name: 'Volcano Eruption', xpPoints: 70, isPaused: false, visitors: getRandomNumber(5, 15) },
                { id: generateUniqueId(), name: 'Electricity Demo', xpPoints: 80, isPaused: false, visitors: getRandomNumber(6, 18) }
              ]
            }
          ]
        },
      ],
    },
    {
      id: 'teknowledge',
      name: 'Teknowledge',
      zones: [
        {
          name: 'Skill Development Center',
          details: 'Specialized courses and training programs',
          subZones: [
            {
              name: 'Coding Bootcamp',
              exhibits: [
                { id: generateUniqueId(), name: 'Python Basics', xpPoints: 100, isPaused: false, visitors: getRandomNumber(10, 20) },
                { id: generateUniqueId(), name: 'Web Development', xpPoints: 120, isPaused: false, visitors: getRandomNumber(12, 25) }
              ]
            }
          ]
        },
        {
          name: 'Workshop Area',
          details: 'Hands-on training and project building',
          subZones: [
            {
              name: 'DIY Electronics',
              exhibits: [
                { id: generateUniqueId(), name: 'Build Your Own Robot', xpPoints: 140, isPaused: false, visitors: getRandomNumber(8, 15) }
              ]
            }
          ]
        },
      ],
    },
    // Removed the 'inkubator' room as requested
  ]);

  // Initialize mock leaderboard data when the component mounts
  useEffect(() => {
    setMockLeaderboardData(generateMockLeaderboardData(roomDataWithZones));
  }, [roomDataWithZones]); // Re-generate if room data changes (though it's static here)


  const calculateZoneCapacity = (zone) => {
    let currentVisitors = 0;
    let maxCapacity = 0; // maxCapacity is no longer used in display but kept for calculation consistency
    if (zone.subZones && Array.isArray(zone.subZones)) {
      zone.subZones.forEach(subZone => {
        if (subZone.exhibits && Array.isArray(subZone.exhibits)) {
          subZone.exhibits.forEach(exhibit => {
            currentVisitors += exhibit.visitors;
            maxCapacity += exhibit.visitors * 2;
          });
        }
      });
    }
    return { currentVisitors, maxCapacity };
  };

  const toggleRoomExpansion = (roomId) => {
    setExpandedRoom(expandedRoom === roomId ? null : roomId);
    setExpandedZone(null);
    setExpandedSubZone(null);
  };

  const toggleZoneExpansion = (zoneName) => {
    setExpandedZone(expandedZone === zoneName ? null : zoneName);
    setExpandedSubZone(null);
  };

  const toggleSubZoneExpansion = (subZoneName) => {
    setExpandedSubZone(expandedSubZone === subZoneName ? null : subZoneName);
  };

  const openExhibitModal = (room, zone, subZone, exhibit = null) => {
    setEditingExhibit(exhibit);
    setNewExhibitData(exhibit ? {
      ...exhibit,
      roomId: room.id,
      zoneName: zone.name,
      subZoneName: subZone.name
    } : {
      name: '',
      xpPoints: 0,
      isPaused: false,
      visitors: 0,
      roomId: room.id,
      zoneName: zone.name,
      subZoneName: subZone.name
    });
    setIsExhibitModalOpen(true);
    setMessage('');
  };

  const closeExhibitModal = () => {
    setIsExhibitModalOpen(false);
    setEditingExhibit(null);
    setNewExhibitData({ name: '', xpPoints: 0, isPaused: false, visitors: 0, roomId: '', zoneName: '', subZoneName: '' });
  };

  const handleExhibitSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!newExhibitData.name || newExhibitData.xpPoints < 0 || newExhibitData.visitors < 0) {
      setMessage('Exhibit Name, XP Points (>=0), and Visitors (>=0) are required.');
      setMessageType('error');
      return;
    }

    try {
      await simulateApiCall(() => {
        setRoomDataWithZones(prevRooms => {
          return prevRooms.map(room => {
            if (room.id === newExhibitData.roomId) {
              return {
                ...room,
                zones: room.zones.map(zone => {
                  if (zone.name === newExhibitData.zoneName) {
                    return {
                      ...zone,
                      subZones: zone.subZones.map(subZone => {
                        if (subZone.name === newExhibitData.subZoneName) {
                          let updatedExhibits;
                          if (editingExhibit) {
                            updatedExhibits = subZone.exhibits.map(exhibit =>
                              exhibit.id === editingExhibit.id ? { ...exhibit, ...newExhibitData, id: exhibit.id } : exhibit
                            );
                          } else {
                            updatedExhibits = [...subZone.exhibits, { id: generateUniqueId(), ...newExhibitData }];
                          }
                          return { ...subZone, exhibits: updatedExhibits };
                        }
                        return subZone;
                      })
                    };
                  }
                  return zone;
                })
              };
            }
            return room;
          });
        });
        setMessage(`Exhibit ${editingExhibit ? 'updated' : 'added'} successfully!`);
        setMessageType('success');
      });
    } catch (error) {
      console.error("Error submitting exhibit:", error);
      setMessage('Failed to save exhibit due to an internal error.');
      setMessageType('error');
    }
    closeExhibitModal();
  };

  const handleDeleteExhibit = async (roomId, zoneName, subZoneName, exhibitId) => {
    if (window.confirm('Are you sure you want to delete this exhibit? This cannot be undone.')) {
      try {
        await simulateApiCall(() => {
          setRoomDataWithZones(prevRooms => {
            return prevRooms.map(room => {
              if (room.id === roomId) {
                return {
                  ...room,
                  zones: room.zones.map(zone => {
                    if (zone.name === zoneName) {
                      return {
                        ...zone,
                        subZones: zone.subZones.map(subZone => {
                          if (subZone.name === subZoneName) {
                            return {
                              ...subZone,
                              exhibits: subZone.exhibits.filter(exhibit => exhibit.id !== exhibitId)
                            };
                          }
                          return subZone;
                        })
                      };
                    }
                    return zone;
                  })
                };
              }
              return room;
            });
          });
          setMessage('Exhibit deleted successfully!');
          setMessageType('success');
        });
      } catch (error) {
        console.error("Error deleting exhibit:", error);
        setMessage('Failed to delete exhibit due to an internal error.');
        setMessageType('error');
      }
    }
  };

  const handleToggleExhibitStatus = async (roomId, zoneName, subZoneName, exhibitId) => {
    try {
      console.log(`Attempting to toggle exhibit status for Room: ${roomId}, Zone: ${zoneName}, SubZone: ${subZoneName}, Exhibit ID: ${exhibitId}`);
      await simulateApiCall(() => {
        setRoomDataWithZones(prevRooms => {
          console.log("Previous Rooms State (before toggle):", JSON.parse(JSON.stringify(prevRooms)));

          const updatedRooms = prevRooms.map(room => {
            if (room.id === roomId) {
              const updatedZones = room.zones && Array.isArray(room.zones) ? room.zones.map(zone => {
                if (zone.name === zoneName) {
                  const updatedSubZones = zone.subZones && Array.isArray(zone.subZones) ? zone.subZones.map(subZone => {
                    if (subZone.name === subZoneName) {
                      const updatedExhibits = subZone.exhibits && Array.isArray(subZone.exhibits) ? subZone.exhibits.map(exhibit => {
                        if (exhibit.id === exhibitId) {
                          console.log(`Toggling exhibit "${exhibit.name}" from isPaused: ${exhibit.isPaused} to ${!exhibit.isPaused}`);
                          return { ...exhibit, isPaused: !exhibit.isPaused };
                        }
                        return exhibit;
                      }) : [];
                      return { ...subZone, exhibits: updatedExhibits };
                    }
                    return subZone;
                  }) : [];
                  return { ...zone, subZones: updatedSubZones };
                }
                return zone;
              }) : [];
              return { ...room, zones: updatedZones };
            }
            return room;
          });
          console.log("Updated Rooms State (after toggle):", JSON.parse(JSON.stringify(updatedRooms)));
          return updatedRooms;
        });
        setMessage('Exhibit status toggled successfully!');
        setMessageType('success');
      });
    } catch (error) {
      console.error("Error toggling exhibit status:", error);
      setMessage('Failed to toggle exhibit status due to an internal error.');
      setMessageType('error');
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans container mx-auto max-w-7xl">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Room & Exhibit Management</h1>

      {message && (
        <div className={`p-4 mb-6 mx-auto max-w-3xl rounded-lg flex items-center justify-center shadow-md ${messageType === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
          {messageType === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <XCircle className="h-5 w-5 mr-2" />}
          <span className="text-sm font-medium">{message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {roomDataWithZones.map((room) => (
          <div key={room.id} className="bg-white shadow-xl rounded-xl p-6 border border-gray-200 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800">{room.name}</h3>
              <button
                onClick={() => toggleRoomExpansion(room.id)}
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200"
                title={expandedRoom === room.id ? 'Collapse Room' : 'Expand Room'}
              >
                {expandedRoom === room.id ? (
                  <ChevronUp className="h-6 w-6" />
                ) : (
                  <ChevronDown className="h-6 w-6" />
                )}
              </button>
            </div>

            {expandedRoom === room.id && room.zones.length > 0 && (
              <div className="mt-4 space-y-6">
                <p className="text-lg font-semibold text-gray-700 mb-3">Main Zones:</p>
                <ul className="space-y-4">
                  {room.zones.map((zone, zoneIndex) => {
                    const { currentVisitors } = calculateZoneCapacity(zone);
                    const zoneKey = `${room.id}-${zone.name}`;

                    return (
                      <li key={zoneIndex} className="bg-indigo-50 p-4 rounded-lg shadow-sm border border-indigo-100"> {/* Distinct shade for main zones */}
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xl font-semibold text-gray-800">{zone.name}</span>
                          <button
                            onClick={() => toggleZoneExpansion(zone.name)}
                            className="p-1 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors duration-200"
                            title={expandedZone === zone.name ? 'Collapse Zone' : 'Expand Zone'}
                          >
                            {expandedZone === zone.name ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 flex items-center">
                          <Users className="h-4 w-4 mr-1 text-purple-500" /> Visitors: <span className="font-medium ml-1">{currentVisitors}</span>
                        </p>

                        {/* Leaderboard Section */}
                        {expandedZone === zone.name && (
                          <div className="mt-5 pt-4 border-t border-gray-200">
                            <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                              <BarChartBig className="h-5 w-5 mr-2 text-blue-600" /> Leaderboard
                            </h4>
                            <div className="flex space-x-2 mb-4">
                              <button
                                onClick={() => setActiveLeaderboardPeriod(prev => ({ ...prev, [zoneKey]: 'daily' }))}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm ${activeLeaderboardPeriod[zoneKey] === 'daily' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                              >
                                Daily
                              </button>
                              <button
                                onClick={() => setActiveLeaderboardPeriod(prev => ({ ...prev, [zoneKey]: 'monthly' }))}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm ${activeLeaderboardPeriod[zoneKey] === 'monthly' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                              >
                                Monthly
                              </button>
                            </div>

                            {mockLeaderboardData[zoneKey] && mockLeaderboardData[zoneKey][activeLeaderboardPeriod[zoneKey]] && mockLeaderboardData[zoneKey][activeLeaderboardPeriod[zoneKey]].length > 0 ? (
                              <ol className="list-decimal list-inside text-gray-800 space-y-2 pl-5">
                                {mockLeaderboardData[zoneKey][activeLeaderboardPeriod[zoneKey]].map((entry, entryIndex) => (
                                  <li key={entryIndex} className="flex justify-between items-center text-base bg-white p-2 rounded-md shadow-xs border border-gray-100">
                                    <span className="font-medium">{entry.userName}</span>
                                    <span className="font-bold text-blue-700">{entry.score} XP</span>
                                  </li>
                                ))}
                              </ol>
                            ) : (
                              <p className="text-gray-500 italic text-sm">No leaderboard data available for this period.</p>
                            )}
                          </div>
                        )}


                        {/* Sub-Zones Section (visible when main zone is expanded) */}
                        {expandedZone === zone.name && zone.subZones.length > 0 && (
                          <div className="mt-5 pt-4 border-t border-gray-200">
                            <p className="text-lg font-semibold text-gray-700 mb-3">Sub-Zones:</p>
                            <ul className="space-y-4">
                              {zone.subZones.map((subZone, subZoneIndex) => (
                                <li key={subZoneIndex} className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-100"> {/* Distinct shade for sub-zones */}
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-lg font-semibold text-gray-800">{subZone.name}</span>
                                    <button
                                      onClick={() => toggleSubZoneExpansion(subZone.name)}
                                      className="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-colors duration-200"
                                      title={expandedSubZone === subZone.name ? 'Collapse Sub-Zone' : 'Expand Sub-Zone'}
                                    >
                                      {expandedSubZone === subZone.name ? (
                                        <ChevronUp className="h-5 w-5" />
                                      ) : (
                                        <ChevronDown className="h-5 w-5" />
                                      )}
                                    </button>
                                  </div>

                                  {/* Exhibits Section (visible when sub-zone is expanded) */}
                                  {expandedSubZone === subZone.name && (
                                    <div className="mt-5 pt-4 border-t border-gray-200">
                                      <div className="flex justify-between items-center mb-4">
                                        <p className="text-lg font-semibold text-gray-700">Exhibits:</p>
                                        <button
                                          onClick={() => openExhibitModal(room, zone, subZone)}
                                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-md transition-colors duration-200"
                                        >
                                          <Plus className="h-4 w-4 mr-2" /> Add Exhibit
                                        </button>
                                      </div>
                                      {subZone.exhibits.length > 0 ? (
                                        <ul className="space-y-3">
                                          {subZone.exhibits.map((exhibit) => (
                                            <li key={exhibit.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"> {/* Lightest shade for exhibits */}
                                              <div className="flex justify-between items-start">
                                                <div>
                                                  <p className="font-bold text-gray-900 text-lg">{exhibit.name}</p>
                                                  <p className="text-sm text-gray-700 flex items-center mt-1">
                                                    <Award className="h-4 w-4 mr-1 text-yellow-600" /> XP: <span className="font-medium ml-1">{exhibit.xpPoints}</span>
                                                  </p>
                                                  <p className="text-sm text-gray-700 flex items-center mt-1">
                                                    <Users className="h-4 w-4 mr-1 text-purple-600" /> Visitors: <span className="font-medium ml-1">{exhibit.visitors}</span>
                                                  </p>
                                                  <p className={`text-sm font-semibold flex items-center mt-1 ${exhibit.isPaused ? 'text-red-600' : 'text-green-600'}`}>
                                                    <Info className="h-4 w-4 mr-1" /> Status: {exhibit.isPaused ? 'Paused' : 'Active'}
                                                  </p>
                                                </div>
                                                {/* Exhibit Action Buttons */}
                                                <div className="flex space-x-2">
                                                  <button
                                                    onClick={() => openExhibitModal(room, zone, subZone, exhibit)}
                                                    className="p-2 rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors duration-200 shadow-sm"
                                                    title="Edit Exhibit"
                                                  >
                                                    <Edit className="h-5 w-5" />
                                                  </button>
                                                  <button
                                                    onClick={() => handleToggleExhibitStatus(room.id, zone.name, subZone.name, exhibit.id)}
                                                    className={`p-2 rounded-full ${exhibit.isPaused ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'} transition-colors duration-200 shadow-sm`}
                                                    title={exhibit.isPaused ? 'Resume Exhibit' : 'Pause Exhibit'}
                                                  >
                                                    {exhibit.isPaused ? <PlayCircle className="h-5 w-5" /> : <PauseCircle className="h-5 w-5" />}
                                                  </button>
                                                  <button
                                                    onClick={() => handleDeleteExhibit(room.id, zone.name, subZone.name, exhibit.id)}
                                                    className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors duration-200 shadow-sm"
                                                    title="Delete Exhibit"
                                                  >
                                                    <Trash className="h-5 w-5" />
                                                  </button>
                                                </div>
                                              </div>
                                            </li>
                                          ))}
                                        </ul>
                                      ) : (
                                        <p className="text-gray-500 italic text-base mt-2">No exhibits in this sub-zone.</p>
                                      )}
                                    </div>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {expandedZone === zone.name && zone.subZones.length === 0 && (
                          <div className="mt-4 border-t border-gray-200 pt-4">
                            <p className="text-md text-gray-600 italic">No specific sub-zones defined for this main zone.</p>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            {expandedRoom === room.id && room.zones.length === 0 && (
              <div className="mt-4 border-t border-gray-200 pt-4">
                <p className="text-md text-gray-600 italic">No specific zones defined for this room.</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {isExhibitModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full relative animate-scale-in transform transition-all duration-300 ease-out border border-gray-200">
            <button
              onClick={closeExhibitModal}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 hover:text-gray-900 flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              aria-label="Close modal"
            >
              <XCircle className="h-6 w-6" />
            </button>
            <h3 className="text-2xl font-bold mb-6 text-gray-800">{editingExhibit ? 'Edit Exhibit' : 'Add New Exhibit'}</h3>
            <form onSubmit={handleExhibitSubmit}>
              <div className="grid grid-cols-1 gap-5 mb-6">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Exhibit Name</label>
                  <input
                    type="text"
                    value={newExhibitData.name}
                    onChange={(e) => setNewExhibitData({ ...newExhibitData, name: e.target.value })}
                    className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">XP Points</label>
                  <input
                    type="number"
                    value={newExhibitData.xpPoints}
                    onChange={(e) => setNewExhibitData({ ...newExhibitData, xpPoints: parseInt(e.target.value) || 0 })}
                    className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Visitors (Simulated Heatmap)</label>
                  <input
                    type="number"
                    value={newExhibitData.visitors}
                    onChange={(e) => setNewExhibitData({ ...newExhibitData, visitors: parseInt(e.target.value) || 0 })}
                    className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 bg-white text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    min="0"
                    required
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPaused"
                    checked={newExhibitData.isPaused}
                    onChange={(e) => setNewExhibitData({ ...newExhibitData, isPaused: e.target.checked })}
                    className="form-checkbox h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isPaused" className="ml-2 text-gray-700 text-base font-semibold">Is Paused?</label>
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={closeExhibitModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-5 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-md hover:shadow-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg flex items-center transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <Save className="h-5 w-5 mr-2" /> {editingExhibit ? 'Update Exhibit' : 'Add Exhibit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomsManagement;
