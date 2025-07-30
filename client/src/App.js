import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import CoordinatorLogin from './components/CoordinatorLogin';
import CoordinatorDashboard from './components/CoordinatorDashboard';
import StudentView from './components/StudentView';
import ODRequestForm from './components/ODRequestForm';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/coordinator/login" element={<CoordinatorLogin />} />
          <Route path="/coordinator/dashboard" element={<CoordinatorDashboard />} />
          <Route path="/student" element={<StudentView />} />
          <Route path="/student/request/:slotId" element={<ODRequestForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 