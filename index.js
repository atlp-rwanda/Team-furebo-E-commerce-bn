// This code will test that the express server is running successfully and can
// fetch data about the current environment correctly via dotenv.

import express from 'express';
import dotenv from 'dotenv';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import passport from 'passport';
import './src/middleware/auth';
import isLoggedIn from './src/middleware/isLoggedIn';

const app = express();
dotenv.config();
const port = process.env.PORT;

app.use(express.json());

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'E-commerce API',
      description: 'E-commerce API Information',
      servers: [
        {
          url: 'https://team-furebo-e-commerce-bn.onrender.com',
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

app.get('/', (req, res) => {
  res.status(200).send('<a href="/auth/google">Authenticate with Google</a>');
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

app.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: '/protected',
    failureRedirect: '/auth/failure',
  })
);

app.get('/auth/failure', (req, res) => {
  res.send('Something went wrong');
});

app.get('/protected', isLoggedIn, (req, res) => {
  res.status(200).send('Hello end user');
});

app.get('/home', (req, res) => {
  res.status(200).send('WELCOME!');
});

// set port for listening to the requests
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
