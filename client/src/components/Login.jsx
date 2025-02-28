import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import Header from './Header';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL + '/user/login', 
        { email, password },
        { withCredentials: true } // This includes cookies with the request
      );
      if (response.data.success) { // Ensure success is in the correct place
        navigate('/profile'); // Redirect to the desired route
      }
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error occurred while logging in');
    }
  };

  return (
    <div>
      <Header />
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        <Link to={"/register"}>Create an account</Link>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default Login;
