const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patient');
const consultantRoutes = require('./routes/consultant');
const surgeryRoutes = require('./routes/surgery');
const labRoutes = require('./routes/lab');
const pharmacyRoutes = require('./routes/pharmacy');
const feedbackRoutes = require('./routes/feedback');
const appointmentRoutes = require('./routes/appointment');

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Hospital Management System API',
    version: '1.0.0',
    description: 'API documentation for Hospital Management System',
  },
  servers: [
    { url: 'http://localhost:3000' }
  ],
  paths: {
    '/api/auth/signup': {
      post: {
        summary: 'Sign up a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  username: { type: 'string' },
                  password: { type: 'string' }
                },
                required: ['username', 'password']
              }
            }
          }
        },
        responses: {
          200: { description: 'Signup successful' },
          400: { description: 'Missing fields' },
          500: { description: 'User exists or DB error' }
        }
      }
    },
    '/api/auth/login': {
      post: {
        summary: 'Login a user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  username: { type: 'string' },
                  password: { type: 'string' }
                },
                required: ['username', 'password']
              }
            }
          }
        },
        responses: {
          200: { description: 'Login successful' },
          401: { description: 'Invalid credentials' }
        }
      }
    },
    '/api/patient': {
      post: {
        summary: 'Submit patient info',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  prescription: { type: 'string' },
                  status: { type: 'string' }
                },
                required: ['name', 'status']
              }
            }
          }
        },
        responses: {
          200: { description: 'Patient info submitted' },
          400: { description: 'Missing fields' },
          500: { description: 'DB error' }
        }
      }
    },
    '/api/consultant': {
      post: {
        summary: 'Select consultant for a patient',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  patientId: { type: 'integer' },
                  consultantName: { type: 'string' }
                },
                required: ['patientId', 'consultantName']
              }
            }
          }
        },
        responses: {
          200: { description: 'Consultant selected' },
          400: { description: 'Missing fields' },
          500: { description: 'DB error' }
        }
      }
    },
    '/api/surgery': {
      post: {
        summary: 'Schedule a surgery',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  patientId: { type: 'integer' },
                  doctor: { type: 'string' },
                  date: { type: 'string' },
                  consent: { type: 'string' }
                },
                required: ['patientId', 'doctor', 'date', 'consent']
              }
            }
          }
        },
        responses: {
          200: { description: 'Surgery scheduled' },
          400: { description: 'Missing fields' },
          500: { description: 'DB error' }
        }
      }
    },
    '/api/lab': {
      post: {
        summary: 'Submit lab results',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  surgeryId: { type: 'integer' },
                  sampleName: { type: 'string' },
                  result: { type: 'string' }
                },
                required: ['surgeryId', 'sampleName', 'result']
              }
            }
          }
        },
        responses: {
          200: { description: 'Lab result submitted' },
          400: { description: 'Missing fields' },
          500: { description: 'DB error' }
        }
      }
    },
    '/api/pharmacy': {
      post: {
        summary: 'Provide medicine to patient',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  patientId: { type: 'integer' },
                  medicineName: { type: 'string' }
                },
                required: ['patientId', 'medicineName']
              }
            }
          }
        },
        responses: {
          200: { description: 'Medicine provided' },
          400: { description: 'Missing fields' },
          500: { description: 'DB error' }
        }
      }
    },
    '/api/feedback': {
      post: {
        summary: 'Submit feedback',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  patientId: { type: 'integer' },
                  feedbackText: { type: 'string' }
                },
                required: ['patientId', 'feedbackText']
              }
            }
          }
        },
        responses: {
          200: { description: 'Feedback submitted' },
          400: { description: 'Missing fields' },
          500: { description: 'DB error' }
        }
      }
    },
    '/api/appointment': {
      post: {
        summary: 'Schedule an appointment',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  patientId: { type: 'integer' },
                  doctor: { type: 'string' },
                  date: { type: 'string' },
                  consent: { type: 'string' }
                },
                required: ['patientId', 'doctor', 'date', 'consent']
              }
            }
          }
        },
        responses: {
          200: { description: 'Appointment scheduled' },
          400: { description: 'Missing fields' },
          500: { description: 'DB error' }
        }
      }
    }
  }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/auth', authRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/consultant', consultantRoutes);
app.use('/api/surgery', surgeryRoutes);
app.use('/api/lab', labRoutes);
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/appointment', appointmentRoutes);

app.get('/', (req, res) => {
  res.send('Hospital Management System API');
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));