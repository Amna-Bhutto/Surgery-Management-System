import React, { useState, useEffect } from 'react';
import API from '../api';

function AppointmentForm() {
  const [consultants, setConsultants] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedConsultant, setSelectedConsultant] = useState('');
  const [availableDays, setAvailableDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchConsultants = async () => {
      const res = await API.get('/consultant/all');
      setConsultants(res.data);
    };
    const fetchPatients = async () => {
      const res = await API.get('/patient/all');
      setPatients(res.data);
    };
    fetchConsultants();
    fetchPatients();
  }, []);

  useEffect(() => {
    if (selectedConsultant) {
      const consultant = consultants.find(c => c.id === parseInt(selectedConsultant));
      if (consultant && consultant.available_days) {
        setAvailableDays(consultant.available_days);
      } else {
        setAvailableDays([]);
      }
    } else {
      setAvailableDays([]);
    }
  }, [selectedConsultant, consultants]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await API.post('/appointment', { consultantId: selectedConsultant, patientId: selectedPatient, appointmentDay: selectedDay, appointmentTime, reason });
      if (res.data.appointmentId) {
        setMessage('Appointment created!');
      } else {
        setMessage('Creation failed');
      }
    } catch (err) {
      setMessage('Creation failed');
    }
  };

  return (
    <div className="card mx-auto" style={{ maxWidth: 500 }}>
      <div className="card-body">
        <h3 className="card-title mb-4">Create Appointment</h3>
        <form onSubmit={handleSubmit}>
          <select className="form-control mb-2" value={selectedConsultant} onChange={e => setSelectedConsultant(e.target.value)}>
            <option value="">Select Consultant</option>
            {consultants.map(consultant => (
              <option key={consultant.id} value={consultant.id}>{consultant.name}</option>
            ))}
          </select>
          <select className="form-control mb-2" value={selectedDay} onChange={e => setSelectedDay(e.target.value)}>
            <option value="">Select Day</option>
            {availableDays.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
          <select className="form-control mb-2" value={selectedPatient} onChange={e => setSelectedPatient(e.target.value)}>
            <option value="">Select Patient</option>
            {patients.map(patient => (
              <option key={patient.id} value={patient.id}>{patient.name}</option>
            ))}
          </select>
          <input className="form-control mb-2" type="time" placeholder="Appointment Time" value={appointmentTime} onChange={e => setAppointmentTime(e.target.value)} />
          <textarea className="form-control mb-2" placeholder="Reason for Appointment" value={reason} onChange={e => setReason(e.target.value)} />
          <button className="btn btn-success w-100" type="submit">Create Appointment</button>
        </form>
        {message && <div className="alert alert-info mt-2">{message}</div>}
      </div>
    </div>
  );
}

export default AppointmentForm; 