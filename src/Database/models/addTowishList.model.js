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
  class Wishlist extends Model {
    static associate(models) {
      // Define associations here, if any
    }
  }

  Wishlist.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      user: DataTypes.STRING,
      products: DataTypes.ARRAY(DataTypes.STRING)
    },
    {
      sequelize,
      modelName: 'Wishlist',
    }
  );
  return Wishlist;
};
