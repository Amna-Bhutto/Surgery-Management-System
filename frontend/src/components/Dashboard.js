import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const dashboardStyle = {
    backgroundImage: 'url(/background_picture.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    minHeight: 'calc(100vh - 80px)', // Full height minus navigation
    width: '100vw', // Full viewport width
    marginLeft: 'calc(-50vw + 50%)', // Center and extend to full width
    position: 'relative'
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Darker overlay only on dashboard
    zIndex: 1
  };

  const contentStyle = {
    position: 'relative',
    zIndex: 2,
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto' // Center the content
  };

  return (
    <div style={dashboardStyle}>
      <div style={overlayStyle}></div>
      <div style={contentStyle}>
        <h2 className="mb-4 text-center" style={{color: '#ffffff', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
          🏥 Surgery Management System Dashboard
        </h2>
        
        <div className="row g-3 mb-4">
          <div className="col-12">
            <h4 className="text-center mb-3" style={{color: '#f8f9fa', textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>📋 Main Portals</h4>
          </div>
          <div className="col-md-4">
            <Link to="/patient" className="btn btn-success w-100 py-3" style={{boxShadow: '0 4px 8px rgba(0,0,0,0.3)', opacity: '0.95'}}>
              👤 Patient Portal
            </Link>
          </div>
          <div className="col-md-4">
            <Link to="/consultant" className="btn btn-success w-100 py-3" style={{boxShadow: '0 4px 8px rgba(0,0,0,0.3)', opacity: '0.95'}}>
              👨‍⚕️ Consultant Portal
            </Link>
          </div>
          <div className="col-md-4">
            <Link to="/surgery" className="btn btn-success w-100 py-3" style={{boxShadow: '0 4px 8px rgba(0,0,0,0.3)', opacity: '0.95'}}>
              🏥 Surgery Scheduling
            </Link>
          </div>
          <div className="col-md-4">
            <Link to="/lab" className="btn btn-success w-100 py-3" style={{boxShadow: '0 4px 8px rgba(0,0,0,0.3)', opacity: '0.95'}}>
              🔬 Lab Technician Portal
            </Link>
          </div>
          <div className="col-md-4">
            <Link to="/pharmacy" className="btn btn-success w-100 py-3" style={{boxShadow: '0 4px 8px rgba(0,0,0,0.3)', opacity: '0.95'}}>
              💊 Pharmacy Portal
            </Link>
          </div>
          <div className="col-md-4">
            <Link to="/medicine" className="btn btn-success w-100 py-3" style={{boxShadow: '0 4px 8px rgba(0,0,0,0.3)', opacity: '0.95'}}>
              💉 Medicine Management
            </Link>
          </div>
          <div className="col-md-4">
            <Link to="/feedback" className="btn btn-success w-100 py-3" style={{boxShadow: '0 4px 8px rgba(0,0,0,0.3)', opacity: '0.95'}}>
              📝 Feedback
            </Link>
          </div>
          <div className="col-md-4">
            <Link to="/appointment" className="btn btn-success w-100 py-3" style={{boxShadow: '0 4px 8px rgba(0,0,0,0.3)', opacity: '0.95'}}>
              📅 Appointment Form
            </Link>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-12">
            <h4 className="text-center mb-3" style={{color: '#f8f9fa', textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>📊 Data Views</h4>
          </div>
          <div className="col-md-4">
            <Link to="/table/patients" className="btn btn-outline-light w-100 py-2" style={{backgroundColor: 'rgba(255,255,255,0.2)', boxShadow: '0 2px 4px rgba(0,0,0,0.3)', border: '2px solid rgba(255,255,255,0.5)'}}>
              👥 View Patients
            </Link>
          </div>
          <div className="col-md-4">
            <Link to="/table/consultants" className="btn btn-outline-light w-100 py-2" style={{backgroundColor: 'rgba(255,255,255,0.2)', boxShadow: '0 2px 4px rgba(0,0,0,0.3)', border: '2px solid rgba(255,255,255,0.5)'}}>
              👨‍⚕️ View Consultants
            </Link>
          </div>
          <div className="col-md-4">
            <Link to="/table/surgeries" className="btn btn-outline-light w-100 py-2" style={{backgroundColor: 'rgba(255,255,255,0.2)', boxShadow: '0 2px 4px rgba(0,0,0,0.3)', border: '2px solid rgba(255,255,255,0.5)'}}>
              🏥 View Surgeries
            </Link>
          </div>
          <div className="col-md-4">
            <Link to="/table/lab_results" className="btn btn-outline-light w-100 py-2" style={{backgroundColor: 'rgba(255,255,255,0.2)', boxShadow: '0 2px 4px rgba(0,0,0,0.3)', border: '2px solid rgba(255,255,255,0.5)'}}>
              🔬 View Lab Results
            </Link>
          </div>
          <div className="col-md-4">
            <Link to="/table/pharmacy" className="btn btn-outline-light w-100 py-2" style={{backgroundColor: 'rgba(255,255,255,0.2)', boxShadow: '0 2px 4px rgba(0,0,0,0.3)', border: '2px solid rgba(255,255,255,0.5)'}}>
              💊 View Pharmacy
            </Link>
          </div>
          <div className="col-md-4">
            <Link to="/table/feedback" className="btn btn-outline-light w-100 py-2" style={{backgroundColor: 'rgba(255,255,255,0.2)', boxShadow: '0 2px 4px rgba(0,0,0,0.3)', border: '2px solid rgba(255,255,255,0.5)'}}>
              📝 View Feedback
            </Link>
          </div>
          <div className="col-md-4">
            <Link to="/table/appointments" className="btn btn-outline-light w-100 py-2" style={{backgroundColor: 'rgba(255,255,255,0.2)', boxShadow: '0 2px 4px rgba(0,0,0,0.3)', border: '2px solid rgba(255,255,255,0.5)'}}>
              📅 View Appointments
            </Link>
          </div>
          <div className="col-md-4">
            <Link to="/table/medicines" className="btn btn-outline-light w-100 py-2" style={{backgroundColor: 'rgba(255,255,255,0.2)', boxShadow: '0 2px 4px rgba(0,0,0,0.3)', border: '2px solid rgba(255,255,255,0.5)'}}>
              💉 View Medicines
            </Link>
          </div>
          <div className="col-md-4">
            <Link to="/table/billing" className="btn btn-outline-light w-100 py-2" style={{backgroundColor: 'rgba(255,255,255,0.2)', boxShadow: '0 2px 4px rgba(0,0,0,0.3)', border: '2px solid rgba(255,255,255,0.5)'}}>
              💰 View Bills
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 