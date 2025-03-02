const { auth } = require('express-openid-connect');
const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

// Determine environment-specific base URL
const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://pharma7.onrender.com';
  }
  return process.env.BASE_URL || 'http://localhost:4000';
};

// Configure Auth0 with environment-aware baseURL
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: getBaseUrl(),
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET, // Make sure this is added
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`
};

// Log the configuration for debugging
console.log('Auth0 Configuration:');
console.log('- Environment:', process.env.NODE_ENV || 'development');
console.log('- Base URL:', config.baseURL);
console.log('- Domain:', process.env.AUTH0_DOMAIN);

// Auth router setup
const authRouter = auth(config);

// JWT validation middleware
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

module.exports = { authRouter, checkJwt };