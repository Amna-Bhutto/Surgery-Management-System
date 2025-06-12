import React, { useState } from 'react';
import API from '../api';

function Feedback() {
  const [patientId, setPatientId] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await API.post('/feedback', { patientId: Number(patientId), feedbackText });
      if (res.data.feedbackId) {
        setMessage('Feedback submitted!');
        setFeedbackText('');
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
        <h3 className="card-title mb-4">Feedback</h3>
        <form onSubmit={handleSubmit}>
          <input className="form-control mb-2" placeholder="Patient ID" value={patientId} onChange={e => setPatientId(e.target.value)} />
          <textarea className="form-control mb-2" placeholder="Feedback" value={feedbackText} onChange={e => setFeedbackText(e.target.value)} />
          <button className="btn btn-success w-100" type="submit">Submit Feedback</button>
        </form>
        {message && <div className="alert alert-info mt-2">{message}</div>}
      </div>
    </div>
  );
}

export default Feedback; 