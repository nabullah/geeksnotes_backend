'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class uploaded_files extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  uploaded_files.init({
    filePath: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    fileName: DataTypes.STRING,
    topic: DataTypes.STRING,
    subTopic: DataTypes.STRING,
    description: DataTypes.STRING,
    audience: DataTypes.JSON,
  }, {
    sequelize,
    modelName: 'uploaded_files',
  });
  return uploaded_files;
};