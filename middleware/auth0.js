require('dotenv').config();
const { auth } = require('express-openid-connect');

// Get the correct base URL for the environment
const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://pharma7.onrender.com';
  }
  return process.env.BASE_URL || 'http://localhost:4000';
};

// Check for required environment variables
const requiredVars = ['AUTH0_SECRET', 'AUTH0_CLIENT_ID', 'AUTH0_CLIENT_SECRET', 'AUTH0_DOMAIN'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars.join(', '));
  console.error('Current environment variables:', Object.keys(process.env).join(', '));
  
  if (process.env.NODE_ENV === 'production') {
    // In production, throw an error to prevent starting with incorrect config
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}

// Configure Auth0 with environment-specific settings
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: getBaseUrl(),
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN || 'your-auth0-domain.us.auth0.com'}`,
  authorizationParams: {
    response_type: 'code',
    scope: 'openid profile email'
  }
};

// Add extensive debug logging
console.log('Auth0 configuration:');
console.log('- Environment:', process.env.NODE_ENV);
console.log('- Base URL:', config.baseURL);
console.log('- Issuer URL:', config.issuerBaseURL);
console.log('- Auth0 Domain:', process.env.AUTH0_DOMAIN);
console.log('- Client ID present:', !!process.env.AUTH0_CLIENT_ID);
console.log('- Client Secret present:', !!process.env.AUTH0_CLIENT_SECRET);
console.log('- Secret present:', !!process.env.AUTH0_SECRET);

module.exports = auth(config);