import React, { useState } from 'react';
import API from '../api';

function PatientPortal() {
  const [name, setName] = useState('');
  const [prescription, setPrescription] = useState('');
  const [status, setStatus] = useState('Ready for Surgery');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await API.post('/patient', { name, prescription, status });
      if (res.data.patientId) {
        setMessage('Patient info submitted!');
        setName(''); setPrescription('');
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
        <h3 className="card-title mb-4">Patient Portal</h3>
        <form onSubmit={handleSubmit}>
          <input className="form-control mb-2" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <input className="form-control mb-2" placeholder="Prescription" value={prescription} onChange={e => setPrescription(e.target.value)} />
          <select className="form-control mb-2" value={status} onChange={e => setStatus(e.target.value)}>
            <option>Ready for Surgery</option>
            <option>Consent Pending</option>
            <option>Payment Pending</option>
          </select>
          <button className="btn btn-success w-100" type="submit">Submit</button>
        </form>
        {message && <div className="alert alert-info mt-2">{message}</div>}
      </div>
    </div>
  );
}

export default PatientPortal; 