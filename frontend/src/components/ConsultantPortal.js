import React, { useState } from 'react';
import API from '../api';

function ConsultantPortal() {
  const [patientId, setPatientId] = useState('');
  const [consultantName, setConsultantName] = useState('Tariq Rafi');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await API.post('/consultant', { patientId: Number(patientId), consultantName });
      if (res.data.consultantId) {
        setMessage('Consultant selected!');
      } else {
        setMessage('Selection failed');
      }
    } catch (err) {
      setMessage('Selection failed');
    }
  };

  return (
    <div className="card mx-auto" style={{ maxWidth: 500 }}>
      <div className="card-body">
        <h3 className="card-title mb-4">Consultant Portal</h3>
        <form onSubmit={handleSubmit}>
          <input className="form-control mb-2" placeholder="Patient ID" value={patientId} onChange={e => setPatientId(e.target.value)} />
          <select className="form-control mb-2" value={consultantName} onChange={e => setConsultantName(e.target.value)}>
            <option>Tariq Rafi</option>
            <option>Mariam Mansoor</option>
            <option>Rauf Memon</option>
          </select>
          <button className="btn btn-success w-100" type="submit">Select Consultant</button>
        </form>
        {message && <div className="alert alert-info mt-2">{message}</div>}
      </div>
    </div>
  );
}

export default ConsultantPortal; 