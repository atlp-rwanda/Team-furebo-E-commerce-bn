
const express = require('express')
const testRouter = require('./src/routes/test.routes');

const app = express()

require('dotenv').config();

const port = process.env.PORT;
app.use('/', testRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});

module.exports = app;