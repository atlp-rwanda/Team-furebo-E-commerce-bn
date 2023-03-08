module.exports = {
    development: {
      url: process.env.DEVELOPMENT_DB,    // This is the development database
      options: {
        operatorsAliases: false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      }
    },
  
  
    testing: {
      url: process.env.TESTING_DB,   // This is the database for testing
      options: {
        operatorsAliases: false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      }
    },
  
  
    production: {
      url: process.env.PRODUCTION_DB,       // This is the database for production
      options: {
        operatorsAliases: false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      }
    }
  };