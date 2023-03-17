/* jshint esversion: 6 */

// This code will test that the express server is running successfully and can 
// fetch data about the current environment correctly via dotenv.

const express = require('express');
const app = express()
require('dotenv').config()


// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
const db = require("./src/models");

db.sequelize.sync()
  .then(() => {
    console.log('Synced db.');
  })
  .catch((err) => {
    console.log('Failed to sync db: ' + err.message);
  });


// set port for listening to the requests
const port = process.env.PORT; 
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});


