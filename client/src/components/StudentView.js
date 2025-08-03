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
  const [gapCount, setGapCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Validation functions
  const validateName = (name) => {
    return /^[A-Za-z\s]+$/.test(name);
  };

  const validateEnrollmentNumber = (enrollmentNumber) => {
    return /^A\d+$/.test(enrollmentNumber);
  };

  const validateSubjectCode = (subjectCode) => {
    return /^[A-Za-z]+\d+$/.test(subjectCode);
  };

  const validateDate = (date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    return selectedDate <= today; // Allows current date and past dates
  };

  const validateTimeRange = (timeFrom, timeTo) => {
    const fromTime = new Date(`2000-01-01 ${timeFrom}`);
    const toTime = new Date(`2000-01-01 ${timeTo}`);
    return toTime > fromTime;
  };

  // Define time gaps
  const timeGaps = [
    { from: '09:15 AM', to: '10:10 AM' },
    { from: '10:15 AM', to: '11:10 AM' },
    { from: '11:15 AM', to: '12:10 PM' },
    { from: '12:15 PM', to: '01:10 PM' },
    { from: '01:15 PM', to: '02:10 PM' },
    { from: '02:15 PM', to: '03:10 PM' },
    { from: '03:15 PM', to: '04:10 PM' },
    { from: '04:15 PM', to: '05:10 PM' }
  ];

  // Get available "To" time options based on selected "From" time
  const getAvailableToTimes = (timeFrom) => {
    if (!timeFrom) return [];
    
    const allTimes = [
      '10:10 AM', '11:10 AM', '12:10 PM', '01:10 PM', 
      '02:10 PM', '03:10 PM', '04:10 PM', '05:10 PM'
    ];
    
    const fromTime = new Date(`2000-01-01 ${timeFrom}`);
    
    return allTimes.filter(time => {
      const toTime = new Date(`2000-01-01 ${time}`);
      return toTime > fromTime;
    });
  };

  // Calculate how many time gaps are covered by the selected time range
  const getTimeGapCount = (timeFrom, timeTo) => {
    if (!timeFrom || !timeTo) return 0;
    
    const fromTime = new Date(`2000-01-01 ${timeFrom}`);
    const toTime = new Date(`2000-01-01 ${timeTo}`);
    
    let gapCount = 0;
    timeGaps.forEach(gap => {
      const gapFrom = new Date(`2000-01-01 ${gap.from}`);
      const gapTo = new Date(`2000-01-01 ${gap.to}`);
      
      // Check if this gap overlaps with the selected time range
      if (gapFrom < toTime && gapTo > fromTime) {
        gapCount++;
      }
    });
    
    return gapCount;
  };

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

    // Validate name (only alphabets)
    if (!validateName(formData.name)) {
      setError('Name should contain only alphabets');
      setSubmitting(false);
      return;
    }

    // Validate enrollment number (A followed by numbers)
    if (!validateEnrollmentNumber(formData.enrollmentNumber)) {
      setError('Enrollment number should start with "A" followed by numbers');
      setSubmitting(false);
      return;
    }

    // Check time gap count and validate multiple entries
    const gapCount = getTimeGapCount(formData.timeFrom, formData.timeTo);
    
    if (gapCount > 1) {
      // For multiple gaps, validate that subject codes and faculty codes are space-separated
      const subjectCodes = formData.subjectCode.trim().split(/\s+/);
      const facultyCodes = formData.facultyCode.trim().split(/\s+/);
      
      if (subjectCodes.length !== gapCount) {
        setError(`You selected ${gapCount} time gaps. Please enter ${gapCount} subject codes separated by spaces (e.g., "CS101 CS102")`);
        setSubmitting(false);
        return;
      }
      
      if (facultyCodes.length !== gapCount) {
        setError(`You selected ${gapCount} time gaps. Please enter ${gapCount} faculty codes separated by spaces (e.g., "FAC001 FAC002")`);
        setSubmitting(false);
        return;
      }
      
      // Validate each subject code
      for (let i = 0; i < subjectCodes.length; i++) {
        if (!validateSubjectCode(subjectCodes[i])) {
          setError(`Subject code ${i + 1} should contain alphabets followed by numbers (e.g., ABC123)`);
          setSubmitting(false);
          return;
        }
      }
    } else {
      // Single gap validation
      if (!validateSubjectCode(formData.subjectCode)) {
        setError('Subject code should contain alphabets followed by numbers (e.g., ABC123)');
        setSubmitting(false);
        return;
      }
    }

    // Validate date (no future dates)
    if (!validateDate(formData.date)) {
      setError('Cannot select future dates');
      setSubmitting(false);
      return;
    }

    // Validate time range (to time should be after from time)
    if (!validateTimeRange(formData.timeFrom, formData.timeTo)) {
      setError('To time should be after From time');
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
    
    let processedValue = value;
    
    // Auto-capitalize based on field type
    switch (name) {
      case 'name':
        // Capitalize first letter of each word
        processedValue = value.replace(/\b\w/g, l => l.toUpperCase());
        break;
      case 'enrollmentNumber':
        // Ensure 'A' is capitalized and rest are numbers
        if (value.length > 0 && !value.startsWith('A')) {
          processedValue = 'A' + value.substring(1).replace(/[^0-9]/g, '');
        } else {
          processedValue = value.toUpperCase();
        }
        break;
      case 'subjectCode':
        // Capitalize alphabets, keep numbers as is
        processedValue = value.replace(/[A-Za-z]/g, l => l.toUpperCase());
        break;
      case 'reason':
        // Capitalize first letter of each sentence
        processedValue = value.replace(/(^\w|\.\s+\w)/g, l => l.toUpperCase());
        break;
      default:
        processedValue = value;
    }
    
    // Clear "To" time when "From" time changes
    if (name === 'timeFrom') {
      setFormData({
        ...formData,
        [name]: processedValue,
        timeTo: '' // Clear the "To" time when "From" time changes
      });
      setGapCount(0); // Reset gap count
    } else if (name === 'timeTo') {
      setFormData({
        ...formData,
        [name]: processedValue
      });
      // Calculate gap count when both times are selected
      if (formData.timeFrom && processedValue) {
        const count = getTimeGapCount(formData.timeFrom, processedValue);
        setGapCount(count);
      }
    } else {
      setFormData({
        ...formData,
        [name]: processedValue
      });
    }
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-white animate-slide-down">Submit OD Request</h1>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-sm font-medium text-white bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <h2 className="text-2xl font-semibold text-white mb-2 animate-slide-down">
            OD Request Form
          </h2>
          <p className="text-white/80 animate-slide-up">
            Fill in your details with proper validation rules
          </p>
        </div>

        {/* Request Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-6 border border-white/20">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-red-600 text-sm">{error}</div>
            </div>
          )}

                    <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-white mb-2">
                Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                required
                value={formData.date}
                onChange={handleInputChange}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-white/20 text-white placeholder-white/60"
                placeholder="Select date (current date allowed)"
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
                  disabled={!formData.timeFrom}
                >
                  <option value="">{formData.timeFrom ? 'Select Time' : 'Select From Time First'}</option>
                  {getAvailableToTimes(formData.timeFrom).map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
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
                placeholder="Enter your full name (auto-capitalized)"
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
                placeholder="Enter your enrollment number (starts with A)"
              />
            </div>

            <div>
              <label htmlFor="subjectCode" className="block text-sm font-medium text-gray-700 mb-2">
                Subject Code *
                {gapCount > 1 && (
                  <span className="text-sm text-blue-600 ml-2">
                    ({gapCount} codes needed)
                  </span>
                )}
              </label>
              <input
                type="text"
                id="subjectCode"
                name="subjectCode"
                required
                value={formData.subjectCode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder={gapCount > 1 ? `Enter ${gapCount} subject codes separated by spaces (e.g., CS101 CS102)` : "Enter subject code (e.g., ABC123)"}
              />
            </div>

            <div>
              <label htmlFor="facultyCode" className="block text-sm font-medium text-gray-700 mb-2">
                Faculty Code *
                {gapCount > 1 && (
                  <span className="text-sm text-blue-600 ml-2">
                    ({gapCount} codes needed)
                  </span>
                )}
              </label>
              <input
                type="text"
                id="facultyCode"
                name="facultyCode"
                required
                value={formData.facultyCode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder={gapCount > 1 ? `Enter ${gapCount} faculty codes separated by spaces (e.g., FAC001 FAC002)` : "Enter faculty code"}
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
                placeholder="Enter the reason for the OD request (auto-capitalized)"
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

export default StudentView; 