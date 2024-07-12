import React from 'react'
import { useLocation, Link } from 'react-router-dom';
import '../css/Navbar.css'

const Navbar = () => {
  const location = useLocation();
  if (location.pathname.startsWith('/dashboard')) {
    return null;
  }


  return (
    <nav className="navbar">
        <h1>My Website</h1>
        <div className="nav-links">
            <Link to="/login" className="btn">Login</Link>
            <Link to="/signup" className="btn">Signup</Link>
        </div>
    </nav>
  )
}

export default Navbar
