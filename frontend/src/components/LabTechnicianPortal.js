import React, { useState } from 'react';
import API from '../api';

function LabTechnicianPortal() {
  const [surgeryId, setSurgeryId] = useState('');
  const [sampleName, setSampleName] = useState('');
  const [result, setResult] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await API.post('/lab', { surgeryId: Number(surgeryId), sampleName, result });
      if (res.data.labResultId) {
        setMessage('Lab result submitted!');
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
        <h3 className="card-title mb-4">Lab Technician Portal</h3>
        <form onSubmit={handleSubmit}>
          <input className="form-control mb-2" placeholder="Surgery ID" value={surgeryId} onChange={e => setSurgeryId(e.target.value)} />
          <input className="form-control mb-2" placeholder="Sample Name" value={sampleName} onChange={e => setSampleName(e.target.value)} />
          <input className="form-control mb-2" placeholder="Result" value={result} onChange={e => setResult(e.target.value)} />
          <button className="btn btn-success w-100" type="submit">Submit Lab Result</button>
        </form>
        {message && <div className="alert alert-info mt-2">{message}</div>}
      </div>
    </div>
  );
}

export default LabTechnicianPortal; 