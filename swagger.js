const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: "Pharma API",
        description: "Week7 CSE 341 - Rune Larsen",
        version: "1.0.0"
    },
    host: 
        'localhost:4000',
    schemes: ['https', 'http'],
    tags: [
        {
            name: 'Meds',
            description: 'Medications endpoints'
        }
    ],
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
const routes = ['./routes/*.js'];

swaggerAutogen(outputFile, routes, doc);