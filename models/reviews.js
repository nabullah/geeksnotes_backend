'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reviews extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  reviews.init({
    userId: DataTypes.INTEGER,
    fileId: DataTypes.INTEGER,
    reviewText: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'reviews',
  });
  return reviews;
};