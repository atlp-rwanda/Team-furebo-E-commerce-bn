/* jshint esversion: 6 */

// This code will test that the express server is running successfully and can 
// fetch data about the current environment correctly via dotenv.

const express = require('express');
const app = express()
require('dotenv').config()
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const passport = require("passport")
require("./src/middleware/auth")
const isLoggedIn = require("./src/middleware/isLoggedIn")
const session = require('express-session');
app.use(session({ secret: "cats" }));
app.use(passport.initialize());
app.use(passport.session());



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



app.get('/home', (req, res) => {
  res.status(200).send('WELCOME!');
});

// const routes = require("./src/routes/app")



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



app.get("/", (req, res)=>{
  res.status(200).send('<a href="/auth/google">Authenticate with Google</a>')
})

app.get("/auth/google",
passport.authenticate("google", {scope: ['email', 'profile']})
)

app.get("/google/callback", 
passport.authenticate('google', {
  successRedirect:"/protected",
  failureRedirect:"/auth/failure"
})
)
app.get("/auth/failure",(req, res) =>{
  res.send("Something went wrong")
})

app.get("/protected",isLoggedIn, (req,res)=>{
  res.status(200).send("Hello end user")
})

app.get('/home', (req, res) => {
  res.status(200).send('WELCOME!');
});



// set port for listening to the requests 
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});
