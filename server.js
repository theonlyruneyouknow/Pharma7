const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
const cors = require('cors');
require('dotenv').config();
const { authRouter, checkJwt } = require('./middleware/auth0');
const mongodb = require('./db/connect');
const os = require('os');
const requiresAuth = require('./middleware/requiresAuth');
const expressLayouts = require('express-ejs-layouts');
const authBridge = require('./middleware/auth-bridge');

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

// Set up view engine before any routes
app.use(expressLayouts);
app.set('layout', 'layout');
app.set('view engine', 'ejs');
app.set('views', './views');

// IMPORTANT: Add Auth0 middleware FIRST
app.use(authRouter);

// Now you can define routes that use res.oidc
app.get('/login', (req, res) => {
  // Get the returnTo from query string or use the referer as fallback
  const returnTo = req.query.returnTo || req.headers.referer || '/';
  
  // Store it in the session or as a parameter
  res.oidc.login({
    returnTo: returnTo
  });
});

// Custom logout route - will now work because authRouter is already loaded
app.get('/custom-logout', (req, res) => {
  res.oidc.logout({ returnTo: process.env.BASE_URL || 'http://localhost:4000' });
});

// API documentation - protected with authentication
app.use('/api-docs', requiresAuth, swaggerUi.serve);
app.get('/api-docs', requiresAuth, (req, res) => {
  // Extract the access token from the Auth0 session
  const accessToken = req.oidc.accessToken?.access_token || '';
  
  const swaggerHtml = swaggerUi.generateHTML(swaggerDocument, {
    customSiteTitle: 'Pharma API Documentation',
    customfavIcon: '',
    customCss: `
      .swagger-ui .topbar { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; }
      .logout-btn { color: #fff; background-color: #dc3545; padding: 5px 15px; border-radius: 4px; text-decoration: none; margin-left: 10px; }
      .nav-link { color: #fff; text-decoration: none; margin: 0 15px; }
      .nav-container { display: flex; align-items: center; }
    `
  });
  
  // Insert navigation and logout button into the Swagger HTML
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
  
  // Add script to automatically set the bearer token for all requests
  if (accessToken) {
    modifiedHtml = modifiedHtml.replace(
      '</body>',
      `<script>
        // Auto-authorize with the token from the Auth0 session
        window.onload = function() {
          // Wait for Swagger UI to initialize
          setTimeout(function() {
            // Pre-fill the auth token
            const authBtn = document.querySelector('.authorize');
            if (authBtn) {
              // Click the authorize button
              authBtn.click();
              
              // Fill in the token field
              setTimeout(function() {
                const tokenField = document.querySelector('input[data-parameter-name="Authorization"]');
                if (tokenField) {
                  tokenField.value = "Bearer ${accessToken}";
                  
                  // Submit the form
                  const authorizeBtn = document.querySelector('.auth-btn-wrapper button.authorize');
                  if (authorizeBtn) {
                    authorizeBtn.click();
                  }
                }
              }, 500);
            }
          }, 1000);
        };
      </script>
      </body>`
    );
  }
  
  // Make sure to actually send the modified HTML
  res.send(modifiedHtml);
});

// Protected profile route
app.get('/profile', requiresAuth, (req, res) => {
  res.render('profile', {
    title: 'User Profile',
    isAuthenticated: req.oidc.isAuthenticated(),
    user: req.oidc.user
  });
});

// Add the auth bridge middleware before API routes
app.use(authBridge);

// Protected API routes with JWT check
app.use('/meds', checkJwt, require('./routes/meds'));

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