'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class files_thumbnails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  files_thumbnails.init({
    thumbnailPath: DataTypes.STRING,
    fileId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'files_thumbnails',
  });
  return files_thumbnails;
};