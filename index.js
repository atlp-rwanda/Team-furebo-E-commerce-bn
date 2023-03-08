// This code will test that the express server is running successfully and can 
// fetch data about the current environment correctly via dotenv.

const express = require('express')
const app = express()
const db = require('./src/models'); // Exposes the db configurations
const userRouter = require('./src/routes/route');  // Exposes routes to the server


// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


db.sequelize.sync()
  .then(() => {
    console.log('Synced db.');
  })
  .catch((err) => {
    console.log('Failed to sync db: ' + err.message);
  });


app.use('/', userRouter);

// set port for listening to the requests
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});

