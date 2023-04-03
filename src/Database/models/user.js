/* eslint-disable linebreak-style */
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  // eslint-disable-next-line require-jsdoc
  class User extends Model {
    // eslint-disable-next-line require-jsdoc
    static associate() {
      // define association here
    }
  }
  User.init({
    fullname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
