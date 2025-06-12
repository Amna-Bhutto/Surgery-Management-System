import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await API.post('/auth/login', { username, password });
      if (res.data.message) {
        localStorage.setItem('user', JSON.stringify(res.data));
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="card mx-auto" style={{ maxWidth: 400 }}>
      <div className="card-body">
        <h3 className="card-title mb-4">Login</h3>
        <form onSubmit={handleLogin}>
          <input className="form-control mb-2" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          <input className="form-control mb-2" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <button className="btn btn-success w-100" type="submit">Login</button>
        </form>
        {error && <div className="alert alert-danger mt-2">{error}</div>}
      </div>
    </div>
  );
}

export default Login; 