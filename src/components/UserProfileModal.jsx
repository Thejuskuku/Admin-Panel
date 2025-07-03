import React, { useContext } from 'react';
import { AdminDashboardContext } from '../App'; // Import context
import { XCircle, UserRound, UserRoundCog, Award, List } from 'lucide-react'; // Icons

const UserProfileModal = ({ user, onClose }) => {
  const { data } = useContext(AdminDashboardContext);

  if (!user) return null;

  // Find parent if user is a dependent
  const parentAccount = user.type === 'Dependent' ? data.users.find(u => u.id === user.parentId && u.type === 'Full User') : null;

  // Find dependents if user is a Full User
  const associatedDependents = user.type === 'Full User' ? data.users.filter(u => u.parentId === user.id && u.type === 'Dependent') : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-2xl w-11/12 relative animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <XCircle className="h-7 w-7" />
        </button>
        <h3 className="text-3xl font-bold mb-6 text-gray-800 flex items-center border-b pb-4">
          <UserRound className="h-8 w-8 text-blue-600 mr-3" /> User Profile: <span className="ml-2 text-blue-800">{user.name}</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 mb-6">
          <div>
            <p className="text-sm font-semibold text-gray-600">User ID:</p>
            <p className="text-base text-gray-900 font-mono bg-gray-100 p-2 rounded-md">{user.id}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600">Email:</p>
            <p className="text-base text-gray-900">{user.email}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600">Phone:</p>
            <p className="text-base text-gray-900">{user.phone}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600">Type:</p>
            <p className="text-base text-gray-900">{user.type}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600">Status:</p>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {user.status}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600">Last Login:</p>
            <p className="text-base text-gray-900">{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}</p>
          </div>
        </div>

        {user.type === 'Dependent' && parentAccount && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-lg font-semibold text-blue-700 mb-3 flex items-center">
              <UserRoundCog className="h-5 w-5 text-blue-500 mr-2" /> Parent Account
            </h4>
            <p className="text-base text-gray-900">
              {parentAccount.name} (<span className="font-mono">{parentAccount.email}</span>)
            </p>
          </div>
        )}

        <h4 className="text-xl font-bold text-gray-800 mb-3 flex items-center border-b pb-2">
          <Award className="h-6 w-6 text-yellow-500 mr-2" /> User Stats
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <p className="text-sm font-semibold text-gray-600">Points Earned:</p>
            <p className="text-lg font-bold text-gray-900">{user.pointsEarned}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600">Zones Covered:</p>
            <p className="text-base text-gray-900">
              {user.zonesCovered && user.zonesCovered.length > 0 ? user.zonesCovered.join(', ') : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600">Number of Visits:</p>
            <p className="text-lg font-bold text-gray-900">{user.numVisits}</p>
          </div>
        </div>

        {user.type === 'Full User' && associatedDependents.length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
              <List className="h-5 w-5 text-gray-500 mr-2" /> Associated Dependents
            </h4>
            <ul className="list-disc pl-5 mb-0 text-gray-900">
              {associatedDependents.map(dep => (
                <li key={dep.id}>{dep.name} (<span className="font-mono">{dep.email}</span>)</li>
              ))}
            </ul>
          </div>
        )}
        {user.type === 'Full User' && associatedDependents.length === 0 && (
          <p className="text-base text-gray-600 mb-6">No associated dependents.</p>
        )}


        <div className="flex justify-end mt-6">
          <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
