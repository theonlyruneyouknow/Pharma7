const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: "Pharma API",
        description: "Week7 CSE 341 - Rune Larsen",
        version: "1.0.0"
    },
    host: process.env.NODE_ENV === 'production'
        ? 'pharma7.onrender.com'
        : 'localhost:4000',
    schemes: process.env.NODE_ENV === 'production'
        ? ['https']
        : ['http', 'https'],
    // Add CORS configuration for Swagger
    securityDefinitions: {
        bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
        }
    },
    security: [{
        bearerAuth: []
    }]
    // Rest of your configuration...
};

const outputFile = './swagger-output.json';
const routes = ['./routes/*.js'];

swaggerAutogen(outputFile, routes, doc);