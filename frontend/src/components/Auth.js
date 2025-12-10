import React, { useEffect, useState } from 'react';
import Login from './Login';
import Signup from './Signup';

function Auth({ defaultTab = 'login' }) {
  const [activeTab, setActiveTab] = useState(defaultTab === 'signup' ? 'signup' : 'login');
  const [flash, setFlash] = useState(null); // { type: 'success' | 'danger' | 'info', text: string }

  useEffect(() => {
    setActiveTab(defaultTab === 'signup' ? 'signup' : 'login');
  }, [defaultTab]);

  return (
    <div className="mx-auto" style={{ maxWidth: 1100 }}>
      <div className="row g-0 align-items-stretch" style={{ minHeight: 560 }}>
        <div className="col-md-6 d-none d-md-block">
          <div className="h-100 w-100 position-relative" style={{ minHeight: 560, borderRadius: '0.75rem 0 0 0.75rem', overflow: 'hidden' }}>
            <img
              src="/background_picture.png"
              alt="Surgery Management"
              className="w-100 h-100"
              style={{ objectFit: 'cover' }}
            />
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.45), rgba(0,0,0,0.2))' }} />
            <div className="position-absolute bottom-0 start-0 p-4 text-white">
              <h3 className="fw-bold mb-1">Surgery Management</h3>
              <p className="mb-0 text-white-50">Effortless scheduling. Seamless care.</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 d-flex">
          <div className="card shadow-sm border-0 my-auto w-100" style={{ borderRadius: '0.75rem', marginLeft: '0', marginRight: '0' }}>
            <div className="card-body p-4 p-md-5">
              {flash && (
                <div className={`alert alert-${flash.type} alert-dismissible fade show`} role="alert">
                  {flash.text}
                  <button type="button" className="btn-close" aria-label="Close" onClick={() => setFlash(null)}></button>
                </div>
              )}
              <div className="text-center mb-3">
                <h4 className="fw-semibold mb-1">
                  {activeTab === 'login' ? 'Welcome back' : 'Create your account'}
                </h4>
                <div className="text-muted small">
                  {activeTab === 'login'
                    ? 'Secure access to the Surgery Management System'
                    : 'Join to coordinate care and manage schedules'}
                </div>
              </div>
              <ul className="nav nav-pills justify-content-center mb-4">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'login' ? 'active' : ''}`}
                    onClick={() => setActiveTab('login')}
                  >
                    Login
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'signup' ? 'active' : ''}`}
                    onClick={() => setActiveTab('signup')}
                  >
                    Sign Up
                  </button>
                </li>
              </ul>
              <div>
                {activeTab === 'login'
                  ? <Login embedded />
                  : <Signup
                      embedded
                      onSignedUp={() => {
                        setActiveTab('login');
                        setFlash({ type: 'success', text: 'Your account was created successfully. Please log in to continue.' });
                      }}
                    />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;

