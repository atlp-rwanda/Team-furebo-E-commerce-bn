'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: 'userId' });
    }
  };
  Order.init({
    userId: DataTypes.INTEGER,
    products: DataTypes.ARRAY(DataTypes.JSONB),
    deliveryAddress: DataTypes.JSONB,
    paymentInformation: DataTypes.JSONB,
    status: DataTypes.STRING,
    totalPrice: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};
