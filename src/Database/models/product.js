/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  /**
   * @class
   */
  class Product extends Model {
    static associate(models) {
      // Define associations here, if any
      this.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }

  Product.init(
    {
      name: DataTypes.STRING,
      image: DataTypes.ARRAY(DataTypes.STRING),
      price: DataTypes.DECIMAL(10, 2),
      quantity: DataTypes.INTEGER,
      category: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      status: DataTypes.STRING,
      exDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Product',
    }
  );

  return Product;
};
