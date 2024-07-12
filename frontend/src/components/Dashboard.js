import React from 'react'
import { Routes, Route } from 'react-router-dom';
import DashboardNav from './DashboardNav';
import AllEvents from './AllEvents';
import CreateEvent from './CreateEvent';
import SearchEvent from './SearchEvent';
import Update from  './Update';
import ChatBot from './ChatBot';

const Dashboard = () => {

  let endpoint = 'https://67xbe5jpg9.execute-api.us-east-1.amazonaws.com/dev';
  return (
    <div>
    <DashboardNav />
    <ChatBot />
    <Routes>
      <Route path="all-events" element={<AllEvents base_url = {endpoint} />} />
      <Route path="create-event" element={<CreateEvent base_url = {endpoint} />} />
      <Route path="update-event" element={<Update base_url = {endpoint} />} />
      <Route path="search-event" element={<SearchEvent base_url = {endpoint} />} />
      {/* <Route path="saved-events" element={<SavedEvents base_url = {endpoint} />} /> */}
    </Routes>
  </div>
  )
}

export default Dashboard
