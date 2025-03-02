const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
const cors = require('cors');
require('dotenv').config();
const mongodb = require('./db/connect');
const os = require('os');
const requiresAuth = require('./middleware/requiresAuth');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');

// Add this right after your app creation
app.enable('trust proxy'); // Important for secure cookies behind proxy

// Import routes
const medsRoutes = require('./routes/meds');

// Choose ONE auth approach - either Auth0 OR dummy auth, not both
// For now, let's use the dummy auth which we know works
// const dummyAuth = require('./middleware/dummy-auth');
const auth0Middleware = require('./middleware/auth0');

// Configure CORS
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  preflightContinue: false,
  optionsSuccessStatus: 200,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 600
};

// Add middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());

// Set up view engine before any routes
app.use(expressLayouts);
app.set('layout', 'layout');
app.set('view engine', 'ejs');
app.set('views', './views');

// Apply the Auth0 middleware
app.use(auth0Middleware);

// Remove custom login/logout routes since Auth0 will handle them
// app.get('/login', (req, res) => {...});
// app.get('/logout', (req, res) => {...});

// Instead, if you need to customize the redirect:
app.get('/custom-login', (req, res) => {
  res.oidc.login({
    returnTo: req.query.returnTo || '/'
  });
});

// If you need custom parameters for logout:
app.get('/custom-logout', (req, res) => {
  res.oidc.logout({
    returnTo: process.env.BASE_URL || 'http://localhost:4000'
  });
});

// Add this near your other routes
if (process.env.NODE_ENV === 'production') {
  // Fallback login/logout for Render in case Auth0 isn't working
  app.get('/login', (req, res) => {
    // If Auth0 is working, this won't be hit due to middleware order
    console.log('Fallback login route hit - Auth0 might not be configured correctly');
    res.render('login', { 
      title: 'Login',
      error: 'Auth0 authentication is currently unavailable. Please try again later.',
      isAuthenticated: false,
      user: null
    });
  });
  
  app.get('/logout', (req, res) => {
    res.redirect('/');
  });

  // Handle Auth0 callback errors
  app.get('/callback', (req, res, next) => {
    if (req.query.error) {
      console.error('Auth0 callback error:', req.query.error, req.query.error_description);
      return res.render('login', {
        title: 'Login Failed',
        error: `Authentication error: ${req.query.error_description || req.query.error}`,
        isAuthenticated: false,
        user: null
      });
    }
    next();
  });
}

// Protected API documentation
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', requiresAuth, (req, res) => {
  // This ensures it's properly protected
  const swaggerHtml = swaggerUi.generateHTML(swaggerDocument, {
    customSiteTitle: 'Pharma API Documentation',
    customCss: `
      .swagger-ui .topbar { display: flex; justify-content: space-between; align-items: center; }
      .nav-link { color: #fff; text-decoration: none; margin: 0 15px; }
      .logout-btn { color: #fff; background-color: #dc3545; padding: 5px 15px; border-radius: 4px; text-decoration: none; margin-left: 10px; }
      .nav-container { display: flex; align-items: center; }
    `
  });
  
  // Insert navigation with conditional login/logout
  let modifiedHtml = swaggerHtml.replace(
    '<div class="topbar">',
    `<div class="topbar">
      <div class="wrapper">
        <div class="topbar-wrapper">
          <a class="link" href="#"><img src="https://cdn-icons-png.flaticon.com/512/8841/8841503.png" alt="Swagger UI" height="40"> <span>Pharma API</span></a>
        </div>
      </div>
      <div class="nav-container">
        <a href="/" class="nav-link">Home</a>
        <a href="/profile" class="nav-link">Profile</a>
        <a href="/logout" class="logout-btn">Logout</a>
      </div>`
  );
  
  // Send the modified HTML
  res.send(modifiedHtml);
});

// Simple routes to test authentication
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Home',
    isAuthenticated: req.oidc.isAuthenticated(),
    user: req.oidc.isAuthenticated() ? req.oidc.user : null
  });
});

// Protected profile route
app.get('/profile', requiresAuth, (req, res) => {
  res.render('profile', {
    title: 'User Profile',
    isAuthenticated: req.oidc.isAuthenticated(),
    user: req.oidc.user
  });
});

// Use meds routes with JWT protection
app.use('/meds', requiresAuth, medsRoutes);

// Main routes
app.use('/', require('./routes'));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Database connection and server start
mongodb.initDb((err, mongodb) => {
  if (err) {
    console.log(err);
  } else {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  }
});