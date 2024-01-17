"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class upload_files extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	upload_files.init(
		{
			filePath: DataTypes.STRING,
			userId: DataTypes.INTEGER,
			fileName: DataTypes.STRING,
			fileSize: DataTypes.STRING,
			topic: DataTypes.STRING,
			subTopic: DataTypes.STRING,
			description: DataTypes.STRING,
			tags: DataTypes.STRING,
			audienceRolesIds: DataTypes.JSON,
			fileType: DataTypes.STRING,
			isPrivate: DataTypes.BOOLEAN,
		},
		{
			sequelize,
			paranoid: true,
			modelName: "upload_files",
		}
	);
	return upload_files;
};
