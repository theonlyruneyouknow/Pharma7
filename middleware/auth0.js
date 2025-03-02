require('dotenv').config();
const { auth } = require('express-openid-connect');

// Environment-aware baseURL function
const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://pharma7.onrender.com';
  }
  return process.env.BASE_URL || 'http://localhost:4000';
};

// Absolute minimum configuration with environment-aware baseURL
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: getBaseUrl(),  // <-- Use the environment-aware function here
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`
};

// Log configuration for debugging
console.log('Auth0 Configuration Check:');
console.log('- Environment:', process.env.NODE_ENV || 'development');
console.log('- Base URL:', config.baseURL);
console.log('- Domain:', process.env.AUTH0_DOMAIN);
console.log('- Client ID length:', process.env.AUTH0_CLIENT_ID ? process.env.AUTH0_CLIENT_ID.length : 0);
console.log('- Client Secret length:', process.env.AUTH0_CLIENT_SECRET ? process.env.AUTH0_CLIENT_SECRET.length : 0);

module.exports = auth(config);