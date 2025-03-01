const validator = require('../helpers/validate');

const saveContact = (req, res, next) => {
  // Remove the object check that's rejecting complex objects
  // (Delete or comment out the if block that checks for objects)

  const validationRule = {
    Name: 'required|string',
    FillDate: 'string',
    Prescription: 'string',
    Rx: 'integer',
    Qty: 'integer',
    Prescriber: 'string',
    Pharmacist: 'string',
    NDC: 'integer',
    Insurance: 'string',
    // Change this to accept any type instead of requiring a string
    // ClaimReference: 'string',  
    Price: 'string'
  };

  // Uncomment the validator function to actually perform validation
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err,
        submittedData: req.body
      });
    } else {
      next();
    }
  });
};

module.exports = {
  saveContact
};