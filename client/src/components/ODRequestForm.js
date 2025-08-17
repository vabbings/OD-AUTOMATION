import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ODRequestForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    enrollmentNumber: '',
    email: '',
    subjectCode: '',
    facultyCode: '',
    date: '',
    timeFrom: '',
    timeTo: '',
    reason: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await axios.post('/api/requests', formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/student');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.error || 'Error submitting request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };



  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center">
          <div className="text-green-600 text-xl mb-4">
            ✓ OD Request Submitted Successfully!
          </div>
          <p className="text-gray-600 mb-4">
            Your request has been submitted and is pending approval.
          </p>
          <div className="text-sm text-gray-500">
            Redirecting to slots page...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Submit OD Request</h1>
            <button
              onClick={() => navigate('/student')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              Back to Slots
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Request Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Submit OD Request</h2>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-red-600 text-sm">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* DEBUG: Email field should be visible */}
            <div style={{border: '5px solid red', padding: '10px', backgroundColor: 'yellow'}}>
              <label htmlFor="email" className="block text-sm font-medium text-red-700 mb-2 font-bold">
                🔥 EMAIL ADDRESS (REQUIRED) 🔥
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border-4 border-red-500 rounded-lg focus:outline-none focus:ring-4 focus:ring-red-500 focus:border-transparent bg-red-100 text-black font-bold"
                placeholder="ENTER YOUR EMAIL ADDRESS HERE"
                style={{ borderColor: '#ef4444', fontSize: '16px' }}
              />
              <p className="text-red-600 text-sm mt-1">This field is required for email notifications!</p>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="enrollmentNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Enrollment Number *
              </label>
              <input
                type="text"
                id="enrollmentNumber"
                name="enrollmentNumber"
                required
                value={formData.enrollmentNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your enrollment number"
              />
            </div>

            <div>
              <label htmlFor="subjectCode" className="block text-sm font-medium text-gray-700 mb-2">
                Subject Code *
              </label>
              <input
                type="text"
                id="subjectCode"
                name="subjectCode"
                required
                value={formData.subjectCode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter subject code"
              />
            </div>

            <div>
              <label htmlFor="facultyCode" className="block text-sm font-medium text-gray-700 mb-2">
                Faculty Code *
              </label>
              <input
                type="text"
                id="facultyCode"
                name="facultyCode"
                required
                value={formData.facultyCode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter faculty code"
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                required
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="timeFrom" className="block text-sm font-medium text-gray-700 mb-2">
                  Time From *
                </label>
                <input
                  type="time"
                  id="timeFrom"
                  name="timeFrom"
                  required
                  value={formData.timeFrom}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="timeTo" className="block text-sm font-medium text-gray-700 mb-2">
                  Time To *
                </label>
                <input
                  type="time"
                  id="timeTo"
                  name="timeTo"
                  required
                  value={formData.timeTo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                Reason for OD *
              </label>
              <textarea
                id="reason"
                name="reason"
                required
                value={formData.reason}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Please provide a detailed reason for your OD request"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit OD Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ODRequestForm; 