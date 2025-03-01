const { auth } = require('express-openid-connect');
const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

// Configure Auth0
const config = {
  authRequired: false,  // Change to false to allow public routes
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.BASE_URL || 'http://localhost:4000',
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET, // Add this line
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  authorizationParams: {
    response_type: 'code',
    audience: process.env.AUTH0_AUDIENCE, // Make sure this is set in your .env
    scope: 'openid profile email'
  },
  routes: {
    login: false,
    logout: '/logout',
    callback: '/callback'
  },
  logoutParams: {
    returnTo: process.env.BASE_URL || 'http://localhost:4000'
  }
};

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