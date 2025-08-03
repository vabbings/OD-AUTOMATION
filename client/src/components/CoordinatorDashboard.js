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
    checkAuth();
    fetchData();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get('/api/check-auth');
      if (!response.data.isAuthenticated) {
        navigate('/coordinator/login');
      }
    } catch (error) {
      navigate('/coordinator/login');
    }
  };

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
      const response = await axios.put(`/api/requests/${requestId}`, { status });
      
      if (status === 'Rejected') {
        // Show success message for rejected and deleted requests
        setSuccessMessage('Request rejected and automatically deleted');
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
      setSuccessMessage('Excel file downloaded successfully. Processed requests have been deleted.');
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
        backgroundImage: `url('/landing-bg.jpg')`,
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
      <div className="bg-white/10 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-white">Coordinator Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* OD Requests Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">OD Requests</h2>
            <div className="flex space-x-3">
              <button
                onClick={handleExport}
                disabled={exportLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {exportLoading ? 'Exporting...' : 'Download Excel'}
              </button>
              <button
                onClick={() => setShowEmailModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Send via Email
              </button>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl border border-white/30 animate-float">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/20">
                <thead className="bg-white/20 backdrop-blur-sm">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Enrollment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Faculty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Time From
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Time To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/5 divide-y divide-white/10">
                  {requests.map((request) => (
                    <tr key={request._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {request.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                        {request.enrollmentNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                        {request.subjectCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                        {request.facultyCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                        {new Date(request.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                        {request.timeFrom}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                        {request.timeTo}
                      </td>
                      <td className="px-6 py-4 text-sm text-white/80 max-w-xs truncate">
                        {request.reason}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          request.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {request.status === 'Pending' && (
                          <div className="space-x-2">
                            <button
                              onClick={() => handleRequestAction(request._id, 'Approved')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRequestAction(request._id, 'Rejected')}
                              className="text-red-600 hover:text-red-900"
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
          <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50">
            {successMessage}
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