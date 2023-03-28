/* eslint-disable linebreak-style */
const { Model } = require('sequelize');

/**
 * @param {data} sequelize .
 * @param {data} DataTypes .
 * @returns {data} .
 */
module.exports = (sequelize, DataTypes) => {
  /**
   * @class
   */
  class ResetToken extends Model {
    /**
 * @param {data} models .
 * @returns {data} .
 */
    static associate(models) {
      ResetToken.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }
  ResetToken.init(
    {
      token: DataTypes.STRING,
      expires: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'ResetToken',
    }
  );
  return ResetToken;
};
