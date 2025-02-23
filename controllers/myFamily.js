const getWife = (req, res) => {
  // #swagger.tags = ['Contacts']
  // #swagger.description = 'Endpoint to update all contacts'
    res.send('LeaAnne');
  };

const getSon = (req, res) => {
  // #swagger.tags = ['Contacts']
  // #swagger.description = 'Endpoint to update all contacts'
    res.send('Samuel');
  };

const getDaughter1 = (req, res) => {
  // #swagger.tags = ['Contacts']
  // #swagger.description = 'Endpoint to update all contacts'
    res.send('Lynn');
  };
  
  const getDaughter2 = (req, res) => {
    // #swagger.tags = ['Contacts']
    // #swagger.description = 'Endpoint to update all contacts'
    res.send('Lilly');
  };

 const getAge3 = (req, res) => {
  // #swagger.tags = ['Contacts']
  // #swagger.description = 'Endpoint to update all contacts'
    res.send('Age: 54');
  };

  module.exports = { getWife, getSon, getDaughter1, getDaughter2, getAge3 };
