import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Profile() {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Make request to the backend to fetch user data
        const response = await axios.get('http://localhost:3001/user/userinfo', {
          withCredentials: true, // Include cookies for session management
        });

        if (response.data.success) {
          // User is authenticated, set user info
          setUserInfo(response.data.user);
        } else {
          // If not authenticated, set error message
          setError(response.data.message || 'User not authenticated');
        }
      } catch (err) {
        // Handle any errors during the fetch
        console.error('Error fetching user data:', err);
        setError('Failed to fetch user info');
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    // Redirect to logout route to clear cookies and session
    window.location.href = 'http://localhost:3001/user/logout'; // Full URL for logout
  };

  if (error) {
    return (
      <div className="error">
        <h2>{error}</h2>
        <button onClick={() => window.location.href = 'http://localhost:3001/user/login'}>Go to Login</button>
      </div>
    );
  }

  if (!userInfo) {
    return <div>Loading...</div>; // Show loading state while waiting for user data
  }

  return (
    <div className="profile-page">
  <div className="profile-header">
    <h1>Welcome, {userInfo.nickname}!</h1>
    <p className="greeting">You're logged in as {userInfo.email}</p>
  </div>

  <div className="profile-details">
    <div className="detail">
      <strong>Email:</strong> <span>{userInfo.email}</span>
    </div>
    <div className="detail">
      <strong>Nickname:</strong> <span>{userInfo.nickname || 'N/A'}</span>
    </div>
  </div>
  <h1></h1>
  <button className="logout-btn" onClick={handleLogout}>Logout</button>
</div>

  );
}




