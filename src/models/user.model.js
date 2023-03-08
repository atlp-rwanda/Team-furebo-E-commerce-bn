module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
      names: {
        type: Sequelize.STRING // Data types
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
    });
  
    return User;
  };