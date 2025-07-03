import React, { useState, useContext } from 'react';
import { AdminDashboardContext } from '../App'; // Adjusted import path for context
import { CircleDollarSign, CheckCircle, XCircle } from 'lucide-react'; // Icons

const PaymentsManagement = () => {
  const { data, updateData, simulateApiCall } = useContext(AdminDashboardContext);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleRefund = async (paymentId) => {
    if (window.confirm('Are you sure you want to process a refund for this payment?')) {
      await simulateApiCall(() => {
        updateData('payments', paymentId, { status: 'Refunded' });
        setMessage('Refund processed successfully!');
        setMessageType('success');
      });
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen md:pb-24">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Payment Management</h2>

      {message && (
        <div className={`p-4 mb-6 rounded-lg flex items-center ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {messageType === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <XCircle className="h-5 w-5 mr-2" />}
          {message}
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Transaction ID</th>
              <th className="py-3 px-6 text-left">Booking ID</th>
              <th className="py-3 px-6 text-left">User ID</th>
              <th className="py-3 px-6 text-left">Amount</th>
              <th className="py-3 px-6 text-left">Method</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Timestamp</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {data.payments.map((payment) => (
              <tr key={payment.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{payment.id.substring(0, 8)}...</td>
                <td className="py-3 px-6 text-left whitespace-nowrap">{payment.bookingId.substring(0, 8)}...</td>
                <td className="py-3 px-6 text-left whitespace-nowrap">{payment.userId.substring(0, 8)}...</td>
                <td className="py-3 px-6 text-left">${payment.amount.toFixed(2)}</td>
                <td className="py-3 px-6 text-left">{payment.method}</td>
                <td className="py-3 px-6 text-left">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${payment.status === 'Successful' ? 'bg-green-100 text-green-800' : payment.status === 'Refunded' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                    {payment.status}
                  </span>
                </td>
                <td className="py-3 px-6 text-left">{new Date(payment.timestamp).toLocaleString()}</td>
                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-center space-x-2">
                    {payment.status === 'Successful' && (
                      <button onClick={() => handleRefund(payment.id)} className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 flex items-center justify-center transition-colors duration-200" title="Process Refund">
                        <CircleDollarSign className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsManagement;
