'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class academicDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  academicDetails.init({
    userId: DataTypes.NUMBER,
    qualifications: DataTypes.STRING,
    institute: DataTypes.STRING,
    place: DataTypes.STRING,
    graduationDate: DataTypes.STRING,
    graduationYear: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'academicDetails',
  });
  return academicDetails;
};