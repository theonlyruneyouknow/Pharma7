const getName = (req, res) => {
    res.send('Sarah Birch');
  };

const getSavanna = (req, res) => {
    res.send('Savanna Birch');
  };
  
  const getHannah = (req, res) => {
    res.send('Hannah Birch');
  };

 const getAge = (req, res) => {
  // #swagger.tags = ['Contacts']
  // #swagger.description = 'Endpoint to update all contacts'
    res.send('Age: 30');
  };

  module.exports = { getHannah, getSavanna, getName, getAge };



// // Routes
// router.get('/', (req, res) => {
//     // res.json({ message: 'Welcome to the API' });
//     res.send('Welcome to the API');
// });

// // Error handling
// router.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ error: 'Something broke!' });
// });
