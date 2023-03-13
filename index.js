// This code will test that the express server is running successfully and can 
// fetch data about the current environment correctly via dotenv.

require('dotenv').config();
const express = require('express')
const app = express()


const port = process.env.PORT;

app.get('/home',(req,res)=>{
    res.status(200).send("WELCOME!");
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});


