const express = require('express');
const router = express.Router();

// Import controllers
const baseController = require('../controllers');
const secondController = require('../controllers/second');
const myFamilyController = require('../controllers/myFamily');
const contactController = require('../controllers/contact_test');

// Define routes
router.get('/wife', myFamilyController.getWife);
router.get('/son', myFamilyController.getSon);
router.get('/daughter1', myFamilyController.getDaughter1);
router.get('/daughter2', myFamilyController.getDaughter2);
router.get('/Age3', myFamilyController.getAge3);

router.get('/', (req, res) => {
  res.render('index', {
    title: 'Home',
    isAuthenticated: req.oidc.isAuthenticated(),
    user: req.oidc.isAuthenticated() ? req.oidc.user : null
  });
});

router.get('/savanna', baseController.getSavanna);
router.get('/hannah', baseController.getHannah);
router.get('/Age', baseController.getAge);

router.get('/savanna2', secondController.getSavanna2);
router.get('/hannah2', secondController.getHannah2);
router.get('/Age2', secondController.getAge2);

// Use other route files
router.use('/contacts', require('./contacts'));
router.get('/contact', contactController.getContact);
router.use('/meds', require('./meds'));

// Add a health check endpoint that doesn't require authentication
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

module.exports = router;