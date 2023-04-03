/* eslint-disable linebreak-style */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/newline-after-import */
/* eslint-disable linebreak-style */
import 'dotenv/config';

import express from 'express';

import cors from 'cors';

import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

import db from './src/Database/models';

import resetPassword from './src/routes/reset-password.routes';

import signupRouter from './src/routes/signup.routes';

import testRouter from './src/routes/test.routes';

import loginRouter from './src/routes/login.routes';

const app = express();

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'E-commerce API',
      description: 'E-commerce API Information',
      servers: [
        {
          url: process.env.DEPLOYED_API_URL,
        },
      ],
    },
  },

  apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

db.sequelize.sync()
  .then(() => {
    console.log('Synced db.');
  })
  .catch((err) => {
    console.log(`Failed to sync db: ${err.message}`);
  });

app.get('/home', (req, res) => {
  res.status(200).send('WELCOME!');
});

app.use('/api', testRouter);
app.use('/api', resetPassword);
app.use('/api', signupRouter);
app.use('/api/', loginRouter);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Hello, world');

  console.log(`Server is running on port ${port}.`);
});
module.exports = app;
