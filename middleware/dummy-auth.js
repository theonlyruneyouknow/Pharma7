// A very simple middleware function for testing
module.exports = function dummyAuth(req, res, next) {
  // Simulate auth state based on a query param or cookie for easier testing
  const isLoggedIn = req.query.login === 'true' || req.cookies?.loggedIn === 'true';
  
  req.oidc = { 
    isAuthenticated: () => isLoggedIn,
    user: isLoggedIn ? {
      name: 'Test User',
      email: 'test@example.com',
      sub: 'dummy-123',
      picture: null
    } : null,
    login: (options) => {
      res.cookie('loggedIn', 'true', { maxAge: 900000 });
      const returnTo = options?.returnTo || '/';
      return res.redirect(returnTo);
    },
    logout: (options) => {
      res.clearCookie('loggedIn');
      return res.redirect('/');
    }
  };
  next();
};

// Remove these route definitions - they belong in server.js
// app.get('/login', (req, res) => {
//   const returnTo = req.query.returnTo || '/';
//   req.oidc.login({ returnTo });
// });
// 
// app.get('/logout', (req, res) => {
//   req.oidc.logout();
// });