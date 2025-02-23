const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: "Pharma API",
        description: "Week7 CSE 341 - Rune Larsen",
        name: "Rune",
        version: "1.0.0",
        contact: {
            name: "Rune Larsen",
            email: "theonlyrune@byui.edu",
            url: "https://pharma7.onrender.com/api-docs"
        },
       
    },
    host: process.env.NODE_ENV === 'production' 
        ? 'pharma7.onrender.com'
        : 'localhost:4000',
    // host: 'localhost:4000',
    schemes: process.env.NODE_ENV === 'production' 
    ? ['https'] 
    : ['http', 'https'],
    basePath: '/',
    // Added HTTPS
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        // {
        //     name: 'Family',
        //     description: 'Endpoints for managing contacts'
        // },
        // {
        //     name: 'Users',
        //     description: 'User management endpoints'
        // }
    ],
    securityDefinitions: {  // Added security definitions
        apiKey: {
            type: 'apiKey',
            name: 'api_key',
            in: 'header'
        },
        OAuth2: {
            type: 'oauth2',
            flow: 'implicit',
            authorizationUrl: 'http://example.com/oauth/authorize'
        }
    },
    parameters: {  // Added global parameters
        limitParam: {
            name: 'limit',
            in: 'query',
            description: 'Maximum number of records to return',
            type: 'integer'
        }
    },
    responses: {  // Added common responses
        NotFound: {
            description: "Resource not found"
        },
        InvalidInput: {
            description: "Invalid input"
        }
    },
    definitions: {
        "post": {
        "tags": [
          "Meds"
        ],
        "description": "Endpoint to create a Meds test",
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "schema": {
              "type": "object",
              "properties": {
                "Name": {
                  "example": "any"
                },
                "FillDate": {
                  "example": "any"
                },
                "Prescription": {
                  "example": "any"
                },
                "Rx": {
                  "example": "integer"
                },
                "Qty": {
                  "example": "integer"
                },
                "Prescriber": {
                  "example": "any"
                },
                "Pharmacist": {
                  "example": "any"
                },
                "NDC": {
                  "example": "any"
                },
                "Insurance": {
                  "example": "any"
                },
                "Claim": {
                  "example": "any"
                },
                "Price": {
                  "example": "any"
                }
              }
            }
          }
        // }
        // }
        ],

        
    //     Meds: {
            
    //             "Name": "any",
    //             "FillDate": "any",
    //             "Prescription": "any",
    //             "Rx": "Integer",
    //             "Qty": "Integer",
    //             "Prescriber": "any",
    //             "Pharmacist": "any",
    //             "NDC": "Integer",
    //             "Insurance": "any",
    //             "Claim": "any",
    //             "Price": "any"
              
        }
    },
    definitions: {
        
        Contact: {
            firstName: 'Sarah',
            lastName: 'Birch',
            email: 'sarah@test.com',
            favoriteColor: 'Blue',
            birthday: '1990-01-01',
            Name: 'Rune',
        }
    },

    definitions: {
      Meds: {
          type: "object",
          properties: {
              Name: { type: "string", example: "Medication Name" },
              FillDate: { type: "string", example: "2025-02-22" },
              Prescription: { type: "string", example: "12345" },
              Rx: { type: "integer", example: 1234 },
              Qty: { type: "integer", example: 30 },
              Prescriber: { type: "string", example: "Dr. Smith" },
              Pharmacist: { type: "string", example: "John Doe" },
              NDC: { type: "string", example: "1234567890" },
              Insurance: { type: "string", example: "Insurance Co" },
              Claim: { type: "string", example: "CLM123" },
              Price: { type: "string", example: "100.00" }
          }
      }
  }
};



const outputFile = './swagger-output.json';
const routes = ['./routes/index.js'];

// Generate Swagger JSON file
swaggerAutogen(outputFile, routes, doc);