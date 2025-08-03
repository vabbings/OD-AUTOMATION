import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState('');
  const navigate = useNavigate();

  const handleNavigation = async (path, type) => {
    setIsLoading(true);
    setLoadingType(type);
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    navigate(path);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center animate-fade-in">
          <h1 className="text-5xl font-black text-black mb-2 animate-slide-down hover:scale-110 transition-all duration-500 cursor-default">
            OD AUTOMATION SYSTEM
          </h1>
          <p className="text-gray-600 mb-8 animate-slide-up">
            Choose your role to continue
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => handleNavigation('/coordinator/login', 'coordinator')}
            disabled={isLoading}
            className={`w-full flex items-center justify-center px-6 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
              isLoading && loadingType === 'coordinator' ? 'animate-pulse' : ''
            }`}
          >
            {isLoading && loadingType === 'coordinator' ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            )}
            {isLoading && loadingType === 'coordinator' ? 'Loading...' : 'Coordinator'}
          </button>
          
          <button
            onClick={() => handleNavigation('/student', 'student')}
            disabled={isLoading}
            className={`w-full flex items-center justify-center px-6 py-4 border border-gray-300 text-lg font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
              isLoading && loadingType === 'student' ? 'animate-pulse' : ''
            }`}
          >
            {isLoading && loadingType === 'student' ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            )}
            {isLoading && loadingType === 'student' ? 'Loading...' : 'Student'}
          </button>
        </div>
        
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>Coordinator: Manage and approve requests</p>
          <p>Student: Submit OD requests with date and time</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 