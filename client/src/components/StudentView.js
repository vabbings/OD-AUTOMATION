import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentView = () => {
  const [formData, setFormData] = useState({
    name: '',
    enrollmentNumber: '',
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

    // Validate all required fields
    const requiredFields = ['name', 'enrollmentNumber', 'subjectCode', 'facultyCode', 'date', 'timeFrom', 'timeTo', 'reason'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setError(`Missing required fields: ${missingFields.join(', ')}`);
      setSubmitting(false);
      return;
    }

    // Validate time restrictions
    if (!formData.timeFrom || !formData.timeTo) {
      setError('Please select both Time From and Time To');
      setSubmitting(false);
      return;
    }

    // Debug: Log the form data being sent
    console.log('Form data being sent:', formData);

    try {
      const response = await axios.post('/api/requests', formData);
      console.log('Success response:', response.data);
      setSuccess(true);
      setTimeout(() => {
        setFormData({
          name: '',
          enrollmentNumber: '',
          subjectCode: '',
          facultyCode: '',
          date: '',
          timeFrom: '',
          timeTo: '',
          reason: ''
        });
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      setError(error.response?.data?.error || 'Error submitting request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
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
            Form will reset in a few seconds...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900 animate-slide-down">Submit OD Request</h1>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 hover:scale-105"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2 animate-slide-down">
            OD Request Form
          </h2>
          <p className="text-gray-600 animate-slide-up">
            Fill in your details and select your preferred date and time
          </p>
        </div>

        {/* Request Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-red-600 text-sm">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                Reason *
              </label>
              <textarea
                id="reason"
                name="reason"
                required
                value={formData.reason}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows="4"
                placeholder="Enter the reason for the OD request"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="timeFrom" className="block text-sm font-medium text-gray-700 mb-2">
                  Time From *
                </label>
                <select
                  id="timeFrom"
                  name="timeFrom"
                  required
                  value={formData.timeFrom}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select Time</option>
                  <option value="09:15 AM">09:15 AM</option>
                  <option value="10:15 AM">10:15 AM</option>
                  <option value="11:15 AM">11:15 AM</option>
                  <option value="12:15 PM">12:15 PM</option>
                  <option value="01:15 PM">01:15 PM</option>
                  <option value="02:15 PM">02:15 PM</option>
                  <option value="03:15 PM">03:15 PM</option>
                  <option value="04:15 PM">04:15 PM</option>
                </select>
              </div>

              <div>
                <label htmlFor="timeTo" className="block text-sm font-medium text-gray-700 mb-2">
                  Time To *
                </label>
                <select
                  id="timeTo"
                  name="timeTo"
                  required
                  value={formData.timeTo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select Time</option>
                  <option value="10:10 AM">10:10 AM</option>
                  <option value="11:10 AM">11:10 AM</option>
                  <option value="12:10 PM">12:10 PM</option>
                  <option value="01:10 PM">01:10 PM</option>
                  <option value="02:10 PM">02:10 PM</option>
                  <option value="03:10 PM">03:10 PM</option>
                  <option value="04:10 PM">04:10 PM</option>
                  <option value="05:10 PM">05:10 PM</option>
                </select>
              </div>
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

export default StudentView; 