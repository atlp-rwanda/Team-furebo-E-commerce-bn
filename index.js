
const express = require('express')
const testRouter = require('./src/routes/test.routes');

const app = express()
require('dotenv').config();

app.use('/', testRouter);

const port = process.env.PORT ||3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});

module.exports = app;

