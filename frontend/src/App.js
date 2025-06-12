import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import PatientPortal from './components/PatientPortal';
import ConsultantPortal from './components/ConsultantPortal';
import SurgeryScheduling from './components/SurgeryScheduling';
import LabTechnicianPortal from './components/LabTechnicianPortal';
import PharmacyPortal from './components/PharmacyPortal';
import Feedback from './components/Feedback';
import TableView from './components/TableView';
import Navbar from './components/Navbar';
import AppointmentForm from './components/AppointmentForm';

function PrivateRoute({ children }) {
  const isAuth = !!localStorage.getItem('user');
  return isAuth ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/patient" element={<PrivateRoute><PatientPortal /></PrivateRoute>} />
          <Route path="/consultant" element={<PrivateRoute><ConsultantPortal /></PrivateRoute>} />
          <Route path="/surgery" element={<PrivateRoute><SurgeryScheduling /></PrivateRoute>} />
          <Route path="/lab" element={<PrivateRoute><LabTechnicianPortal /></PrivateRoute>} />
          <Route path="/appointment" element={<PrivateRoute><AppointmentForm /></PrivateRoute>} />
          <Route path="/pharmacy" element={<PrivateRoute><PharmacyPortal /></PrivateRoute>} />
          <Route path="/feedback" element={<PrivateRoute><Feedback /></PrivateRoute>} />
          <Route path="/table/:entity" element={<PrivateRoute><TableView /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 