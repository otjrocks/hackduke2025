const express = require('express');
const router = express.Router();
const axios = require('axios');
const cookieParser = require('cookie-parser');

router.use(cookieParser());

// Auth0 Config
const AUTH0_DOMAIN = 'dev-quoye04cjq6hwl2z.us.auth0.com';
const AUTH0_CLIENT_ID = 'h0UevR77e35hOWwKT6A3Yz021ZLJXPGG';
const AUTH0_CLIENT_SECRET = 'DEJfHEtoCgiPPrk1P0DnBc9XxPfRBrrTDxyIz2vLJWAsWa-9VVyN4k5m6vMwOqQL';
const AUTH0_CALLBACK_URL = 'http://localhost:3001/user/callback'; // Update if deployed
const AUTH0_LOGOUT_URL = 'http://localhost:3000'; // Update to your app's homepage

// 1. Redirect User to Auth0 Login Page
router.get('/login', (req, res) => {
  const authUrl = `https://${AUTH0_DOMAIN}/authorize?response_type=code&client_id=${AUTH0_CLIENT_ID}&redirect_uri=${AUTH0_CALLBACK_URL}&scope=openid profile email`;
  res.redirect(authUrl);
});

// 2. Handle Auth0 Callback (Exchange Auth Code for Access Token)
router.get('/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.json({ success: false, message: 'Authorization code missing' });
  }

  try {
    const response = await axios.post(`https://${AUTH0_DOMAIN}/oauth/token`, {
      grant_type: 'authorization_code',
      client_id: AUTH0_CLIENT_ID,
      client_secret: AUTH0_CLIENT_SECRET,
      code,
      redirect_uri: AUTH0_CALLBACK_URL,
    });

    const { access_token, id_token } = response.data;

    // Store tokens in HTTP-only cookies
    res.cookie('token', access_token, { httpOnly: true, secure: false, sameSite: 'Strict' });
    res.cookie('id_token', id_token, { httpOnly: true, secure: false, sameSite: 'Strict' });

    res.redirect('http://localhost:3000/profile'); 
  } catch (error) {
    console.error('Error exchanging code for token:', error.response?.data || error.message);
    res.json({ success: false, message: 'Authentication failed' });
  }
});

// 3. Logout (Clear Cookies & Redirect to Auth0 Logout)
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.clearCookie('id_token');

  const logoutUrl = `https://${AUTH0_DOMAIN}/v2/logout?client_id=${AUTH0_CLIENT_ID}&returnTo=${AUTH0_LOGOUT_URL}`;
  res.redirect(logoutUrl);
});

// 4. Get User Info
router.get('/userinfo', async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ success: false, authenticated: false, message: 'Unauthorized' });
  }

  try {
    const response = await axios.get(`https://${AUTH0_DOMAIN}/userinfo`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    res.json({ success: true, authenticated: true, user: response.data });
  } catch (error) {
    res.json({ success: false, authenticated: false, message: 'Invalid user token.' });
  }
});

module.exports = router;
