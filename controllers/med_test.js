const express = require('express');
const router = express.Router();

const medsController = require('../controllers/meds');
  router.get('/', medsController.getAllMeds);

  router.get('/:id', medsController.getSingleMeds);
  router.post('/', medsController.createMeds);

const getMeds = (req, res) => {
    res.render('meds', { title: 'Meds' });
  };

  module.exports = { getMeds };
