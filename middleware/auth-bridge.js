/**
 * This middleware extracts the Auth0 access token and adds it to the Authorization header
 * to make it available for the JWT validation middleware
 */
const authBridge = (req, res, next) => {
  // If user is authenticated via Auth0 and has an access token
  if (req.oidc && req.oidc.isAuthenticated() && req.oidc.accessToken) {
    // Set the Authorization header with the Bearer token
    req.headers.authorization = `Bearer ${req.oidc.accessToken.access_token}`;
  }
  next();
};

module.exports = authBridge;