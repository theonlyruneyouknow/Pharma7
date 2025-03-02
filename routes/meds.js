const express = require('express');
const router = express.Router();

const medsController = require('../controllers/meds');

const validation = require('../middleware/validate');

// At the top of your route file
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  // Handle OPTIONS method
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

router.get('/', medsController.getAllMeds);

router.get('/:id', medsController.getSingleMeds);

// router.post('/',  medsController.createMeds);
// router.put('/:id',  medsController.createMeds);
router.post('/', validation.saveContact, medsController.createMeds);
router.put('/:id', validation.saveContact, medsController.updateMeds);
router.delete('/:id', medsController.deleteMeds);

module.exports = router;
