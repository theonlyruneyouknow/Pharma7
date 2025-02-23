const express = require('express');
const router = express.Router();

const medsController = require('../controllers/meds');

const validation = require('../middleware/validate');

router.get('/', medsController.getAllMeds);

router.get('/:id', medsController.getSingleMeds);

// router.post('/',  medsController.createMeds);
// router.put('/:id',  medsController.createMeds);
router.post('/', validation.saveContact, medsController.createMeds);
router.put('/:id', validation.saveContact, medsController.createMeds);
router.delete('/:id', medsController.createMeds);

module.exports = router;
