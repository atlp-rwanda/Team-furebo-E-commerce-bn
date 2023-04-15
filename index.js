/* eslint-disable linebreak-style */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/newline-after-import */
/* eslint-disable linebreak-style */
import 'dotenv/config';

import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

import db from './src/Database/models';

import resetPassword from './src/routes/reset-password.routes';

import signupRouter from './src/routes/signup.routes';

import testRouter from './src/routes/test.routes';

import createProduct from './src/routes/createProduct.routes';

import updateProduct from './src/routes/updateProduct.routes';
import addToWishList from './src/routes/addToWishList.routes';
import editProduct from './src/routes/edit-product.routes';

const app = express();

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

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
app.use('/api', createProduct);
app.use('/api', updateProduct);
app.use('/api', addToWishList);
app.use('/api', editProduct);

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  // console.log('Hello, world');

  console.log(`Server is running on port ${port}.`);
});
module.exports = app;
