import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="container">
      <h2 className="mb-4">Dashboard</h2>
      <div className="row g-3">
        <div className="col-md-4">
          <Link to="/patient" className="btn btn-success w-100">Patient Portal</Link>
        </div>
        <div className="col-md-4">
          <Link to="/consultant" className="btn btn-success w-100">Consultant Portal</Link>
        </div>
        <div className="col-md-4">
          <Link to="/surgery" className="btn btn-success w-100">Surgery Scheduling</Link>
        </div>
        <div className="col-md-4">
          <Link to="/lab" className="btn btn-success w-100">Lab Technician Portal</Link>
        </div>
        <div className="col-md-4">
          <Link to="/pharmacy" className="btn btn-success w-100">Pharmacy Portal</Link>
        </div>
        <div className="col-md-4">
          <Link to="/feedback" className="btn btn-success w-100">Feedback</Link>
        </div>
        <div className="col-md-4">
          <Link to="/appointment" className="btn btn-success w-100">Appointment Form</Link>
        </div>
        <div className="col-md-4">
          <Link to="/table/patients" className="btn btn-outline-secondary w-100">View Patients</Link>
        </div>
        <div className="col-md-4">
          <Link to="/table/consultants" className="btn btn-outline-secondary w-100">View Consultants</Link>
        </div>
        <div className="col-md-4">
          <Link to="/table/surgeries" className="btn btn-outline-secondary w-100">View Surgeries</Link>
        </div>
        <div className="col-md-4">
          <Link to="/table/lab_results" className="btn btn-outline-secondary w-100">View Lab Results</Link>
        </div>
        <div className="col-md-4">
          <Link to="/table/pharmacy" className="btn btn-outline-secondary w-100">View Pharmacy</Link>
        </div>
        <div className="col-md-4">
          <Link to="/table/feedback" className="btn btn-outline-secondary w-100">View Feedback</Link>
        </div>
        <div className="col-md-4">
          <Link to="/table/appointments" className="btn btn-outline-secondary w-100">View Appointments</Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 