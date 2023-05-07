'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    class OrderStatus extends Model {
        static associate(models) {
            OrderStatus.belongsTo(models.Order, { 
                foreignKey: 'orderId',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });
        }
    }
    OrderStatus.init(
        {
            orderId: DataTypes.INTEGER,
            status: DataTypes.STRING,
            deliveryDate: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'OrderStatus',
        }
    );
    return OrderStatus;
};