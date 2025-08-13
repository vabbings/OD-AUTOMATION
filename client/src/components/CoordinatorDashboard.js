import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EmailExportModal from './EmailExportModal';

const CoordinatorDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const requestsRes = await axios.get('/api/requests');
      setRequests(requestsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestId, status) => {
    try {
      let endpoint;
      if (status === 'Approved') {
        endpoint = `/api/requests/${requestId}/approve`;
      } else if (status === 'Rejected') {
        endpoint = `/api/requests/${requestId}/reject`;
      } else {
        throw new Error('Invalid status');
      }

      await axios.put(endpoint);
      
      if (status === 'Rejected') {
        // Show success message for rejected requests
        setSuccessMessage('Request rejected successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        // Show success message for approved requests
        setSuccessMessage('Request approved successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
      
      fetchData();
    } catch (error) {
      console.error('Error updating request:', error);
      setSuccessMessage('Error processing request');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const response = await axios.get('/api/export', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'approved-od-requests.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Refresh data after successful export to show updated request list
      await fetchData();
      setSuccessMessage('Excel file downloaded successfully. All approved and rejected requests have been deleted.');
    } catch (error) {
      console.error('Error exporting data:', error);
    } finally {
      setExportLoading(false);
    }
  };

  const handleEmailSuccess = (message) => {
    setSuccessMessage(message);
    // Refresh data after successful email to show updated request list
    fetchData();
    setTimeout(() => setSuccessMessage(''), 8000); // Show message longer since it includes deletion info
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout');
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/landing-bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-4 h-4 bg-indigo-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-40 right-32 w-6 h-6 bg-purple-400 rounded-full animate-bounce opacity-40"></div>
        <div className="absolute bottom-32 left-32 w-3 h-3 bg-pink-400 rounded-full animate-pulse opacity-50"></div>
        <div className="absolute bottom-20 right-20 w-5 h-5 bg-indigo-400 rounded-full animate-bounce opacity-30"></div>
      </div>
      
      {/* Header */}
      {/* Header */}
      <div className="bg-white/20 backdrop-blur-md shadow-2xl border-b border-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-extrabold text-white animate-slide-down flex items-center group hover:scale-105 transition-transform duration-300">
              <svg className="w-10 h-10 mr-3 text-indigo-300 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Coordinator Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="px-6 py-3 text-sm font-bold text-gray-800 bg-white/95 hover:bg-white rounded-2xl backdrop-blur-sm transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center group"
            >
              <svg className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* OD Requests Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 hover:text-indigo-600 transition-colors duration-300">OD Requests</h2>
            <div className="flex space-x-4">
              <button
                onClick={handleExport}
                disabled={exportLoading}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl disabled:opacity-50 transition-all duration-300 flex items-center group"
              >
                <svg className="w-5 h-5 mr-2 group-hover:-translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {exportLoading ? 'Exporting...' : 'Download Excel'}
              </button>
              <button
                onClick={() => setShowEmailModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center group"
              >
                <svg className="w-5 h-5 mr-2 group-hover:-translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send via Email
              </button>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl border border-white/40 overflow-hidden hover:shadow-3xl transition-all duration-500">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider hover:text-indigo-600 transition-colors duration-300">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hover:text-indigo-600 transition-colors duration-300">
                      Enrollment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hover:text-indigo-600 transition-colors duration-300">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hover:text-indigo-600 transition-colors duration-300">
                      Faculty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hover:text-indigo-600 transition-colors duration-300">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hover:text-indigo-600 transition-colors duration-300">
                      Time From
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hover:text-indigo-600 transition-colors duration-300">
                      Time To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hover:text-indigo-600 transition-colors duration-300">
                      Reason
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hover:text-indigo-600 transition-colors duration-300">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hover:text-indigo-600 transition-colors duration-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requests.map((request) => (
                    <tr key={request._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {request.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {request.enrollmentNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {request.subjectCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {request.facultyCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(request.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {request.timeFrom}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {request.timeTo}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                        {request.reason}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1.5 text-xs font-bold rounded-full shadow-sm ${
                          request.status === 'Approved' ? 'bg-green-100 text-green-800 border border-green-200 animate-pulse' :
                          request.status === 'Rejected' ? 'bg-red-100 text-red-800 border border-red-200 animate-pulse' :
                          'bg-yellow-100 text-yellow-800 border border-yellow-200 animate-pulse'
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {request.status === 'Pending' && (
                          <div className="space-x-2">
                            <button
                              onClick={() => handleRequestAction(request._id, 'Approved')}
                              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRequestAction(request._id, 'Rejected')}
                              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-2xl shadow-xl z-50 animate-fade-in hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3 text-green-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="font-bold">{successMessage}</div>
            </div>
          </div>
        )}

        {/* Email Export Modal */}
        <EmailExportModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          onSuccess={handleEmailSuccess}
        />
      </div>
    </div>
  );
};

export default CoordinatorDashboard; 