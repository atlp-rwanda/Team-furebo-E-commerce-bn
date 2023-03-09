/* jshint esversion: 6 */

// This code will test that the express server is running successfully and can
// fetch data about the current environment correctly via dotenv.

const express = require('express');
const testRouter = require('./src/routes/test.routes');

const app = express();

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'E-commerce API',
      description: 'E-commerce API Information',
      servers: [
        {
          url: 'http://localhost:3000',
        },
      ],
    },
  },

  apis: ['index.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /home:
 *  get:
 *      description: Display homepage
 *      responses:
 *          '200':
 *              description: successful request
 */



app.get('/home', (req, res) => {
  res.status(200).send('WELCOME!');
});

app.use('/', testRouter);


const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
module.exports = app;
