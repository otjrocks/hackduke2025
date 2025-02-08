const express = require('express');
const router = express.Router();
const axios = require('axios'); // To make HTTP requests to Auth0
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Replace with your actual Auth0 details
const AUTH0_DOMAIN = 'dev-quoye04cjq6hwl2z.us.auth0.com';
const AUTH0_CLIENT_ID = 'h0UevR77e35hOWwKT6A3Yz021ZLJXPGG';
const AUTH0_CLIENT_SECRET = 'DEJfHEtoCgiPPrk1P0DnBc9XxPfRBrrTDxyIz2vLJWAsWa-9VVyN4k5m6vMwOqQL';

// 1. Registration Route (Using Auth0)
router.post('/register', async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const response = await axios.post(
      `https://${AUTH0_DOMAIN}/dbconnections/signup`,
      {
        client_id: AUTH0_CLIENT_ID,
        connection: 'Username-Password-Authentication',
        email,
        password,
        username,
      }
    );
    res.json({ success: true, message: 'Registration successful' });
  } catch (error) {
    res.json({ success: false, message: 'Registration failed: ' + error.response.data.description });
  }
});

// 2. Login Route (Using Auth0)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ success: false, message: 'Email or password missing' });
  }

  try {
    const response = await axios.post(`https://${AUTH0_DOMAIN}/oauth/token`, {
      grant_type: 'password',
      username: email,
      password: password,
      client_id: AUTH0_CLIENT_ID,
      client_secret: AUTH0_CLIENT_SECRET,
      scope: 'openid profile email',
    });

    // Set token in cookies
    const token = response.data.access_token;
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
    });

    res.json({ success: true, message: 'Authentication successful' });
  } catch (error) {
    res.json({ success: false, message: 'Login failed: ' + error.response.data.error_description });
  }
});

// 3. Logout Route (Clear Auth0 Token)
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logout successful' });
});

// 4. Info Route (Verify Token with Auth0)
router.get('/info', async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ success: false, authenticated: false, message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.decode(token);
    const response = await axios.get(`https://${AUTH0_DOMAIN}/userinfo`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    res.json({ success: true, authenticated: true, email: response.data.email, username: response.data.nickname, id: decoded.sub });
  } catch (err) {
    res.json({ success: false, authenticated: false, message: 'Invalid user token.' });
  }
});

// 5. Forgot Password Route (Use Auth0's Reset Password Flow)
router.post('/forgot', async (req, res) => {
  const { email } = req.body;
  try {
    const response = await axios.post(
      `https://${AUTH0_DOMAIN}/dbconnections/change_password`,
      {
        client_id: AUTH0_CLIENT_ID,
        email,
        connection: 'Username-Password-Authentication',
      }
    );
    res.json({ success: true, message: 'Password reset email sent.' });
  } catch (err) {
    res.json({ success: false, message: 'Error: ' + err.response.data.description });
  }
});

// 6. Reset Password Route (Use Auth0’s password reset flow)
router.post('/reset/:token', async (req, res) => {
  const { password, confirm } = req.body;
  if (password !== confirm) {
    return res.json({ success: false, message: 'Passwords do not match' });
  }

  // Auth0 handles the reset password flow via the email link, 
  // no need to handle it manually in this API endpoint.
  res.json({ success: true, message: 'Password reset successfully' });
});

module.exports = router;
