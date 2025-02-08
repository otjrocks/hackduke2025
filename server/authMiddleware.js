const axios = require('axios');
const AUTH0_DOMAIN = 'dev-quoye04cjq6hwl2z.us.auth0.com'; // Your Auth0 domain

const checkAuthentication = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ success: false, authenticated: false, message: 'Unauthorized' });
  }

  // Make a request to Auth0's userinfo endpoint to get user data
  axios.get(`https://${AUTH0_DOMAIN}/userinfo`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(response => {
      // Token is valid, extract user data (email, name, etc.)
      const { email, name } = response.data;
      req.user = { email, name }; // Attach user data to the request object
      next(); // Proceed to the next middleware or route handler
    })
    .catch(error => {
      return res.json({ success: false, authenticated: false, message: 'Invalid user token.' });
    });
};

module.exports = checkAuthentication;
