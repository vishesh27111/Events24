import React from 'react'
import { Link } from 'react-router-dom';
import '../css/DashboardNav.css';

const DashboardNav = () => {
  return (
    <nav className="dashboard-navbar">
        <Link to="/dashboard/all-events" className="dashboard-link">All Events</Link>
        <Link to="/dashboard/create-event" className="dashboard-link">Create Event</Link>
        <Link to="/dashboard/update-event" className="dashboard-link">Update Event</Link>
        <Link to="/dashboard/search-event" className="dashboard-link">Search Event</Link>
        <Link to="/dashboard/saved-events" className="dashboard-link">Saved Events</Link>
    </nav>
  )
}

export default DashboardNav
