'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LikesFile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LikesFile.init({
    userId: DataTypes.INTEGER,
    fileId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'likes_files',
  });
  return LikesFile;
};