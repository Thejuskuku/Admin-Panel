import React, { useState, useEffect, useContext } from 'react';
import { AdminDashboardContext } from '../App.jsx'; // Re-adjusted import path to include .jsx
import {
    BarChart2, Calendar, ArrowUp, ArrowDown, Download, CheckCircle, XCircle, Flag, Clock, User, Shield, Server, TrendingUp, Star, MessageSquare, Map, Zap, Trophy, BookOpen, Gift, ListChecks
} from 'lucide-react';

// --- HELPER & MOCK DATA FUNCTIONS ---

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const formatCurrency = (value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Function to convert JSON data to CSV format
const convertToCSV = (objArray) => {
    const array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = '';

    // Handle nested objects/arrays by flattening them
    const flattenObject = (ob) => {
        const toReturn = {};
        for (let i in ob) {
            if (!ob.hasOwnProperty(i)) continue;

            if ((typeof ob[i]) == 'object' && ob[i] !== null) {
                const flatObject = flattenObject(ob[i]);
                for (let x in flatObject) {
                    if (!flatObject.hasOwnProperty(x)) continue;
                    toReturn[i + '_' + x] = flatObject[x];
                }
            } else {
                toReturn[i] = ob[i];
            }
        }
        return toReturn;
    };

    const flattenedArray = array.map(item => flattenObject(item));

    // Headers
    for (let index in flattenedArray[0]) {
        row += index + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';

    // Data
    for (let i = 0; i < flattenedArray.length; i++) {
        let line = '';
        for (let index in flattenedArray[i]) {
            if (line !== '') line += ','
            let cellValue = flattenedArray[i][index];
            // Handle commas in cell values by enclosing in quotes
            if (typeof cellValue === 'string' && cellValue.includes(',')) {
                cellValue = `"${cellValue.replace(/"/g, '""')}"`; // Escape double quotes
            }
            line += cellValue;
        }
        str += line + '\r\n';
    }
    return str;
};


// Generates comprehensive mock data with summary and detailed views
const generateMockData = () => {
    const currentRevenue = rand(50000, 85000);
    const prevRevenue = rand(45000, 75000);
    const currentVisitors = rand(1200, 2500);
    const prevVisitors = rand(1000, 2200);

    return {
        keyMetrics: {
            totalRevenue: { current: currentRevenue, prev: prevRevenue },
            totalVisitors: { current: currentVisitors, prev: prevVisitors },
            avgSpend: { current: currentRevenue / currentVisitors, prev: prevRevenue / prevVisitors },
        },
        incomeTrends: {
            summary: [
                { name: 'Ticket Sales', value: rand(30000, 40000), color: 'bg-blue-500' },
                { name: 'Add-ons', value: rand(10000, 20000), color: 'bg-green-500' },
                { name: 'Merchandise', value: rand(5000, 15000), color: 'bg-indigo-500' },
            ],
            details: [...Array(30)].map((_, i) => ({ date: `2025-06-${30 - i}`, tickets: rand(1000, 2000), addons: rand(300, 800), merchandise: rand(200, 500) })),
        },
        paymentBreakdown: {
            summary: [
                { source: 'Kiosk-01', method: 'Credit Card', volume: rand(300, 500), base: rand(15000, 20000), gst: rand(1500, 2000) },
                { source: 'Counter-A', method: 'Debit Card', volume: rand(200, 400), base: rand(10000, 15000), gst: rand(1000, 1500) },
                { source: 'Online', method: 'Wallet', volume: rand(500, 800), base: rand(25000, 35000), gst: rand(2500, 3500) },
            ],
            details: [...Array(10)].map(() => ({ transactionId: `T${rand(10000, 99999)}`, source: 'Kiosk-01', amount: rand(50, 200), gst: rand(5, 20), time: `${rand(10,18)}:${rand(10,59)}` })),
        },
        failedPayments: {
            summary: [
                { reason: 'Insufficient Funds', method: 'Credit Card', count: rand(5, 20), flagged: false },
                { reason: 'Connection Timeout', method: 'Online Wallet', count: rand(2, 10), flagged: true },
                { reason: 'Incorrect Details', method: 'Debit Card', count: rand(10, 30), flagged: false },
            ],
            details: [...Array(5)].map(() => ({ transactionId: `T${rand(10000, 99999)}`, reason: 'Insufficient Funds', amount: rand(50, 200), time: `${rand(10,18)}:${rand(10,59)}` })),
        },
        zoneRatings: {
            summary: [
                { name: 'Quantum Core', rating: rand(40, 50) / 10, prevRating: rand(38, 48) / 10 },
                { name: 'Mystic Forest', rating: rand(35, 48) / 10, prevRating: rand(35, 45) / 10 },
                { name: 'Cybernetic City', rating: rand(28, 40) / 10, prevRating: rand(30, 42) / 10 },
            ],
            details: {
                'Quantum Core': [{ visitor: 'Jane D.', rating: 5, comment: 'Absolutely stunning visuals!'}, { visitor: 'Alex P.', rating: 4, comment: 'A bit intense but fun.'}],
                'Mystic Forest': [{ visitor: 'Mike S.', rating: 4, comment: 'Loved the atmosphere, but the queue was long.'}],
                'Cybernetic City': [{ visitor: 'Chris W.', rating: 3, comment: 'The app integration was confusing.'}],
            }
        },
        visitorPerformance: {
             summary: {
                avgTimeInZones: [
                    { zone: 'Quantum Core', time: rand(40, 55) },
                    { zone: 'Mystic Forest', time: rand(30, 45) },
                    { zone: 'Cybernetic City', time: rand(20, 35) },
                ],
                dropOffZone: 'Cybernetic City',
                dropOffRate: { current: rand(15, 25), prev: rand(18, 28) },
                visitorFlow: "Entry -> Mystic Forest (70%) -> Quantum Core (65%) -> Exit"
            },
            details: [
                { event: 'Zone Entry', zone: 'Mystic Forest', timestamp: '10:05:12' },
                { event: 'Interaction', element: 'Crystal Tree', timestamp: '10:15:30' },
                { event: 'Drop Off', zone: 'Cybernetic City', reason: 'High Queue Time', timestamp: '11:30:00' }
            ]
        },
        gamification: {
            leaderboard: {
                summary: [
                    { rank: 1, name: 'ShadowGamer', xp: 15200 },
                    { rank: 2, name: 'NexusExplorer', xp: 14800 },
                    { rank: 3, name: 'CyberPunk', xp: 14500 },
                ],
                details: [...Array(10)].map((_, i) => ({ rank: i + 1, name: `Player${rand(100,999)}`, xp: rand(10000, 15000) }))
            },
            loreProgression: {
                summary: [
                    { mission: 'Echoes of the Core', completion: rand(70, 90) },
                    { mission: 'Whispers of the Forest', completion: rand(50, 75) },
                ],
                 details: [
                    { mission: 'Echoes of the Core', chapter: 'Chapter 1: The Awakening', completion: 100 },
                    { mission: 'Echoes of the Core', chapter: 'Chapter 2: The Signal', completion: 60 },
                    { mission: 'Whispers of the Forest', chapter: 'Chapter 1: The Hidden Path', completion: 80 }
                ]
            },
            redemptions: {
                summary: {
                    volume: { current: rand(1000, 1500), prev: rand(800, 1200) },
                    value: { current: rand(2000, 3500), prev: rand(1500, 3000) },
                },
                 details: [...Array(10)].map(() => ({ item: 'Discount Voucher', value: rand(5, 20), user: `User${rand(100,999)}`, time: `${rand(10,18)}:${rand(10,59)}` }))
            }
        },
        auditLog: {
            summary: [
                { timestamp: '15:30:15', user: 'admin@park.io', action: 'Updated kiosk settings', type: 'Admin' },
                { timestamp: '14:32:05', user: 'system', action: 'Finalized visit for Jane_D_123', type: 'System' },
                { timestamp: '14:05:10', user: 'security@park.io', action: 'Exported visitor logs', type: 'Admin' },
            ],
            details: [...Array(20)].map(() => ({ timestamp: `${rand(10,18)}:${rand(10,59)}:${rand(10,59)}`, user: ['admin@park.io', 'system', 'security@park.io'][rand(0,2)], action: 'System action details', type: ['Admin', 'System'][rand(0,1)] }))
        },
        kioskLogs: {
             summary: [
                { timestamp: '15:10:00', kiosk: 'Kiosk-01', event: 'Face Photo Upload initiated', status: 'Success' },
                { timestamp: '14:35:00', kiosk: 'Kiosk-03', event: 'Payment terminal error', status: 'Failure' },
                { timestamp: '14:12:00', kiosk: 'Kiosk-02', event: 'Uptime: 99.8%', status: 'Info' },
            ],
            details: [...Array(20)].map(() => ({ timestamp: `${rand(10,18)}:${rand(10,59)}:${rand(10,59)}`, kiosk: `Kiosk-0${rand(1,3)}`, event: 'Operational event log', status: ['Success', 'Failure', 'Info'][rand(0,2)] }))
        },
        postVisitFinalization: {
            summary: [
                { visitor: 'Jane_D_123', status: 'Finalized', xp: 8500, newAchievements: 2 },
                { visitor: 'Mike_S_456', status: 'Finalized', xp: 6200, newAchievements: 1 },
                { visitor: 'Bob_B_789', status: 'Pending', xp: 'N/A', newAchievements: 'N/A' },
            ],
             details: [...Array(15)].map(() => ({ visitor: `Visitor_${rand(100,999)}`, status: ['Finalized', 'Pending'][rand(0,1)], xp: rand(5000, 10000), newAchievements: rand(0,3) }))
        }
    };
};

// --- UI COMPONENTS ---

const Modal = ({ title, children, onClose, onExport }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <header className="flex justify-between items-center p-4 border-b">
                <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200"><XCircle size={24} /></button>
            </header>
            <main className="p-6 overflow-y-auto">{children}</main>
            <footer className="p-4 bg-gray-50 border-t flex justify-end gap-4 rounded-b-2xl">
                <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">Close</button>
                <button onClick={onExport} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                    <Download size={18} className="mr-2" /> Export Details
                </button>
            </footer>
        </div>
    </div>
);

const ClickableCard = ({ children, onClick }) => (
    <div onClick={onClick} className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white rounded-xl shadow-md h-full">
        {children}
    </div>
);

const StatCard = ({ title, value, change, icon, format = "number" }) => {
    const isPositive = change >= 0;
    const formattedValue = format === "currency" ? formatCurrency(value) : value.toLocaleString();
    const Icon = icon;
    return (
        <div className="bg-white p-4 rounded-xl shadow-md flex flex-col justify-between h-full">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-500">{title}</h3>
                <Icon className="h-6 w-6 text-gray-400" />
            </div>
            <div>
                <p className="text-3xl font-bold text-gray-800">{formattedValue}</p>
                <div className={`flex items-center text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {isPositive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                    <span>{change.toFixed(2)}% vs last period</span>
                </div>
            </div>
        </div>
    );
};

const TableCard = ({ title, headers, data, icon }) => {
    const Icon = icon;
    return (
        <div className="p-4 h-full">
            {title && (
                <div className="flex items-center mb-4">
                    <Icon className="h-6 w-6 text-gray-600 mr-3" />
                    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                </div>
            )}
            <div className="overflow-x-auto max-h-64">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-600 uppercase sticky top-0">
                        <tr>{headers.map(h => <th key={h} className="py-2 px-4">{h}</th>)}</tr>
                    </thead>
                    <tbody>
                        {data.map((row, i) => (
                            <tr key={i} className="border-b hover:bg-gray-50">
                                {Object.values(row).map((cell, j) => (
                                    <td key={j} className="py-2 px-4">
                                        {typeof cell === 'boolean' ? (cell ? <Flag className="text-red-500" /> : '') : String(cell)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ProgressBarCard = ({ title, data, icon }) => {
    const Icon = icon;
    return (
        <div className="p-4 h-full">
            <div className="flex items-center mb-4">
                <Icon className="h-6 w-6 text-gray-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            </div>
            <div className="space-y-4">
                {data.map(item => {
                    const change = item.rating ? (item.rating - item.prevRating).toFixed(1) : null;
                    const isPositive = change && change >= 0;
                    const width = item.rating ? item.rating * 20 : item.completion;
                    return (
                        <div key={item.name || item.mission}>
                            <div className="flex justify-between items-center mb-1 text-sm">
                                <span className="font-semibold">{item.name || item.mission}</span>
                                <div className="flex items-center">
                                    <span className="font-bold">{item.rating ? `${item.rating}/5` : `${item.completion}%`}</span>
                                    {change !== null && (
                                        <span className={`ml-2 flex items-center text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                                            {isPositive ? <ArrowUp size={12} /> : <ArrowDown size={12} />} {change}
                                        </span>
                                    )}
                                </div>
                            </div>
                            {/* Changed to rectangle progress bar */}
                            <div className="w-full bg-gray-200 h-4"> {/* Removed rounded-full */}
                                <div className="bg-blue-600 h-full" style={{ width: `${width}%` }}></div> {/* Removed rounded-full */}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const BarChartCard = ({ title, data, icon }) => {
    const Icon = icon;
    const maxValue = Math.max(...data.map(d => d.value));
    return (
        <div className="p-4 h-full">
            <div className="flex items-center mb-4">
                <Icon className="h-6 w-6 text-gray-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            </div>
            <div className="space-y-4">
                {data.map(item => (
                    <div key={item.name}>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-600">{item.name}</span>
                            <span className="font-bold">{formatCurrency(item.value)}</span>
                        </div>
                        {/* Changed to rectangle progress bar */}
                        <div className="w-full bg-gray-200 h-4"> {/* Removed rounded-full */}
                            <div className={`${item.color} h-4`} style={{ width: `${(item.value / maxValue) * 100}%` }}></div> {/* Removed rounded-full */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


// --- MAIN COMPONENT ---

const ReportsAnalytics = () => {
    const { simulateApiCall } = useContext(AdminDashboardContext);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(null);
    const [modalData, setModalData] = useState(null);

    const fetchData = async () => {
        setIsLoading(true);
        await simulateApiCall(() => {
            setData(generateMockData());
        });
        setIsLoading(false);
    };

    useEffect(() => {
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        setStartDate(start.toISOString().split('T')[0]);
        setEndDate(today.toISOString().split('T')[0]);
        fetchData();
    }, []);
    
    const handleFilterApply = () => fetchData();
    const openModal = (title, content, exportData) => setModalData({ title, content, exportData });
    const closeModal = () => setModalData(null);

    // Function to export all displayed data as CSV/Excel
    const handleExportAllData = () => {
        if (data) {
            // Combine all relevant data into a single array of objects for export
            const combinedData = [];

            // Key Metrics
            combinedData.push({
                Category: 'Key Metrics',
                Metric: 'Total Revenue',
                Current: data.keyMetrics.totalRevenue.current,
                Previous: data.keyMetrics.totalRevenue.prev,
                Change: ((data.keyMetrics.totalRevenue.current - data.keyMetrics.totalRevenue.prev) / data.keyMetrics.totalRevenue.prev) * 100
            });
            combinedData.push({
                Category: 'Key Metrics',
                Metric: 'Total Visitors',
                Current: data.keyMetrics.totalVisitors.current,
                Previous: data.keyMetrics.totalVisitors.prev,
                Change: ((data.keyMetrics.totalVisitors.current - data.keyMetrics.totalVisitors.prev) / data.keyMetrics.totalVisitors.prev) * 100
            });
            combinedData.push({
                Category: 'Key Metrics',
                Metric: 'Avg. Spend / Visitor',
                Current: data.keyMetrics.avgSpend.current,
                Previous: data.keyMetrics.avgSpend.prev,
                Change: ((data.keyMetrics.avgSpend.current - data.keyMetrics.avgSpend.prev) / data.keyMetrics.avgSpend.prev) * 100
            });

            // Income Trends
            data.incomeTrends.details.forEach(item => {
                combinedData.push({ Category: 'Income Trends', ...item });
            });

            // Payment Breakdown
            data.paymentBreakdown.details.forEach(item => {
                combinedData.push({ Category: 'Payment Breakdown', ...item });
            });

            // Failed Payments
            data.failedPayments.details.forEach(item => {
                combinedData.push({ Category: 'Failed Payments', ...item });
            });

            // Zone Ratings
            Object.entries(data.zoneRatings.details).forEach(([zoneName, feedbacks]) => {
                feedbacks.forEach(feedback => {
                    combinedData.push({ Category: 'Zone Ratings', Zone: zoneName, ...feedback });
                });
            });

            // Visitor Performance
            combinedData.push({ Category: 'Visitor Performance', Metric: 'Visitor Flow', Value: data.visitorPerformance.summary.visitorFlow });
            combinedData.push({ Category: 'Visitor Performance', Metric: 'Highest Drop-off Zone', Value: data.visitorPerformance.summary.dropOffZone, Rate: data.visitorPerformance.summary.dropOffRate.current });
            data.visitorPerformance.summary.avgTimeInZones.forEach(item => {
                combinedData.push({ Category: 'Visitor Performance', Metric: `Avg. Time in ${item.zone}`, Time: item.time });
            });
            data.visitorPerformance.details.forEach(item => {
                combinedData.push({ Category: 'Visitor Performance Details', ...item });
            });


            // Gamification - Leaderboard
            data.gamification.leaderboard.details.forEach(item => {
                combinedData.push({ Category: 'Leaderboard', ...item });
            });

            // Gamification - Lore Progression
            data.gamification.loreProgression.details.forEach(item => {
                combinedData.push({ Category: 'Lore Progression', ...item });
            });

            // Gamification - Redemptions
            data.gamification.redemptions.details.forEach(item => {
                combinedData.push({ Category: 'Redemptions', ...item });
            });

            // Audit Log
            data.auditLog.details.forEach(item => {
                combinedData.push({ Category: 'System Audit Log', ...item });
            });

            // Kiosk Logs
            data.kioskLogs.details.forEach(item => {
                combinedData.push({ Category: 'Kiosk Operational Logs', ...item });
            });

            // Post-Visit Finalization
            data.postVisitFinalization.details.forEach(item => {
                combinedData.push({ Category: 'Post-Visit Finalization', ...item });
            });


            const csv = convertToCSV(combinedData);
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            if (link.download !== undefined) { // feature detection
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', 'reports_analytics_data.csv');
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                alert('Your browser does not support downloading files directly. Please copy the data from the console.');
                console.log(csv); // Fallback for unsupported browsers
            }
        } else {
            alert("No data to export.");
        }
    };


    if (isLoading || !data) {
        return <div className="p-8 bg-gray-100 min-h-screen animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="h-16 bg-gray-200 rounded-xl mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>)}
            </div>
        </div>;
    }

    const renderModalContent = () => {
        if (!modalData) return null;
        const details = modalData.exportData;
        
        if (!details || (Array.isArray(details) && details.length === 0)) {
            return <p>No detailed data available.</p>;
        }
        
        // Handle object-based details (like Zone Ratings)
        if (typeof details === 'object' && !Array.isArray(details)) {
            return <pre className="bg-gray-100 p-4 rounded-lg text-sm whitespace-pre-wrap">{JSON.stringify(details, null, 2)}</pre>;
        }
        
        const headers = Object.keys(details[0] || {});
        return <TableCard title="" headers={headers} data={details} icon={() => null} />;
    };

    // Flatten feedback for display
    const allFeedback = Object.entries(data.zoneRatings.details).flatMap(([zone, feedbacks]) => 
        feedbacks.map(fb => ({ zone, ...fb }))
    );

    return (
        <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
            {modalData && (
                <Modal title={modalData.title} onClose={closeModal} onExport={() => {
                    // Specific export for modal data if needed, otherwise use the general one
                    if (modalData.exportData) {
                        const csv = convertToCSV(Array.isArray(modalData.exportData) ? modalData.exportData : [modalData.exportData]);
                        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                        const link = document.createElement('a');
                        if (link.download !== undefined) {
                            const url = URL.createObjectURL(blob);
                            link.setAttribute('href', url);
                            link.setAttribute('download', `${modalData.title.replace(/\s/g, '_').toLowerCase()}_details.csv`);
                            link.style.visibility = 'hidden';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        } else {
                            alert('Your browser does not support downloading files directly. Please copy the data from the console.');
                            console.log(csv);
                        }
                    } else {
                        alert("No specific data to export from this modal.");
                    }
                }}>
                    {renderModalContent()}
                </Modal>
            )}

            <h2 className="text-3xl font-bold text-gray-800 mb-6">Data & Analytics Reports</h2>
            
            <div className="bg-white p-4 rounded-xl shadow-md mb-8 flex flex-wrap items-center justify-between gap-4">
                 <div className="flex flex-wrap items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-600"/>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-white border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <span className="text-gray-600">to</span>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-white border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={handleFilterApply} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-all duration-300 shadow-md">
                        <BarChart2 className="h-5 w-5 mr-2" /> Apply Filter
                    </button>
                    {/* New Export All Data Button */}
                    <button onClick={handleExportAllData} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-all duration-300 shadow-md">
                        <Download className="h-5 w-5 mr-2" /> Export All Data
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                <div className="col-span-1 md:col-span-2 lg:col-span-4 xl:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard title="Total Revenue" value={data.keyMetrics.totalRevenue.current} change={((data.keyMetrics.totalRevenue.current - data.keyMetrics.totalRevenue.prev) / data.keyMetrics.totalRevenue.prev) * 100} icon={TrendingUp} format="currency" />
                    <StatCard title="Total Visitors" value={data.keyMetrics.totalVisitors.current} change={((data.keyMetrics.totalVisitors.current - data.keyMetrics.totalVisitors.prev) / data.keyMetrics.totalVisitors.prev) * 100} icon={User} />
                    <StatCard title="Avg. Spend / Visitor" value={data.keyMetrics.avgSpend.current} change={((data.keyMetrics.avgSpend.current - data.keyMetrics.avgSpend.prev) / data.keyMetrics.avgSpend.prev) * 100} icon={TrendingUp} format="currency" />
                </div>
                
                <ClickableCard onClick={() => openModal('Income Trends Details', null, data.incomeTrends.details)}>
                    <BarChartCard title="Income Trends" data={data.incomeTrends.summary} icon={BarChart2} />
                </ClickableCard>
                
                <div className="col-span-1 md:col-span-2">
                    <ClickableCard onClick={() => openModal('Payment Method Breakdown Details', null, data.paymentBreakdown.details)}>
                        <TableCard title="Payment Method Breakdown" icon={ListChecks} headers={['Source', 'Method', 'Volume', 'Base', 'GST']} data={data.paymentBreakdown.summary.map(d => ({...d, base: formatCurrency(d.base), gst: formatCurrency(d.gst)}))} />
                    </ClickableCard>
                </div>

                <ClickableCard onClick={() => openModal('Failed Payments Analysis Details', null, data.failedPayments.details)}>
                     <TableCard title="Failed Payments Analysis" icon={XCircle} headers={['Reason', 'Method', 'Count', 'Flagged']} data={data.failedPayments.summary} />
                </ClickableCard>
                
                <ClickableCard onClick={() => openModal('Zone Ratings Details', null, data.zoneRatings.details)}>
                    <ProgressBarCard title="Zone Ratings" icon={Star} data={data.zoneRatings.summary} />
                </ClickableCard>

                <div className="col-span-1 md:col-span-2">
                    <ClickableCard onClick={() => openModal('Open-ended Feedback Details', null, allFeedback)}>
                         <TableCard title="Open-ended Feedback" icon={MessageSquare} headers={['Zone', 'Visitor', 'Rating', 'Comment']} data={allFeedback.slice(0,3)} />
                    </ClickableCard>
                </div>
               
                 <ClickableCard onClick={() => openModal('Visitor Performance Details', null, data.visitorPerformance.details)}>
                     <div className="p-4 h-full">
                        <div className="flex items-center mb-4"><Map className="h-6 w-6 text-gray-600 mr-3" /><h3 className="text-xl font-bold text-gray-800">Visitor Performance</h3></div>
                        <div className="space-y-3 text-sm">
                            <div><span className="font-semibold">Visitor Flow:</span> {data.visitorPerformance.summary.visitorFlow}</div>
                            <div><span className="font-semibold">Highest Drop-off:</span> {data.visitorPerformance.summary.dropOffZone} ({data.visitorPerformance.summary.dropOffRate.current}% rate)</div>
                            <div><span className="font-semibold">Avg. Times:</span> {data.visitorPerformance.summary.avgTimeInZones.map(z => `${z.zone} (${z.time}m)`).join(', ')}</div>
                        </div>
                    </div>
                </ClickableCard>

                <ClickableCard onClick={() => openModal('Leaderboard Details', null, data.gamification.leaderboard.details)}>
                    <TableCard title="Leaderboard" icon={Trophy} headers={['Rank', 'Name', 'XP']} data={data.gamification.leaderboard.summary} />
                </ClickableCard>
                
                 <ClickableCard onClick={() => openModal('Lore Progression Details', null, data.gamification.loreProgression.details)}>
                    <ProgressBarCard title="Lore Progression" icon={BookOpen} data={data.gamification.loreProgression.summary} />
                </ClickableCard>

                 <div className="col-span-1 md:col-span-2">
                     <ClickableCard onClick={() => openModal('XP & Badge Redemptions Details', null, data.gamification.redemptions.details)}>
                        <div className="p-4 h-full"><div className="flex items-center mb-4"><Gift className="h-6 w-6 text-gray-600 mr-3" /><h3 className="text-xl font-bold text-gray-800">XP & Badge Redemptions</h3></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm"><StatCard title="Redemption Volume" value={data.gamification.redemptions.summary.volume.current} change={((data.gamification.redemptions.summary.volume.current - data.gamification.redemptions.summary.volume.prev) / data.gamification.redemptions.summary.volume.prev) * 100} icon={Zap} /><StatCard title="Redemption Value" value={data.gamification.redemptions.summary.value.current} change={((data.gamification.redemptions.summary.value.current - data.gamification.redemptions.summary.value.prev) / data.gamification.redemptions.summary.value.prev) * 100} icon={TrendingUp} format="currency" /></div></div>
                    </ClickableCard>
                </div>

                <div className="col-span-1 md:col-span-2">
                     <ClickableCard onClick={() => openModal('System Audit Log Details', null, data.auditLog.details)}>
                        <TableCard title="System Audit Log" icon={Shield} headers={['Timestamp', 'User', 'Action', 'Type']} data={data.auditLog.summary} />
                    </ClickableCard>
                </div>
                <div className="col-span-1 md:col-span-2">
                    <ClickableCard onClick={() => openModal('Kiosk Operational Logs Details', null, data.kioskLogs.details)}>
                        <TableCard title="Kiosk Operational Logs" icon={Server} headers={['Timestamp', 'Kiosk', 'Event', 'Status']} data={data.kioskLogs.summary} />
                    </ClickableCard>
                </div>
                <div className="col-span-1 md:col-span-2">
                     <ClickableCard onClick={() => openModal('Post-Visit Finalization Details', null, data.postVisitFinalization.details)}>
                        <TableCard title="Post-Visit Finalization Status" icon={CheckCircle} headers={['Visitor ID', 'Status', 'Total XP', 'New Achievements']} data={data.postVisitFinalization.summary} />
                    </ClickableCard>
                </div>
            </div>
        </div>
    );
};

export default ReportsAnalytics;
