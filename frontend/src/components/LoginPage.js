import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import "./style.css"
const LoginPage = ({base_url}) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); 
    const handleLogin = async (e) => {
        e.preventDefault();

        const loginDetails = {
            "email": email,
            "password": password
        };

        try {
            const response = await axios.get(
                base_url + "/loginUser",
                { params :  loginDetails  }
            )

            if(response.status === 200){
                alert("Successfully logged in.")
                localStorage.setItem("userId", response.data.data.userId)
                navigate('/dashboard')
            }
            else{
                alert("Invalid credentials")
            }

        } catch (error) {
            console.error('There was an error!', error);
        }
    }
  return (
    <div className='form'>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default LoginPage
