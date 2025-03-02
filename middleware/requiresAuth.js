module.exports = function requiresAuth(req, res, next) {
  // Check if oidc is available
  if (!req.oidc) {
    console.warn('Auth middleware not properly initialized, redirecting to login');
    return res.redirect('/login');
  }
  
  // Check if authenticated
  if (!req.oidc.isAuthenticated()) {
    return res.redirect(`/login?returnTo=${encodeURIComponent(req.originalUrl)}`);
  }
  
  // User is authenticated, proceed
  next();
};