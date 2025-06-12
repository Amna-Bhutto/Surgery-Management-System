import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    try {
      const res = await API.post('/auth/signup', { username, password });
      if (res.data.message) {
        navigate('/login');
      }
    } catch (err) {
      setError('Signup failed');
    }
  };

  return (
    <div className="card mx-auto" style={{ maxWidth: 400 }}>
      <div className="card-body">
        <h3 className="card-title mb-4">Sign Up</h3>
        <form onSubmit={handleSignup}>
          <input className="form-control mb-2" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          <input className="form-control mb-2" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <input className="form-control mb-2" type="password" placeholder="Confirm Password" value={confirm} onChange={e => setConfirm(e.target.value)} />
          <button className="btn btn-success w-100" type="submit">Sign Up</button>
        </form>
        {error && <div className="alert alert-danger mt-2">{error}</div>}
      </div>
    </div>
  );
}

export default Signup; 