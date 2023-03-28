/* eslint-disable linebreak-style */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/newline-after-import */
/* eslint-disable linebreak-style */
import 'dotenv/config';

import express from 'express';

import swaggerUi from 'swagger-ui-express';

import db from './src/models';

import testRouter from './src/routes/test.routes';

import userRouter from './src/routes/user.routes';

const app = express();

const YAML = require('yamljs');
const swaggerDocument = YAML.load('src/swagger/Password-Reset.swagger.yaml');

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
app.use('/', userRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  // console.log('Hello, world');

  console.log(`Server is running on port ${port}.`);
});
module.exports = app;
