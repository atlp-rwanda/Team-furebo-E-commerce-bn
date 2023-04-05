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
import bodyParser from 'body-parser';
import resetPassword from './src/routes/reset-password.routes';
import signupRouter from './src/routes/signup.routes';
import createProduct from './src/routes/createProduct.routes';
import updateProduct from './src/routes/updateProduct.routes';
import disableAccount from './src/routes/disableAccount.routes';
import login from './src/routes/login.routes';
import googleAuth from './src/routes/google-auth.routes';
const app = express();
require('./src/services/auth');
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(cors({ origin: 'http://localhost:3000/google/callback' }));

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
app.use(googleAuth);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/home', (req, res) => {
  res.status(200).send('WELCOME!');
});
app.use('/api', resetPassword);
app.use('/api', signupRouter);
app.use('/api', login);
app.use('/api', createProduct);
app.use('/api', updateProduct);
app.use('/api', disableAccount);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});

module.exports = app;
