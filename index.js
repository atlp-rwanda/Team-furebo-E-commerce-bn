// This code will test that the express server is running successfully and can 
// fetch data about the current environment correctly via dotenv.

const express = require('express')

const app = express()

require('dotenv').config();

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});

