import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const isAuth = !!localStorage.getItem('user');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success">
      <div className="container">
        <Link className="navbar-brand" to={isAuth ? "/dashboard" : "/login"}>Hospital Management</Link>
        <div>
          {!isAuth && <Link className="btn btn-light mx-1" to="/login">Login</Link>}
          {!isAuth && <Link className="btn btn-light mx-1" to="/signup">Sign Up</Link>}
          {isAuth && <Link className="btn btn-light mx-1" to="/dashboard">Dashboard</Link>}
          {isAuth && <button className="btn btn-danger mx-1" onClick={handleLogout}>Logout</button>}
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 