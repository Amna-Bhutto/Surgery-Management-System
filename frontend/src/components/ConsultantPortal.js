import React, { useState } from 'react';
import API from '../api';

function ConsultantPortal() {
  const [consultantName, setConsultantName] = useState('');
  const [arrivingTime, setArrivingTime] = useState('');
  const [leavingTime, setLeavingTime] = useState('');
  const [availableDays, setAvailableDays] = useState([]);
  const [message, setMessage] = useState('');

  const handleDayChange = (day) => {
    setAvailableDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await API.post('/consultant', { consultantName, arrivingTime, leavingTime, availableDays });
      if (res.data.consultantId) {
        setMessage('Consultant added!');
      } else {
        setMessage('Addition failed');
      }
    } catch (err) {
      setMessage('Addition failed');
    }
  };

  return (
    <div className="card mx-auto" style={{ maxWidth: 500 }}>
      <div className="card-body">
        <h3 className="card-title mb-4">Consultant Portal</h3>
        <form onSubmit={handleSubmit}>
          <input className="form-control mb-2" placeholder="Consultant Name" value={consultantName} onChange={e => setConsultantName(e.target.value)} />
          <input className="form-control mb-2" type="time" placeholder="Arriving Time" value={arrivingTime} onChange={e => setArrivingTime(e.target.value)} />
          <input className="form-control mb-2" type="time" placeholder="Leaving Time" value={leavingTime} onChange={e => setLeavingTime(e.target.value)} />
          <div className="mb-2">
            <label>Available Days:</label>
            <ul className="list-group">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                <li key={day} className="list-group-item">
                  <input type="checkbox" checked={availableDays.includes(day)} onChange={() => handleDayChange(day)} />
                  <label className="ml-2">{day}</label>
                </li>
              ))}
            </ul>
          </div>
          <button className="btn btn-success w-100" type="submit">Add Consultant</button>
        </form>
        {message && <div className="alert alert-info mt-2">{message}</div>}
      </div>
    </div>
  );
}

export default ConsultantPortal; 