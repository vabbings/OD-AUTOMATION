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
        <div className="absolute top-20 left-20 w-4 h-4 bg-emerald-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-40 right-32 w-6 h-6 bg-teal-400 rounded-full animate-bounce opacity-40"></div>
        <div className="absolute bottom-32 left-32 w-3 h-3 bg-cyan-400 rounded-full animate-pulse opacity-50"></div>
        <div className="absolute bottom-20 right-20 w-5 h-5 bg-emerald-400 rounded-full animate-bounce opacity-30"></div>
      </div>
      
      {/* Header */}
      <div className="bg-white/20 backdrop-blur-md shadow-2xl border-b border-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-extrabold text-white animate-slide-down flex items-center group hover:scale-105 transition-transform duration-300">
              <svg className="w-10 h-10 mr-3 text-emerald-300 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Submit OD Request
            </h1>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 text-sm font-bold text-gray-800 bg-white/95 hover:bg-white rounded-2xl backdrop-blur-sm transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center group"
            >
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-10 animate-fade-in">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3 animate-slide-down hover:text-indigo-600 transition-colors duration-300">
            OD Request Form
          </h2>
          <p className="text-white animate-slide-up font-medium text-lg">
            Fill in your details with proper validation rules
          </p>
        </div>

        {/* Request Form */}
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/40 hover:shadow-3xl transition-all duration-500">
          {error && (
            <div className="mb-6 p-5 bg-red-50 border-l-4 border-red-500 rounded-xl shadow-sm">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-red-700 font-medium">{error}</div>
              </div>
            </div>
          )}

                    <form onSubmit={handleSubmit} className="space-y-7">
            <div className="group">
              <label htmlFor="date" className="block text-sm font-bold text-gray-900 mb-2.5 group-hover:text-indigo-600 transition-colors duration-300">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:border-transparent shadow-sm transition-all duration-300 group-hover:shadow-md"
                placeholder="Select date (current date allowed)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group">
                <label htmlFor="timeFrom" className="block text-sm font-bold text-gray-900 mb-2.5 group-hover:text-indigo-600 transition-colors duration-300">
                  Time From *
                </label>
                <select
                  id="timeFrom"
                  name="timeFrom"
                  required
                  value={formData.timeFrom}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:border-transparent shadow-sm transition-all duration-300 group-hover:shadow-md"
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

              <div className="group">
                <label htmlFor="timeTo" className="block text-sm font-bold text-gray-900 mb-2.5 group-hover:text-indigo-600 transition-colors duration-300">
                  Time To *
                </label>
                <select
                  id="timeTo"
                  name="timeTo"
                  required
                  value={formData.timeTo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:border-transparent shadow-sm transition-all duration-300 group-hover:shadow-md"
                  disabled={!formData.timeFrom}
                >
                  <option value="">{formData.timeFrom ? 'Select Time' : 'Select From Time First'}</option>
                  {getAvailableToTimes(formData.timeFrom).map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="group">
              <label htmlFor="name" className="block text-sm font-bold text-gray-900 mb-2.5 group-hover:text-indigo-600 transition-colors duration-300">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:border-transparent shadow-sm transition-all duration-300 group-hover:shadow-md"
                placeholder="Enter your full name (auto-capitalized)"
              />
            </div>

            <div className="group">
              <label htmlFor="enrollmentNumber" className="block text-sm font-bold text-gray-900 mb-2.5 group-hover:text-indigo-600 transition-colors duration-300">
                Enrollment Number *
              </label>
              <input
                type="text"
                id="enrollmentNumber"
                name="enrollmentNumber"
                required
                value={formData.enrollmentNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:border-transparent shadow-sm transition-all duration-300 group-hover:shadow-md"
                placeholder="Enter your enrollment number (starts with A)"
              />
            </div>

            <div className="group">
              <label htmlFor="subjectCode" className="block text-sm font-bold text-gray-900 mb-2.5 group-hover:text-indigo-600 transition-colors duration-300">
                Subject Code *
                {gapCount > 1 && (
                  <span className="text-sm font-bold text-blue-600 ml-2 bg-blue-50 px-2 py-1 rounded-lg animate-pulse">
                    {gapCount} codes needed
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:border-transparent shadow-sm transition-all duration-300 group-hover:shadow-md"
                placeholder={gapCount > 1 ? `Enter ${gapCount} subject codes separated by spaces (e.g., CS101 CS102)` : "Enter subject code (e.g., ABC123)"}
              />
            </div>

            <div className="group">
              <label htmlFor="facultyCode" className="block text-sm font-bold text-gray-900 mb-2.5 group-hover:text-indigo-600 transition-colors duration-300">
                Faculty Code *
                {gapCount > 1 && (
                  <span className="text-sm font-bold text-blue-600 ml-2 bg-blue-50 px-2 py-1 rounded-lg animate-pulse">
                    {gapCount} codes needed
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:border-transparent shadow-sm transition-all duration-300 group-hover:shadow-md"
                placeholder={gapCount > 1 ? `Enter ${gapCount} faculty codes separated by spaces (e.g., FAC001 FAC002)` : "Enter faculty code"}
              />
            </div>

            <div className="group">
              <label htmlFor="reason" className="block text-sm font-bold text-gray-900 mb-2.5 group-hover:text-indigo-600 transition-colors duration-300">
                Reason *
              </label>
              <textarea
                id="reason"
                name="reason"
                required
                value={formData.reason}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:border-transparent shadow-sm transition-all duration-300 group-hover:shadow-md"
                rows="4"
                placeholder="Enter the reason for the OD request (auto-capitalized)"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center py-4 px-6 border border-transparent rounded-2xl shadow-xl text-lg font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl"
              >
                {submitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting Request...
                  </div>
                ) : 'Submit OD Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentView; 