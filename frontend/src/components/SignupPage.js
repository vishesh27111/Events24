import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import "./style.css"

const SignupPage = ({base_url}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); 

    const subscribeEvent = async (email) => {
      const response = await axios.get(
        base_url + "/subscribe",
        { params :  { "email": email}  }
      )
    }
    const handleSignup = async (e) => {
        e.preventDefault();
        const signupDetails = {
            "email": email,
            "password": password
        };

        try {
            const response = await axios.get(
                base_url + "/createUser",
                { params :  signupDetails  }
              )
            const res = response.data.message;
            alert(res);
            if(res === "Successfully signed up. You are sent a confirmation mail to subscribe to events."){
                subscribeEvent(email);
                navigate('/login');
                setEmail("");
                setPassword("");
            }
        } catch (error) {
            console.error('There was an error during signup:', error);
        }
    }
  return (
    <div className='form'>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Signup</button>
      </form>
    </div>
  )
}

export default SignupPage
