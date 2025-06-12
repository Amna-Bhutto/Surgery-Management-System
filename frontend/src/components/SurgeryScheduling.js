import React, { useState } from 'react';
import API from '../api';

function SurgeryScheduling() {
  const [patientId, setPatientId] = useState('');
  const [doctor, setDoctor] = useState('');
  const [date, setDate] = useState('');
  const [consent, setConsent] = useState('Yes');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await API.post('/surgery', { patientId: Number(patientId), doctor, date, consent });
      if (res.data.surgeryId) {
        setMessage('Surgery scheduled!');
      } else {
        setMessage('Scheduling failed');
      }
    } catch (err) {
      setMessage('Scheduling failed');
    }
  };

  return (
    <div className="card mx-auto" style={{ maxWidth: 500 }}>
      <div className="card-body">
        <h3 className="card-title mb-4">Surgery Scheduling</h3>
        <form onSubmit={handleSubmit}>
          <input className="form-control mb-2" placeholder="Patient ID" value={patientId} onChange={e => setPatientId(e.target.value)} />
          <input className="form-control mb-2" placeholder="Doctor" value={doctor} onChange={e => setDoctor(e.target.value)} />
          <input className="form-control mb-2" placeholder="Date (YYYY-MM-DD HH:MM)" value={date} onChange={e => setDate(e.target.value)} />
          <select className="form-control mb-2" value={consent} onChange={e => setConsent(e.target.value)}>
            <option>Yes</option>
            <option>No</option>
          </select>
          <button className="btn btn-success w-100" type="submit">Schedule Surgery</button>
        </form>
        {message && <div className="alert alert-info mt-2">{message}</div>}
      </div>
    </div>
  );
}

export default SurgeryScheduling; 