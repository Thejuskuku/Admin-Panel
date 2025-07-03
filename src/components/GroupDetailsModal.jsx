import React from 'react';
import { XCircle, Users, CheckCircle, X as CloseIcon, Award, CalendarDays, Ticket, Link as LinkIcon } from 'lucide-react';

const GroupDetailsModal = ({ isOpen, group, onClose }) => {
  // The modal will only render if it's explicitly told to be open AND a group object is provided
  if (!isOpen || !group) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-11/12 relative animate-scale-in transform transition-all duration-300 ease-out">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 hover:text-gray-900 flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
          aria-label="Close modal"
        >
          <CloseIcon className="h-6 w-6" />
        </button>
        <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center border-b pb-4">
          <Users className="h-7 w-7 text-indigo-600 mr-3" />
          Group Details: <span className="ml-2 text-indigo-800">{group.name}</span>
        </h3>

        <div className="space-y-4 text-gray-700 mb-6">
          <p><strong>Group ID:</strong> <span className="font-mono bg-gray-100 p-1 rounded-md text-sm">{group.id.substring(0, 8)}...</span></p>
          <p>
            <strong>Primary Booker:</strong>
            <span className="ml-2">{group.primaryBookerName}</span>
          </p>
          <p>
            <strong>Status:</strong>{' '}
            <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${group.status === 'Active' || group.status.includes('Approved') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {group.status}
            </span>
          </p>
          <p className="flex items-center">
            <strong>Public Group:</strong>{' '}
            {group.isPublic ? <CheckCircle className="h-5 w-5 text-green-500 ml-2" /> : <XCircle className="h-5 w-5 text-red-500 ml-2" />}
          </p>
        </div>

        {/* Group Link Section */}
        <div className="border-t pt-4 mt-4">
          <h4 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
            <LinkIcon className="h-6 w-6 text-blue-600 mr-2" /> Group Link
          </h4>
          {group.id ? (
            <p className="text-base text-gray-700 break-all bg-gray-100 p-3 rounded-md border border-gray-200">
              {`https://your-app-domain.com/join-group/${group.id}`} {/* Placeholder for actual link */}
            </p>
          ) : (
            <p className="text-gray-500 italic">Group link not available (Group ID missing).</p>
          )}
        </div>
        {/* End Group Link Section */}

        <h4 className="text-xl font-bold text-gray-800 mb-3 flex items-center border-b pb-2">
          <Award className="h-6 w-6 text-blue-600 mr-2" /> Group Statistics
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm font-semibold text-gray-600">Overall XP Earned:</p>
            <p className="text-lg font-bold text-gray-900">{group.overallXPEarned || 0}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600">Zones Covered (from members):</p>
            <p className="text-base text-gray-900">
              {group.groupZonesCovered && group.groupZonesCovered.length > 0 ? group.groupZonesCovered.join(', ') : 'N/A'}
            </p>
          </div>
          {group.latestBookingDate !== 'N/A' && (
            <div>
              <p className="text-sm font-semibold text-gray-600 flex items-center"><CalendarDays className="h-4 w-4 mr-1 text-blue-600"/> Latest Booking Date:</p>
              <p className="text-base text-gray-900">{group.latestBookingDate}</p>
            </div>
          )}
           {group.visitDate !== 'N/A' && (
            <div>
              <p className="text-sm font-semibold text-gray-600 flex items-center"><CalendarDays className="h-4 w-4 mr-1 text-blue-600"/> Latest Visit Date:</p>
              <p className="text-base text-gray-900">{group.visitDate}</p>
            </div>
          )}
          {/* Display Add-ons Purchased with Users */}
          <div>
            <p className="text-sm font-semibold text-gray-600 flex items-center"><Ticket className="h-4 w-4 mr-1 text-blue-600"/> Add-ons Purchased:</p>
            {group.addOnsDetails && group.addOnsDetails.length > 0 ? (
              <ul className="list-disc list-inside text-base text-gray-900">
                {group.addOnsDetails.map((addon, index) => (
                  <li key={index}>
                    <strong>{addon.name}</strong>
                    {addon.purchasedBy && addon.purchasedBy.length > 0 && (
                      <span className="ml-2 text-gray-700 text-sm">
                        (Used by: {addon.purchasedBy.join(', ')})
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-base text-gray-900">None</p>
            )}
          </div>
        </div>


        <h4 className="text-xl font-semibold mt-6 mb-3 text-gray-800 flex items-center">
          <Users className="h-6 w-6 text-indigo-600 mr-2" /> Group Members (Total: {group.members ? group.members.length : 0})
        </h4>
        {group.members && group.members.length > 0 ? (
          <ul className="list-disc list-inside space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {group.members.map((member, index) => (
              <li key={index} className="flex items-center text-gray-700">
                <span className="font-medium mr-2">{member.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${member.status === 'Joined' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-600'}`}>
                  {member.status}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No members in this group.</p>
        )}

        <div className="flex justify-end mt-8 space-x-3">
          <button
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-5 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailsModal;
