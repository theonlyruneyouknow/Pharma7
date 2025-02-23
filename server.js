const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
const cors = require('cors');

const os = require('os');

// Configure CORS
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 200,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Add middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add CORS middleware
app.use(cors());

const mongodb = require('./db/connect');

// Set view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/', require('./routes'))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const interfaceName of Object.keys(interfaces)) {
    const addresses = interfaces[interfaceName];
    for (const addr of addresses) {
      if (addr.family === 'IPv4' && !addr.internal) {
        return addr.address;
      }
    }
  }
  return 'localhost';
}

// const cors = require('cors');



mongodb.initDb((err, mongodb) => {
    if (err) {
      console.log(err);
    } else {
        const PORT = process.env.PORT || 4000;
        const localIP = getLocalIP();
        // Configure CORS
//         app.use(cors({
//         origin: [
//         'https://pharma7.onrender.com',
//         'http://localhost:4000'
//         ],
//         methods: ['GET', 'POST', 'PUT', 'DELETE'],
//         credentials: true
// }));





        app.listen(PORT, '0.0.0.0', () => {
          console.log(`Server is running on http://localhost:${PORT}/api-docs`);
          // console.log(`Network access: https://${localIP}:${PORT}/api-docs`);
        //   app.listen(port);
        //   console.log(`Connected to DB and listening on ${port}`);
        });
    }
}
)
;



// // Start server
// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });