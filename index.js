import 'dotenv/config';

import express from 'express';

import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import db from './src/models';

import testRouter from './src/routes/test.routes';

import userRouter from './src/routes/user.routes';

const app = express();

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

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

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

app.use('/', testRouter);
app.use('/api', userRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  // console.log('Hello, world');

  console.log(`Server is running on port ${port}.`);
});
module.exports = app;
