const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const contactsController = require('../controllers/contacts');

const medsController = require('../controllers/meds');

const getAllMeds = async (req, res, next) => {
  // #swagger.tags = ['Meds']
  // #swagger.description = 'Endpoint to get all MEDS contacts'
  const result = await mongodb.getDb().db().collection('Pharma2').find();
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  });
};

const updateMeds = async (req, res) => {
  // #swagger.tags = ['Meds']
  // #swagger.description = 'Endpoint to update all Meds'
  const userId = new ObjectId(req.params.id);
  // be aware of updateOne if you only want to update specific fields
  const contact = {
    
    Name: req.body.Name,
    FillDate: req.body.FillDate,
    Prescription: req.body.Prescription,
    Rx: req.body.Rx,
    Qty: req.body.Qty,
    Prescriber: req.body.Prescriber,
    Pharmacist: req.body.Pharmacist,
    NDC: req.body.NDC,
    Insurance: req.body.Insurance,
    ClaimReference: req.body.ClaimReference,
    Price: req.body.Price

    // firstName: req.body.firstName,
    // lastName: req.body.lastName,
    // email: req.body.email,
    // favoriteColor: req.body.favoriteColor,
    // birthday: req.body.birthday
  };
  const response = await mongodb
    .getDb()
    .db()
    .collection('Pharma2')
    .replaceOne({ _id: userId }, contact);
  console.log(response);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while updating the Med.');
  }
};

//POST request to get a single contact
const postsingleMeds = async (req, res, next) => {
  // #swagger.tags = ['Meds']
  // #swagger.description = 'Endpoint to post one Meds'
  try {
    const userId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDb()
      .db()
      .collection('Pharma2')
      .findOne({ _id: userId });

    if (!result) {
      res.status(404).json('Contact not found');
      return;
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

const createMeds = async (req, res) => {
  /* #swagger.tags = ['Meds']
     #swagger.description = 'Endpoint to create a new medication'
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
      ClaimReference: req.body.ClaimReference,
      Price: req.body.Price
    };
    
    const response = await mongodb
      .getDb()
      .db()
      .collection('Pharma2')
      .insertOne(meds);

      if (response.acknowledged) {
        res.status(201).json(response);
      } else {
        res.status(500).json(response.error || 'Error occurred while creating Med.');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  };

const getSingleMeds = async (req, res) => {
  // #swagger.tags = ['Meds']
  // #swagger.description = 'Endpoint to get one Meds'
  try {
    // Validate ID format
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json('Invalid Med ID format');
      return;
    }

    const userId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDb()
      .db()
      .collection('Pharma2')
      .findOne({ _id: userId });

    if (!result) {
      res.status(404).json('Med not found');
      return;
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const deleteMeds = async (req, res) => {
  // #swagger.tags = ['Meds']
  // #swagger.description = 'Endpoint to delete a Meds'
  try {
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json('Invalid Med ID format');
      return;
    }
    
    const userId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDb()
      .db()
      .collection('Pharma2')
      .deleteOne({ _id: userId },true);
      
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'Error deleting Med.');
    }
  } catch (err) {
    res.status(500).json(err);
  }
};


module.exports = { getAllMeds, getSingleMeds, updateMeds, 
  postsingleMeds, deleteMeds,
  createMeds };
