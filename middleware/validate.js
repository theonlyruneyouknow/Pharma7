const validator = require('../helpers/validate');

const saveContact = (req, res, next) => {
  const validationRule = {

    Name: 'required|string',
    FillDate: 'required|string',
    Prescription: 'required|string',
    Rx : 'required|integer',
    Qty: 'required|integer',
    Prescriber: 'required|string',
    Pharmacist: 'required|string',
    NDC: 'required|integer',
    Insurance: 'required|string',
    ClaimReference: '',
    Price: 'required|string'


    // firstName: 'required|string',
    // lastName: 'required|string',
    // email: 'required|email',
    // favoriteColor: 'required|string',
    // birthday: 'string'
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};

module.exports = {
  saveContact
};
