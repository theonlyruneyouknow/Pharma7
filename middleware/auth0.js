require('dotenv').config();
const { auth } = require('express-openid-connect');

// Get the correct base URL for the environment
const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://pharma7.onrender.com';
  }
  return process.env.BASE_URL || 'http://localhost:4000';
};

// Configure Auth0 with environment-specific settings
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: getBaseUrl(),
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  authorizationParams: {
    response_type: 'code',
    scope: 'openid profile email'
  }
};

// Add debug logging in production
if (process.env.NODE_ENV === 'production') {
  console.log('Auth0 config baseURL:', config.baseURL);
}

module.exports = auth(config);