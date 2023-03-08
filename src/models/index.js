require('dotenv').config();

const dbConfig = require("../config/db.config.js"); //Exposing config file

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig[process.env.NODE_ENV]?.url, // Used TO connect to db using env to determine the mode we are working in  
    {
       dialect: "postgres",
       ...dbConfig[process.env.NODE_ENV]?.options 
    }
  
   );

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.model.js")(sequelize, Sequelize); // creating table in the database using user.model.js details
module.exports = db;