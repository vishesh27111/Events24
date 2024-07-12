import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import HomePage from './components/HomePage';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';

function App() {

  let endpoint = 'https://67xbe5jpg9.execute-api.us-east-1.amazonaws.com/dev'
  return (
    <Router>
      <div>
          <Navbar />
          <Routes>
            <Route path="/signup" element={<SignupPage base_url={endpoint}/>} />
            <Route path="/login" exact="true" element={<LoginPage base_url={endpoint}/>} />
            <Route path="/dashboard/*" exact="true" element={<Dashboard/>} />
          </Routes>
      </div>
    </Router>
  );
}


export default App;
