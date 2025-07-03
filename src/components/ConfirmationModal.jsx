import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel, type = 'info' }) => {
  if (!isOpen) return null;

  let icon, bgColor, textColor, confirmButtonColor;

  switch (type) {
    case 'success':
      icon = <CheckCircle className="h-10 w-10 text-green-500" />;
      bgColor = 'bg-green-50';
      textColor = 'text-green-800';
      confirmButtonColor = 'bg-green-600 hover:bg-green-700';
      break;
    case 'danger':
      icon = <XCircle className="h-10 w-10 text-red-500" />;
      bgColor = 'bg-red-50';
      textColor = 'text-red-800';
      confirmButtonColor = 'bg-red-600 hover:bg-red-700';
      break;
    case 'warning':
      icon = <AlertTriangle className="h-10 w-10 text-yellow-500" />;
      bgColor = 'bg-yellow-50';
      textColor = 'text-yellow-800';
      confirmButtonColor = 'bg-yellow-600 hover:bg-yellow-700';
      break;
    case 'info':
    default:
      icon = <Info className="h-10 w-10 text-blue-500" />;
      bgColor = 'bg-blue-50';
      textColor = 'text-blue-800';
      confirmButtonColor = 'bg-blue-600 hover:bg-blue-700';
      break;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-11/12 relative animate-scale-in transform transition-all duration-300 ease-out">
        <div className={`flex flex-col items-center p-6 rounded-lg ${bgColor}`}>
          {icon}
          <p className={`mt-4 text-center text-lg font-semibold ${textColor}`}>
            {message}
          </p>
        </div>

        <div className="flex justify-center space-x-4 mt-8">
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-md"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`${confirmButtonColor} text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
