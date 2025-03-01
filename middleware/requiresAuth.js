// Enhanced middleware to check if user is authenticated
const requiresAuth = (req, res, next) => {
  if (!req.oidc.isAuthenticated()) {
    // Store the requested URL and redirect to login
    const returnTo = req.originalUrl;
    return res.redirect(`/login?returnTo=${encodeURIComponent(returnTo)}`);
  }
  next();
};

module.exports = requiresAuth;