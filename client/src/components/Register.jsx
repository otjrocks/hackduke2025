import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL + '/user/register', { email, username, password },
        { withCredentials: true } // This includes cookies with the request
      );
      if (response.data.success) {
        navigate('/browse');
      }
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error occurred while registering');
    }
  };

  return (
    <div>
      <Header />
      <h2>Register</h2>
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
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        <button type="submit">Register</button>
        <Link to={"/login"}>Already have an account?</Link>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default Register;
