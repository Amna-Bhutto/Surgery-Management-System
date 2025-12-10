import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

function Signup({ embedded = false, onSignedUp }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null); // null = unknown, true/false known
  const [usernameChecking, setUsernameChecking] = useState(false);
  const navigate = useNavigate();

  // Password requirement checks
  const lengthValid = password.length >= 8 && password.length <= 16;
  const uppercaseValid = /[A-Z]/.test(password);
  const symbolValid = /[^A-Za-z0-9]/.test(password);
  const matchValid = password.length > 0 && password === confirm;
  const isFormValid = lengthValid && uppercaseValid && symbolValid && matchValid && usernameAvailable === true;

  // Debounced username availability check
  useEffect(() => {
    setUsernameAvailable(null);
    if (!username) return;
    const timer = setTimeout(async () => {
      try {
        setUsernameChecking(true);
        const res = await API.get('/auth/username-available', { params: { username } });
        setUsernameAvailable(!!res.data.available);
      } catch (e) {
        setUsernameAvailable(null);
      } finally {
        setUsernameChecking(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [username]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (!isFormValid) {
      setError('Please meet the password requirements to continue.');
      return;
    }
    try {
      const res = await API.post('/auth/signup', { username, password });
      if (res.data.message) {
        if (typeof onSignedUp === 'function') {
          onSignedUp();
        } else {
          navigate('/login');
        }
      }
    } catch (err) {
      setError('We couldn’t create your account right now. Please try again.');
    }
  };

  if (embedded) {
    return (
      <>
        <form onSubmit={handleSignup}>
          <div className="mb-1">
            <input className="form-control" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div className="mb-3">
            {username ? (
              <small className={`d-block ${usernameAvailable === false ? 'text-danger' : usernameAvailable === true ? 'text-success' : 'text-muted'}`}>
                {usernameChecking && 'Checking username...'}
                {!usernameChecking && usernameAvailable === true && 'Username is available'}
                {!usernameChecking && usernameAvailable === false && 'Username is already taken'}
                {!usernameChecking && usernameAvailable === null && ' '}
              </small>
            ) : (
              <small className="d-block text-muted">Enter a username</small>
            )}
          </div>

          <div className="mb-3">
            <div className="input-group">
              <input
                className="form-control"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="mb-2">
            <div className="input-group">
              <input
                className="form-control"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowConfirm(v => !v)}
                aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirm ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="mb-3">
            <small className="d-block mb-1 fw-semibold">Password must include:</small>
            <ul className="list-unstyled mb-0 small">
              <li className={lengthValid ? 'text-success' : 'text-danger'}>
                {lengthValid ? '✓' : '✗'} 8 to 16 characters
              </li>
              <li className={uppercaseValid ? 'text-success' : 'text-danger'}>
                {uppercaseValid ? '✓' : '✗'} at least one capital letter
              </li>
              <li className={symbolValid ? 'text-success' : 'text-danger'}>
                {symbolValid ? '✓' : '✗'} at least one symbol (e.g. ! @ # $ %)
              </li>
              <li className={matchValid ? 'text-success' : 'text-danger'}>
                {matchValid ? '✓' : '✗'} confirm password matches
              </li>
            </ul>
          </div>

          <button className="btn btn-success w-100" type="submit" disabled={!isFormValid}>
            Sign Up
          </button>
        </form>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </>
    );
  }

  return (
    <div className="card mx-auto" style={{ maxWidth: 400 }}>
      <div className="card-body">
        <h3 className="card-title mb-4">Sign Up</h3>
        <form onSubmit={handleSignup}>
          <div className="mb-1">
            <input className="form-control" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div className="mb-3">
            {username ? (
              <small className={`d-block ${usernameAvailable === false ? 'text-danger' : usernameAvailable === true ? 'text-success' : 'text-muted'}`}>
                {usernameChecking && 'Checking username...'}
                {!usernameChecking && usernameAvailable === true && 'Username is available'}
                {!usernameChecking && usernameAvailable === false && 'Username is already taken'}
                {!usernameChecking && usernameAvailable === null && ' '}
              </small>
            ) : (
              <small className="d-block text-muted">Enter a username</small>
            )}
          </div>

          <div className="mb-3">
            <div className="input-group">
              <input
                className="form-control"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="mb-2">
            <div className="input-group">
              <input
                className="form-control"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowConfirm(v => !v)}
                aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirm ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="mb-3">
            <small className="d-block mb-1 fw-semibold">Password must include:</small>
            <ul className="list-unstyled mb-0 small">
              <li className={lengthValid ? 'text-success' : 'text-danger'}>
                {lengthValid ? '✓' : '✗'} 8 to 16 characters
              </li>
              <li className={uppercaseValid ? 'text-success' : 'text-danger'}>
                {uppercaseValid ? '✓' : '✗'} at least one capital letter
              </li>
              <li className={symbolValid ? 'text-success' : 'text-danger'}>
                {symbolValid ? '✓' : '✗'} at least one symbol (e.g. ! @ # $ %)
              </li>
              <li className={matchValid ? 'text-success' : 'text-danger'}>
                {matchValid ? '✓' : '✗'} confirm password matches
              </li>
            </ul>
          </div>

          <button className="btn btn-success w-100" type="submit" disabled={!isFormValid}>
            Sign Up
          </button>
        </form>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    </div>
  );
}

export default Signup; 