import React, { useState } from 'react';
import API from '../api';

function PharmacyPortal() {
  const [patientId, setPatientId] = useState('');
  const [medicineName, setMedicineName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await API.post('/pharmacy', { patientId: Number(patientId), medicineName });
      if (res.data.pharmacyId) {
        setMessage('Medicine provided!');
      } else {
        setMessage('Submission failed');
      }
    } catch (err) {
      setMessage('Submission failed');
    }
  };

  return (
    <div className="card mx-auto" style={{ maxWidth: 500 }}>
      <div className="card-body">
        <h3 className="card-title mb-4">Pharmacy Portal</h3>
        <form onSubmit={handleSubmit}>
          <input className="form-control mb-2" placeholder="Patient ID" value={patientId} onChange={e => setPatientId(e.target.value)} />
          <input className="form-control mb-2" placeholder="Medicine Name" value={medicineName} onChange={e => setMedicineName(e.target.value)} />
          <button className="btn btn-success w-100" type="submit">Provide Medicine</button>
        </form>
        {message && <div className="alert alert-info mt-2">{message}</div>}
      </div>
    </div>
  );
}

export default PharmacyPortal; 