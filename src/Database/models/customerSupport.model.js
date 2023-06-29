/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CustomerSupport extends Model {
    static associate(models) {
      // define association here
    }
  }
  CustomerSupport.init(
    {
      fullname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      }

    },
    {
      sequelize,
      modelName: 'CustomerSupport'
    }
  );
  return CustomerSupport;
};
