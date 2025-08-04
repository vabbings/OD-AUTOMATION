import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ODRequestForm = () => {
  const [slot, setSlot] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    enrollmentNumber: '',
    subjectCode: '',
    facultyCode: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { slotId } = useParams();

  useEffect(() => {
    fetchSlot();
  }, [slotId]);

  const fetchSlot = async () => {
    try {
      const response = await axios.get('/api/slots');
      const foundSlot = response.data.find(s => s._id === slotId);
      if (foundSlot) {
        setSlot(foundSlot);
      } else {
        setError('Slot not found');
      }
    } catch (error) {
      setError('Error fetching slot details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await axios.post('/api/requests', {
        ...formData,
        slotId
      });
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error && !slot) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{error}</div>
          <button
            onClick={() => navigate('/student')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Back to Slots
          </button>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gray-50">
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
        {/* Slot Details */}
        {slot && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Selected Slot</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="font-medium text-gray-700 w-24">Title:</span>
                <span className="text-gray-900">{slot.title}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-gray-700 w-24">Date:</span>
                <span className="text-gray-900">{new Date(slot.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-gray-700 w-24">Time:</span>
                <span className="text-gray-900">{slot.time}</span>
              </div>
            </div>
          </div>
        )}

        {/* Request Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Student Information</h2>
          
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