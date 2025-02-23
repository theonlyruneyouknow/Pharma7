const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res, next) => {
  // #swagger.tags = ['Contacts']
  // #swagger.description = 'Endpoint to get all contacts'
  const result = await mongodb.getDb().db().collection('contacts').find();
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  });
};

const updateContact = async (req, res) => {
  // #swagger.tags = ['Contacts']
  // #swagger.description = 'Endpoint to update all contacts'
  const userId = new ObjectId(req.params.id);
  // be aware of updateOne if you only want to update specific fields
  const contact = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday
  };
  const response = await mongodb
    .getDb()
    .db()
    .collection('contacts')
    .replaceOne({ _id: userId }, contact);
  console.log(response);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while updating the contact.');
  }
};

//POST request to get a single contact
const postsingle = async (req, res, next) => {
  // #swagger.tags = ['Contacts']
  // #swagger.description = 'Endpoint to post one contact'
  try {
    const userId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDb()
      .db()
      .collection('contacts')
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

const createContact = async (req, res) => {
  // #swagger.tags = ['Contacts']
  // #swagger.description = 'Endpoint to create a contact'
  try {
    const contact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday
    };
    
    const response = await mongodb
      .getDb()
      .db()
      .collection('contacts')
      .insertOne(contact);

      if (response.acknowledged) {
        res.status(201).json(response);
      } else {
        res.status(500).json(response.error || 'Error occurred while creating contact.');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  };



const getSingle = async (req, res) => {
  // #swagger.tags = ['Contacts']
  // #swagger.description = 'Endpoint to get one contact'
  try {
    // Validate ID format
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json('Invalid contact ID format');
      return;
    }

    const userId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDb()
      .db()
      .collection('contacts')
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
};

const deleteContact = async (req, res) => {
  // #swagger.tags = ['Contacts']
  // #swagger.description = 'Endpoint to delete a contact'
  try {
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json('Invalid contact ID format');
      return;
    }
    
    const userId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDb()
      .db()
      .collection('contacts')
      .deleteOne({ _id: userId },true);
      
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'Error deleting contact.');
    }
  } catch (err) {
    res.status(500).json(err);
  }
};



module.exports = { getAll, getSingle, updateContact, postsingle, deleteContact,
  createContact };
