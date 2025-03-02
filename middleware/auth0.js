require('dotenv').config();
const { auth } = require('express-openid-connect');

// Determine if we're in production
const isProduction = process.env.NODE_ENV === 'production';
const domain = process.env.AUTH0_DOMAIN;
const baseUrl = isProduction ? 'https://pharma7.onrender.com' : 'http://localhost:4000';

// Log critical configuration
console.log('Environment mode:', isProduction ? 'Production' : 'Development');
console.log('Base URL:', baseUrl);
console.log('Auth0 Domain:', domain);

// Special configuration for Render deployment
// Better approach for handling secrets
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET, // No fallback for production
  baseURL: baseUrl,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  authorizationParams: {
    response_type: 'code',
    scope: 'openid profile email'
  },
  // clientAuthMethod: 'client_secret_basic'
};

// In production
if (isProduction) {
  // Special logging to debug Auth0 issues
  console.log('Auth0 Config for Production:', {
    baseURL: baseUrl,
    domain: domain,
    clientAuthMethod: config.clientAuthMethod,
    hasSecret: !!process.env.AUTH0_SECRET,
    hasClientId: !!process.env.AUTH0_CLIENT_ID,
    hasClientSecret: !!process.env.AUTH0_CLIENT_SECRET
  });
  
  // Always provide a fallback for Render
  if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_CLIENT_ID || !process.env.AUTH0_CLIENT_SECRET) {
    console.warn('WARNING: Missing Auth0 credentials, using mock authentication for testing');
    module.exports = function mockAuth(req, res, next) {
      req.oidc = {
        isAuthenticated: () => false,
        user: null
      };
      next();
    };
  } else {
    try {
      module.exports = auth(config);
      console.log('Auth0 middleware initialized successfully for production');
    } catch (error) {
      console.error('Failed to initialize Auth0 middleware:', error);
      module.exports = function(req, res, next) {
        req.oidc = { isAuthenticated: () => false, user: null };
        next();
      };
    }
  }
} else {
  // Development environment
  try {
    module.exports = auth(config);
    console.log('Auth0 middleware initialized successfully for development');
  } catch (error) {
    console.error('Failed to initialize Auth0 middleware:', error);
    module.exports = function(req, res, next) {
      req.oidc = { isAuthenticated: () => false, user: null };
      next();
    };
  }
}