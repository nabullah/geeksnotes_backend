"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class views_file extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	views_file.init(
		{
			views: DataTypes.INTEGER,
			fileId: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "views_file",
		}
	);
	return views_file;
};
