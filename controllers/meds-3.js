const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;



const createMeds = async (req, res) => {
  /* #swagger.tags = ['Meds']
     #swagger.description = 'Create a new medication'
     #swagger.parameters['body'] = {
       in: 'body',
       description: 'Medication information',
       required: true,
       schema: { $ref: '#/definitions/Meds' }
     }
  */
  try {
      const meds = {
          Name: req.body.Name,
          FillDate: req.body.FillDate,
          Prescription: req.body.Prescription,
          Rx: req.body.Rx,
          Qty: req.body.Qty,
          Prescriber: req.body.Prescriber,
          Pharmacist: req.body.Pharmacist,
          NDC: req.body.NDC,
          Insurance: req.body.Insurance,
          ClaimReference: req.body.Claim,
          Price: req.body.Price
      };
      
      const response = await mongodb
          .getDb()
          .db()
          .collection('Pharma2')
          .insertOne(meds);  // Note: changed from med to meds

      if (response.acknowledged) {
          res.status(201).json(response);
      } else {
          res.status(500).json(response.error || 'Error occurred while creating Med.');
      }
  } catch (err) {
      res.status(500).json(err);
  }
};