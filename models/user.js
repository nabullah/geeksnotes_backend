'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user.init({
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    address: DataTypes.STRING,
    password: DataTypes.STRING,
    mobile: DataTypes.STRING,
    status: DataTypes.STRING,
    userRole: DataTypes.STRING,
    color: DataTypes.STRING,
    profession: DataTypes.STRING,
    academicsDetailId: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};