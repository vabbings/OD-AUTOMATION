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
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative overflow-hidden"
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
        <div className="absolute bottom-20 right-20 w-5 h-5 bg-cyan-400 rounded-full animate-bounce opacity-30"></div>
      </div>
              <div className="max-w-md w-full space-y-8 p-8 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/30 animate-float">
        <div className="text-center animate-fade-in">
          <div className="mb-4">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg mb-4 animate-bounce">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 animate-slide-down hover:scale-110 transition-all duration-500 cursor-default">
            OD AUTOMATION SYSTEM
          </h1>
          <p className="text-gray-700 mb-8 animate-slide-up font-medium">
            Choose your role to continue
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => handleNavigation('/coordinator/login', 'coordinator')}
            disabled={isLoading}
            className={`w-full flex items-center justify-center px-6 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl ${
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
            className={`w-full flex items-center justify-center px-6 py-4 border border-white/30 text-lg font-medium rounded-xl text-gray-700 bg-white/90 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl backdrop-blur-sm ${
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
        
        <div className="text-center text-sm text-gray-600 mt-8 space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
            <p className="font-medium">Coordinator: Manage and approve requests</p>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <p className="font-medium">Student: Submit OD requests with date and time</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 