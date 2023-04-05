/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  /**
   * @class
   */
  class Product extends Model {
    static associate(models) {
      // Define associations here, if any
    }
  }

  Product.init(
    {
      name: DataTypes.STRING,
      image: DataTypes.STRING,
      price: DataTypes.DECIMAL(10, 2),
      quantity: DataTypes.INTEGER,
      type: DataTypes.STRING,
      status: DataTypes.STRING,
      exDate: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'Product',
    }
  );

  return Product;
};
